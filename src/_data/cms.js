/**
 * Shared Directus access for the Eleventy data files.
 *
 * Every loader tries Directus first and only falls back to the content that was
 * seeded from the old Strapi install (kept in ../ctc-cms/content) if the CMS is
 * unreachable. Set CTC_REQUIRE_CMS=1 to make that fallback fatal instead, which
 * is what Cloudflare Pages uses so a CMS outage fails the build rather than
 * publishing stale content.
 *
 * Node 18+ has global fetch, so no node-fetch dependency is needed.
 */
const fs = require("fs");
const path = require("path");

/** The Directus-seed content lives with the CMS scripts - one source of truth. */
const CONTENT_DIR = path.resolve(__dirname, "../../../ctc-cms/content");

/**
 * Eleventy does not load .env files, so do it here. Values already present in the
 * real environment win, which is what CI (Cloudflare Pages) relies on.
 */
function loadDotEnv() {
  let text = "";
  try {
    text = fs.readFileSync(path.resolve(__dirname, "../../.env"), "utf8");
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

loadDotEnv();

const DIRECTUS_URL = (
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  ""
).replace(/\/+$/, "");
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "";
const REQUIRE_CMS = process.env.CTC_REQUIRE_CMS === "1";

const warned = new Set();

function warn(scope, message) {
  if (warned.has(scope)) return;
  warned.add(scope);
  console.warn(`[ctc] ${scope}: ${message}`);
}

function configured() {
  return Boolean(DIRECTUS_URL);
}

async function api(pathname) {
  const headers = {};
  if (DIRECTUS_TOKEN) headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
  const res = await fetch(`${DIRECTUS_URL}${pathname}`, { headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} (${pathname})`);
  }
  const json = await res.json();
  return json.data;
}

/**
 * All published rows of a collection.
 *
 * `sortBy` defaults to the `sort` column that nearly every collection carries, so
 * editors control the order. Pass `null` for a collection without one: Directus
 * answers **403 Forbidden** (not 400) when asked to sort by a field the public
 * role cannot read, which looks like a permissions problem rather than a missing
 * column - exactly the sort of red herring this file exists to avoid.
 */
async function collection(name, sortBy = "sort") {
  const order = sortBy ? `&sort=${encodeURIComponent(sortBy)}` : "";
  const data = await api(
    `/items/${name}?limit=-1&filter[status][_eq]=published${order}`,
  );
  return Array.isArray(data) ? data : [];
}

/**
 * The `site_settings` singleton is read by several data files (announcement,
 * charity, siteSettings). Memoise it so the CMS is only queried once per build.
 */
let settingsPromise = null;

/** The single site_settings row. */
function settings() {
  if (!settingsPromise) {
    settingsPromise = api("/items/site_settings?limit=1").then((data) =>
      Array.isArray(data) ? (data[0] ?? {}) : (data ?? {}),
    );
    // A failed fetch must not be cached, or every later caller repeats the error.
    settingsPromise.catch(() => {
      settingsPromise = null;
    });
  }
  return settingsPromise;
}

/**
 * Bundled copy of the scraped content, used when Directus is unreachable.
 *
 * A missing file is not an error: `site_assets` has no bundled equivalent
 * because its fallback is "keep the local files". A malformed file still throws,
 * so a typo or bad edit is not swallowed.
 */
function bundled(file) {
  const absolute = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(absolute)) {
    warn(file, "no bundled fallback for this collection");
    return [];
  }
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

/**
 * Runs `fromCms(rows)` when Directus answers, otherwise `fromBundled(bundled)`.
 * `scope` is only used for the warning message.
 */
async function load(scope, options) {
  const { collectionName, fallbackFile, fromCms, fromBundled, sortBy } = options;

  if (!configured()) {
    if (REQUIRE_CMS) {
      throw new Error(
        `DIRECTUS_URL is not set, so "${scope}" cannot be loaded while CTC_REQUIRE_CMS=1.`,
      );
    }
    warn(scope, "DIRECTUS_URL is not set - using bundled content");
    return fromBundled(bundled(fallbackFile));
  }

  try {
    return fromCms(await collection(collectionName, sortBy));
  } catch (error) {
    if (REQUIRE_CMS) {
      throw new Error(`Directus read failed for "${scope}": ${error.message}`);
    }
    warn(scope, `${error.message} - using bundled content`);
    return fromBundled(bundled(fallbackFile));
  }
}

/** Same as `load` but for the site_settings singleton. */
async function loadSettings(scope, fallbackFile, fromCms, fromBundled) {
  if (!configured()) {
    if (REQUIRE_CMS) {
      throw new Error(
        `DIRECTUS_URL is not set, so "${scope}" cannot be loaded while CTC_REQUIRE_CMS=1.`,
      );
    }
    warn(scope, "DIRECTUS_URL is not set - using bundled content");
    return fromBundled(bundled(fallbackFile));
  }

  try {
    return fromCms(await settings());
  } catch (error) {
    if (REQUIRE_CMS) {
      throw new Error(`Directus read failed for "${scope}": ${error.message}`);
    }
    warn(scope, `${error.message} - using bundled content`);
    return fromBundled(bundled(fallbackFile));
  }
}

/**
 * Turns a Directus file UUID into a URL the browser can use. Paths that are
 * already absolute (or site-relative) are passed straight through.
 */
function assetUrl(value) {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("/")) return value;
  if (value.startsWith("images/") || value.startsWith("files/")) return `/${value}`;
  return DIRECTUS_URL ? `${DIRECTUS_URL}/assets/${value}` : "";
}

module.exports = { load, loadSettings, assetUrl, DIRECTUS_URL };
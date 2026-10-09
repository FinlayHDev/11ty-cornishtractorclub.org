const { load, assetUrl } = require("./cms");

/**
 * Maps every image/PDF path the templates reference to its Directus asset URL:
 *
 *   { "images/banner/live_banner1.jpg": "https://cms/assets/<uuid>", ... }
 *
 * `getAssetMap` is consumed by the `cmsAssets` transform in .eleventy.js, which
 * rewrites `src="images/..."`, `href="files/..."` and `data-background="..."`
 * attribute values in the generated HTML. That keeps every image and PDF
 * editable in Directus without touching any of the templates.
 *
 * When Directus is unreachable the map is empty and the transform leaves the
 * original local paths alone, so the site still renders from the files in src/.
 */
function map(rows) {
  const map = {};
  for (const row of rows) {
    if (!row.path) continue;
    const url = assetUrl(row.file);
    if (url) map[row.path] = url;
  }
  return map;
}

/** The map is read by .eleventy.js, not by templates, so cache it per build. */
let cached = null;

module.exports = async function () {
  if (cached) return cached;
  cached = await load("site_assets", {
    collectionName: "site_assets",
    fallbackFile: "site-assets.json",
    fromCms: map,
    // No bundled equivalent exists: falling back means "use the local files".
    fromBundled: () => ({}),
  });
  return cached;
};
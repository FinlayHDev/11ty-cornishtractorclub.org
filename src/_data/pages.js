const { load, assetUrl } = require("./cms");

/**
 * The editable `pages` collection, keyed by slug so templates can reach a page
 * directly: `{{ pages.terms.content | safe }}`.
 *
 * Currently used for /terms and /privacy. Anything added to the collection in
 * Directus becomes available here under its slug.
 */
function map(rows) {
  const bySlug = {};
  for (const row of rows) {
    if (!row.slug) continue;
    bySlug[row.slug] = {
      title: row.title || "",
      content: row.content || "",
      heroImage: assetUrl(row.hero_image),
      metaDescription: row.meta_description || "",
    };
  }
  return bySlug;
}

module.exports = async function () {
  return load("pages", {
    collectionName: "pages",
    fallbackFile: "pages.json",
    fromCms: map,
    fromBundled: map,
  });
};
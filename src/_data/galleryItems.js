const { load, assetUrl } = require("./cms");

/**
 * Gallery photos. Either an uploaded image (`file`) or an external link
 * (`external_url`, e.g. Facebook) can be the source, so `image` prefers the
 * upload and falls back to the link.
 */
function map(rows) {
  return rows
    .map((row) => {
      const uploaded = assetUrl(row.file);
      return {
        title: row.title || "",
        year: row.year || "",
        image: uploaded || row.external_url || "",
        link: uploaded || row.external_url || "",
        isUpload: Boolean(uploaded),
      };
    })
    .filter((row) => row.image);
}

module.exports = async function () {
  return load("gallery_items", {
    collectionName: "gallery_items",
    fallbackFile: "gallery-items.json",
    fromCms: map,
    fromBundled: map,
  });
};
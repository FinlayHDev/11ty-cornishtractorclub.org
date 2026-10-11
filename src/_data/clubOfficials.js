const { load, assetUrl } = require("./cms");

/**
 * Club officials (Chairman, Deputy, Treasurer, Membership Secretary) shown on the
 * home page and the contacts page.
 *
 * Shaped for display so the templates stay simple: `tel` is the phone number with
 * spaces stripped, ready for a `tel:` link.
 */
function map(rows) {
  return rows.map((row) => ({
    role: row.role,
    name: row.name || "",
    phone: row.phone || "",
    tel: (row.phone || "").replace(/\s/g, ""),
    photo: assetUrl(row.photo),
  }));
}

module.exports = async function () {
  return load("club_officials", {
    collectionName: "club_officials",
    fallbackFile: "club-officials.json",
    fromCms: map,
    fromBundled: map,
  });
};
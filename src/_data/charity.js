const { loadSettings, assetUrl } = require("./cms");

/**
 * The "We are supporting" charity block on the home page: { name, logo, url }.
 *
 * Replaces Strapi's `supportingCharity` single type, so it is now edited in
 * Directus under Site Settings.
 */
function map(settings) {
  return {
    name: settings.supporting_name || "",
    logo: assetUrl(settings.supporting_logo),
    url: settings.supporting_url || "",
  };
}

module.exports = async function () {
  return loadSettings("charity", "site-settings.json", map, map);
};
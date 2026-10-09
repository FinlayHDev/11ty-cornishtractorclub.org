const { loadSettings } = require("./cms");

/**
 * The hero alert ("2026 RALLY CANCELLED - click here for info - LEARN MORE"),
 * rendered in each of the seven home page slides.
 *
 * Replaces Strapi's `announcementSystem` single type, so it is now edited in
 * Directus under Site Settings.
 *
 * Returns {} when the alert is switched off, which is what the original did when
 * the CMS could not be reached.
 */
function map(settings) {
  if (settings.alert_enabled === false) return {};
  return {
    title: settings.alert_message || "",
    description: settings.alert_text || "",
    link: settings.alert_link_url || "",
  };
}

module.exports = async function () {
  return loadSettings("announcement", "site-settings.json", map, map);
};
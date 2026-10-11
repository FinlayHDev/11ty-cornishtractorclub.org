const { loadSettings, assetUrl } = require("./cms");

/**
 * Global club details for the header, footer and page furniture: contact emails,
 * Facebook links, section headings and the copyright line.
 *
 * The hero alert and the charity block have their own data files because the
 * original templates read them as `announcement` and `charity`.
 */
function map(settings) {
  return {
    clubName: settings.club_name || "Cornish Tractor Club",
    shortName: settings.short_name || "Cornish Tractor Club",
    facebook: settings.facebook_url || "",
    facebookPhotos: settings.facebook_photos_url || settings.facebook_url || "",
    facebookPageName: settings.facebook_page_name || "Cornish Tractor Club",
    contactEmail: settings.contact_email || "",
    membershipEmail: settings.membership_email || "",
    copyright: settings.copyright_text || "Copyright © Cornish Tractor Club",
    aboutTitle: settings.about_title || "About",
    aboutIntro: settings.about_intro || "",
    officialsTitle: settings.officials_title || "Club Officials",
    officialsIntro: settings.officials_intro || "",
    latestNewsTitle: settings.latest_news_title || "Latest News",
    latestNewsText: settings.latest_news_text || "",
    galleryMessage: settings.gallery_message || "",
    supportingName: settings.supporting_name || "",
    supportingUrl: settings.supporting_url || "",
    logo: assetUrl(settings.logo),
  };
}

module.exports = async function () {
  return loadSettings("site_settings", "site-settings.json", map, map);
};
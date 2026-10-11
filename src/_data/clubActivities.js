const { load } = require("./cms");

/**
 * The home page "what we do" cards (Rally, Road Runs, Working Weekends, Quiz
 * Night, Facebook Community, Film Evenings).
 *
 * `body` is CMS rich text, so templates render it with `| safe`.
 */
function map(rows) {
  return rows.map((row) => ({
    title: row.title,
    icon: row.icon || "",
    body: row.body || "",
    linkLabel: row.link_label || "",
    linkUrl: row.link_url || "",
    hasLink: Boolean(row.link_url && row.link_label),
  }));
}

module.exports = async function () {
  return load("club_activities", {
    collectionName: "club_activities",
    fallbackFile: "club-activities.json",
    fromCms: map,
    fromBundled: map,
  });
};
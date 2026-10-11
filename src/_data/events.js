const { load, assetUrl } = require("./cms");

/**
 * Events for the events index, **grouped by year** (newest year first, then
 * chronological within the year) because that is exactly how the page presents
 * them: a `- 2026 -` heading above each run of cards.
 *
 * Nunjucks has no groupBy, so the grouping happens here where it is easy to read
 * and test.
 */
function map(rows) {
  return rows.map((row) => ({
    title: row.title,
    slug: row.slug,
    year: row.year || Number(String(row.start_date || "").slice(0, 4)) || 0,
    dateLabel: row.date_label || "",
    locationLabel: row.location_label || "",
    locationUrl: row.location_url || "",
    summary: row.summary || "",
    image: assetUrl(row.image),
    startDate: row.start_date || "",
    url: `/events/${row.slug}`,
  }));
}

module.exports = async function () {
  const events = await load("events", {
    collectionName: "events",
    fallbackFile: "events.json",
    fromCms: map,
    fromBundled: map,
  });

  const byYear = new Map();
  for (const event of events) {
    if (!byYear.has(event.year)) byYear.set(event.year, []);
    byYear.get(event.year).push(event);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, group]) => ({
      year,
      events: group.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    }));
};
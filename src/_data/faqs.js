const { load } = require("./cms");

/**
 * FAQ accordion items. The `index` is used to build unique collapse targets
 * (`#accordion1`, `#accordion2`, …) that the theme's Bootstrap collapse needs.
 */
function map(rows) {
  return rows.map((row, index) => ({
    index: index + 1,
    question: row.question,
    answer: row.answer || "",
  }));
}

module.exports = async function () {
  return load("faqs", {
    collectionName: "faqs",
    fallbackFile: "faqs.json",
    fromCms: map,
    fromBundled: map,
  });
};
const { load, assetUrl } = require("./cms");

/**
 * The rally entry forms, used by the "Forms" dropdown in all 21 event templates
 * plus the rally pages: { exhibitor, craft, trade, model, termsandconditions }.
 *
 * Backed by the `documents` collection rather than Strapi's `rallyForm` single
 * type, so each form is now an individually editable row.
 */
const CATEGORY_TO_KEY = {
  "rally-exhibitor": "exhibitor",
  "rally-craft": "craft",
  "rally-trade": "trade",
  "rally-model": "model",
  "rally-terms": "termsandconditions",
};

function map(rows) {
  const forms = {
    exhibitor: "",
    craft: "",
    trade: "",
    model: "",
    termsandconditions: "",
  };

  for (const row of rows) {
    const key = CATEGORY_TO_KEY[row.category];
    if (!key) continue;
    forms[key] = row.external_url || assetUrl(row.file) || "";
  }

  return forms;
}

module.exports = async function () {
  return load("rallyforms", {
    collectionName: "documents",
    fallbackFile: "documents.json",
    fromCms: map,
    fromBundled: map,
  });
};
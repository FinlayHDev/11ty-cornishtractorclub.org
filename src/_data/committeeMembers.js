const { load } = require("./cms");

/**
 * Section secretaries and committee members on the contacts page.
 *
 * `hasContact` lets the template decide between a phone button, an email button
 * and a plain "N/A" without three nested conditionals.
 */
function map(rows) {
  return rows.map((row) => {
    const phone = row.phone || "";
    const email = row.email || "";
    return {
      role: row.role,
      name: row.name || "",
      phone,
      tel: phone.replace(/\s/g, ""),
      email,
      hasPhone: Boolean(phone),
      hasEmail: Boolean(email),
    };
  });
}

module.exports = async function () {
  return load("committee_members", {
    collectionName: "committee_members",
    fallbackFile: "committee-members.json",
    fromCms: map,
    fromBundled: map,
  });
};
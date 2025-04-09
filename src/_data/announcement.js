// _data/announcement.js
const fetch = require("node-fetch");

module.exports = async function () {
  try {
    const res = await fetch("https://panel.cornishtractorclub.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            announcementSystem {
              data {
                attributes {
                  title
                  description
                  link
                }
              }
            }
          }
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    console.log("📦 Full GraphQL Response from Strapi:");
    console.dir(data, { depth: null });

    return data.data.announcementSystem.data?.attributes || {};
  } catch (err) {
    console.error("Failed to fetch announcement:", err.message);
    return {};
  }
};

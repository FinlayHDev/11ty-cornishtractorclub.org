// _data/announcement.js
const axios = require("axios");

module.exports = async function () {
  try {
    const res = await axios.post("https://panel.cornishtractorclub.org/graphql", {
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
      `
    });

    console.log("📦 Full GraphQL Response from Strapi:");
    console.dir(res.data, { depth: null });
    return res.data.data.announcement.data?.attributes || {};
  } catch (err) {
    console.error("Failed to fetch announcement:", err.message);
    return {};
  }
};

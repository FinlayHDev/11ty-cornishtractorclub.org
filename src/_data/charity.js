const fetch = require('node-fetch');

module.exports = async function () {
  const query = `
    query {
      supportingCharity {
        data {
          attributes {
            name
            logo { data { attributes { url } } }
            url
          }
        }
      }
    }
  `;

  const res = await fetch('https://panel.cornishtractorclub.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const json = await res.json();

  const base = process.env.STRAPI_BASE_URL || 'https://panel.cornishtractorclub.org';

  const attrs = json.data.supportingCharity.data.attributes; // MUST CHANGE THIS

  return {
    name: base + attrs.name,
    logo: base + attrs.logo?.data?.attributes?.url,
    url: base + attrs.url?.data?.attributes?.url,
  };
};

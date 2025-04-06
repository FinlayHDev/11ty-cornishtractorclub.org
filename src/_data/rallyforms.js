const fetch = require('node-fetch');

module.exports = async function () {
  const query = `
    query {
      rallyForm {
        data {
          attributes {
            Exhibitor { data { attributes { url } } }
            Craft { data { attributes { url } } }
            Trade { data { attributes { url } } }
            Model { data { attributes { url } } }
            TermsAndConditions { data { attributes { url } } }
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

  const base = process.env.STRAPI_BASE_URL || 'https://panel.cornishtractorclub.org/';

  const attrs = json.data.rallyForm.data.attributes;

  return {
    upload_exhibitor: base + attrs.Exhibitor?.data?.attributes?.url,
    upload_craft: 'https://panel.cornishtractorclub.org/',
    upload_trade: base + attrs.Trade?.data?.attributes?.url,
    upload_model: base + attrs.Model?.data?.attributes?.url,
    upload_termsandconditions: base + attrs.TermsAndConditions?.data?.attributes?.url,
  };
};

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

  const base = process.env.STRAPI_BASE_URL || 'https://panel.cornishtractorclub.org';

  const attrs = json.data.rallyForm.data.attributes;

  return {
    exhibitor: base + attrs.Exhibitor?.data?.attributes?.url,
    craft: 'https://facebook.com/',
    trade: base + attrs.Trade?.data?.attributes?.url,
    model: base + attrs.Model?.data?.attributes?.url,
    termsandconditions: base + attrs.TermsAndConditions?.data?.attributes?.url,
  };
};

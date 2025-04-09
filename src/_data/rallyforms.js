const fetch = require('node-fetch');

module.exports = async function () {
  const query = `
    query {
      rallyForm {
        data {
          attributes {
            exhibitor { data { attributes { url } } }
            craft { data { attributes { url } } }
            trade { data { attributes { url } } }
            model { data { attributes { url } } }
            termsandconditions { data { attributes { url } } }
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
    exhibitor: base + attrs.exhibitor?.data?.attributes?.url,
    craft: base + attrs.craft?.data?.attributes?.url,
    trade: base + attrs.trade?.data?.attributes?.url,
    model: base + attrs.model?.data?.attributes?.url,
    termsandconditions: base + attrs.termsandconditions?.data?.attributes?.url,
  };
};

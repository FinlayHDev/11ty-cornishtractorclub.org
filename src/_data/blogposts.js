const fetch = require("node-fetch");

async function getAllBlogposts() {
  const recordsPerQuery = 100;
  let recordsToSkip = 0;
  let makeNewQuery = true;
  let blogposts = [];

  while (makeNewQuery) {
    try {
      const data = await fetch("https://panel.cornishtractorclub.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `{
            blogs(pagination: { limit: 100 }) {
              data {
                attributes {
                  title
                  content
                  publishedAt
                  slug
                  author
                  cover_image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
          }`,
        }),
      });

      const response = await data.json();

      if (response.errors) {
        let errors = response.errors;
        errors.map((error) => {
          console.log(error.message);
        });
        throw new Error("Houston... We have a CMS problem");
      }

      console.log("Response:", response); // Logging the response object

      const blogData = response.data?.blogs?.data;

      if (blogData && Array.isArray(blogData)) {
        blogposts = blogposts.concat(blogData);
      }

      recordsToSkip += recordsPerQuery;

      if (blogData && blogData.length < recordsPerQuery) {
        makeNewQuery = false;
      }

      console.log("Records retrieved:", blogData ? blogData.length : 0); // Logging the number of records retrieved
      console.log("Total blogposts:", blogposts.length); // Logging the current total number of blogposts
    } catch (error) {
      console.error("Error:", error); // Logging any caught error
      throw new Error(error);
    }
  }

  const blogpostsFormatted = blogposts.map((item) => {
    return {
      title: item.attributes.title,
      content: item.attributes.content,
      slug: item.attributes.slug,
      publishedAt: item.attributes.publishedAt,
      cover_image_URL: item.attributes.cover_image?.data?.attributes?.url || "",
      author: item.attributes.author,
    };
  });

  console.log("Final blogposts count:", blogpostsFormatted.length); // Logging the final count of blogposts

  return blogpostsFormatted;
}

module.exports = getAllBlogposts;

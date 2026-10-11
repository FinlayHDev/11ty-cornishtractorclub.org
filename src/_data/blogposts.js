const { load, assetUrl } = require("./cms");

/**
 * Blog posts, consumed by src/blog/list.njk (pagination, size 12) and
 * src/blog/entry.njk (alias `blogpost`).
 *
 * Output shape is unchanged from the Strapi version so the templates keep
 * working: { title, content, slug, publishedAt, cover_image_URL, author }.
 *
 * `cover_image_URL` is now a complete URL. The templates used to prefix it with
 * the dead Strapi host, which is why they no longer do.
 */
function map(rows) {
  return rows.map((row) => ({
    title: row.title,
    content: row.body || "",
    slug: row.slug,
    publishedAt: row.published_at,
    cover_image_URL: assetUrl(row.hero_image),
    author: row.author,
  }));
}

module.exports = async function () {
  const posts = await load("blog_posts", {
    collectionName: "blog_posts",
    fallbackFile: "blog-posts.json",
    fromCms: map,
    fromBundled: map,
    // `blog_posts` has no `sort` column - asking Directus to sort by it returns
    // 403. Posts are ordered by publish date below instead.
    sortBy: null,
  });

  // Newest first.
  return posts.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
};
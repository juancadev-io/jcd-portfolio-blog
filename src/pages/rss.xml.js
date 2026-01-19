import rss from "@astrojs/rss";
import { getBlogPosts } from "../content.config.js";
const title = "JuancaDev - Tech Blog";
const description =
  "Juan Camilo, developer, tech content creator, and game developer enthusiast.";

export async function GET(context) {
  const blogPosts = await getBlogPosts();
  return rss({
    title: title,
    description: description,
    site: context.site,
    items: blogPosts
      .slice()
      .sort(
        (a, b) =>
          new Date(b.data.pubDate).valueOf() -
          new Date(a.data.pubDate).valueOf(),
      )
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/${post.data.lang}/blog/${post.blog_slug}/`,
      })),
  });
}

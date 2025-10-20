import fs from "fs";
import path from "path";
import RSS from "rss";

import siteMetadata, { BASE_URL, defaultAuthor } from "@/lib/metadata";

// Read generated posts data from .contentlayer directory to avoid bundling contentlayer
function getAllPosts() {
  const contentlayerPath = path.join(process.cwd(), ".contentlayer/generated");
  const postsIndexPath = path.join(contentlayerPath, "Post/_index.json");
  const postsData = JSON.parse(fs.readFileSync(postsIndexPath, "utf-8"));
  return postsData.map((fileName: string) => {
    const postPath = path.join(contentlayerPath, "Post", fileName);
    return JSON.parse(fs.readFileSync(postPath, "utf-8"));
  });
}

export async function GET(request: Request) {
  const feed = new RSS({
    title: siteMetadata.title.default,
    description: siteMetadata.description,
    site_url: BASE_URL,
    feed_url: `${BASE_URL}/feed.xml`,
    copyright: `© 2023 ${defaultAuthor.name}`,
    language: "en-US",
    pubDate: new Date(),
  });

  const allPosts = getAllPosts();

  allPosts
    .filter((post: any) => post.status === "published")
    .map((post: any) => {
      feed.item({
        title: post.title,
        guid: `${BASE_URL}/posts/${post.slug}`,
        url: `${BASE_URL}/posts/${post.slug}`,
        date: post.lastUpdatedDate as string,
        description: post.description || "",
        author: defaultAuthor.name,
        categories: post?.tags?.map((tag: string) => tag) || [],
      });
    });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}

import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

import { BASE_URL } from "@/lib/metadata";
import { tagOptions } from "@/lib/tag-options";

// Read generated data from .contentlayer directory to avoid bundling contentlayer
function getContentlayerData() {
  const contentlayerPath = path.join(process.cwd(), ".contentlayer/generated");

  // Read posts - _index.json contains full post objects, not filenames
  const postsIndexPath = path.join(contentlayerPath, "Post/_index.json");
  const allPosts = JSON.parse(fs.readFileSync(postsIndexPath, "utf-8"));

  // Read pages - _index.json contains full page objects, not filenames
  const pagesIndexPath = path.join(contentlayerPath, "Page/_index.json");
  const allPages = JSON.parse(fs.readFileSync(pagesIndexPath, "utf-8"));

  return { allPosts, allPages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const { allPosts, allPages } = getContentlayerData();

  const loadedPosts = allPosts.filter((post: any) => post.status === "published");
  const tags = tagOptions.map((tag) => ({
    url: `${BASE_URL}/tags/${tag}`,
    lastModified: now,
  }));
  const posts = loadedPosts.map((post: any) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.lastUpdatedDate || post.publishedDate,
  }));
  const pages = allPages
    .filter((page: any) => page.status === "published")
    .map((page: any) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: page.lastUpdatedDate,
    }));
  return [
    {
      url: BASE_URL,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/uses`,
      lastModified: now,
    },
    {
      url: `${BASE_URL}/social`,
      lastModified: now,
    },
    ...pages,
    {
      url: `${BASE_URL}/posts`,
      lastModified: now,
    },
    ...posts,
    {
      url: `${BASE_URL}/tags`,
      lastModified: now,
    },
    ...tags,
  ];
}

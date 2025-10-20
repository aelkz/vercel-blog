import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

import { BASE_URL } from "@/lib/metadata";
import { tagOptions } from "@/lib/tag-options";

// Read generated data from .contentlayer directory to avoid bundling contentlayer
function getContentlayerData() {
  const contentlayerPath = path.join(process.cwd(), ".contentlayer/generated");

  // Read posts
  const postsIndexPath = path.join(contentlayerPath, "Post/_index.json");
  const postsData = JSON.parse(fs.readFileSync(postsIndexPath, "utf-8"));
  const allPosts = postsData.map((fileName: string) => {
    const postPath = path.join(contentlayerPath, "Post", fileName);
    return JSON.parse(fs.readFileSync(postPath, "utf-8"));
  });

  // Read pages
  const pagesIndexPath = path.join(contentlayerPath, "Page/_index.json");
  const pagesData = JSON.parse(fs.readFileSync(pagesIndexPath, "utf-8"));
  const allPages = pagesData.map((fileName: string) => {
    const pagePath = path.join(contentlayerPath, "Page", fileName);
    return JSON.parse(fs.readFileSync(pagePath, "utf-8"));
  });

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
      url: `${BASE_URL}/${page.slug.split("/pages")}`,
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

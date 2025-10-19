import { ContentNavItem, NavItem } from "@/types";

import siteMetadata, { defaultAuthor } from "@/lib/metadata";

const content: ContentNavItem[] = [
  {
    title: "Technology Blog",
    href: "/posts",
    description: "Blogposts. Mostly about software engineering and cloud architecture",
  },
  {
    title: "Guitar recordings",
    href: "/guitar",
    description: "A chill space where I post some recordings of me playing guitar.",
  },
];

const radarsContent: ContentNavItem[] = [
  {
    title: "General Books",
    href: "/general-books",
    description: "General Books Radar",
  },
  {
    title: "IT Books",
    href: "/it-books",
    description: "IT Books Radar",
  },
  {
    title: "Technology Radar",
    href: "/technology-radar",
    description: "Technology Radar",
  },
  {
    title: "AI Radar",
    href: "/ai-radar",
    description: "AI Radar",
  },
];

export const navigationLinks: NavItem[] = [
  {
    title: "Blog",
    content,
  },
  {
    title: "Radars",
    content: radarsContent,
  },
  {
    title: "About",
    href: "/about",
  },
];

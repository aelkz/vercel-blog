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

export const navigationLinks: NavItem[] = [
  {
    title: "Blog",
    content,
  },
  {
    title: "Thoughtworks",
    href: "/projects",
  },
  {
    title: "About",
    href: "/about",
  },
];

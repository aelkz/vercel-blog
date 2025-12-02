import { AuthorType, SiteMetaData } from "@/types";

import { socialProfiles } from "./social-data";

export const BASE_URL =
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

export const defaultAuthor: AuthorType = {
  name: "Raphael Abreu",
  siteName: "Coffeehack.io",
  handle: "@coffeehack-io",
  socialProfiles,
  email: "definitelyfake@nevermind.com",
  website: "https://coffeehack.io",
  jobTitle: "Dialing the best shot of thinking & design — smooth, sweet, and balanced",
  company: "Coffee & Guitar Co.",
  availableForWork: false,
  location: {
    city: "Brasilia",
    country: "Brazil",
    media: "/brasilia.png",
  },
};

const defaultTitle = `${defaultAuthor.name}'s Blog`;
const defaultDescription = `I'm ${defaultAuthor.name}. Dialing the best shot of thinking & design — smooth, sweet, and balanced.`;

const siteMetadata: SiteMetaData = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: defaultDescription,
  siteRepo: "https://github.com/aelkz/vercel-blog",
  newsletterProvider: "mailerlite",
  newsletterUrl: "https://",
  showNewsletter: false,
  analyticsProvider: "vercel",
  defaultTheme: "dark",
  activeAnnouncement: false,
  announcement: {
    buttonText: "",
    link: "",
  },
  postsPerPage: 10,
  postsOnHomePage: 8,
  booksOnHomePage: 6,
  songsOnHomePage: 5,
};

export default siteMetadata;

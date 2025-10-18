import { LinkProps } from "next/link";
import { Post, Series } from "contentlayer/generated";

import { AnnouncementBarProps } from "@/components/announcement-bar";

export interface PostHeading {
  heading: number;
  text: string;
  slug: string;
}

export interface NavItem {
  title: string;
  href?: string;
  description?: string;
  content?: ContentNavItem[];
}

export interface ContentNavItem extends NavItem {
  href: string;
}

export interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export type AnalyticsProvider = "umami" | "vercel" | "plausible" | "google";

export type NewsletterProvider = "convertkit" | "substack" | "mailerlite";

export type SiteMetaData = {
  title: {
    template: string;
    default: string;
  };
  description: string;
  siteRepo: string;
  newsletterProvider?: NewsletterProvider;
  newsletterUrl?: string;
  showNewsletter?: boolean;
  analyticsProvider?: AnalyticsProvider;
  defaultTheme: "light" | "dark" | "system";
  activeAnnouncement: boolean;
  announcement: Pick<AnnouncementBarProps, "buttonText" | "link">;
  postsPerPage: number;
  postsOnHomePage: number;
  booksOnHomePage: number;
  songsOnHomePage: number;
};

export type SeriesItem = {
  title: string;
  slug: Post["slug"];
  status: Post["status"];
  isCurrent: boolean;
};

export type PostSeries = Series & { posts: SeriesItem[] };

export type PostWithSeries = Omit<Post, "series"> & { series: PostSeries };

export type SocialProfile = {
  name: string;
  link: string;
};

export type AuthorType = {
  name: string;
  siteName: string;
  handle: string;
  socialProfiles: SocialProfile[];
  email: string;
  website: string;
  jobTitle: string;
  company?: string;
  availableForWork: boolean;
  location: {
    city: string;
    country: string;
    media: string;
  };
};

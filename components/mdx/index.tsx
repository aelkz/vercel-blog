import NextImage, { ImageProps } from "next/image";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";

import { NewsletterCTA } from "./newsletter-cta";
import { YouTubeVideo } from "./youtube-video";

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href } = props;
  const isExternalLink = href && href.startsWith("http");

  if (isExternalLink) {
    return <a target="_blank" href={href} rel="noopener noreferrer" {...props} />;
  }
  return (
    //@ts-expect-error
    <Link href={href} />
  );
}

const components = {
  Image: (props: ImageProps) => <NextImage {...props} />,
  NewsletterCTA,
  YouTubeVideo,
  // a: CustomLink,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={`!text-[#A97125] [&_a]:!text-[#A97125] ${className || ""}`} {...props} />
  ),
  img: ({ alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      alt={alt}
      className={className || "m-0 mx-auto block h-auto max-w-full rounded-lg border-2 border-[#CA9F55] p-0 shadow-lg"}
    />
  ),
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  // TODO: Figure out how to type this
  return <Component components={components as any} />;
}

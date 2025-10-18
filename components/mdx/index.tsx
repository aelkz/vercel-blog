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
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="my-6 block">
      <img {...props} alt={alt} className="mx-auto h-auto max-w-full rounded-lg border-2 border-[#CA9F55] shadow-lg" />
      {alt && <em className="mt-2 block text-center text-sm text-muted-foreground">{alt}</em>}
    </span>
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

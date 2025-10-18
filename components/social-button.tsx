import Link from "next/link";
import { SocialProfile } from "@/types";
import { Linkedin } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import * as Icons from "simple-icons";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface SocialButtonProps extends ButtonProps {
  platform: SocialProfile;
}

export function SocialButton({ platform, ...props }: SocialButtonProps) {
  // Map platform names to their correct simple-icons export names
  const iconNameMap: Record<string, string> = {
    linkedin: "siLinkedin",
    github: "siGithub",
    stackoverflow: "siStackoverflow",
    mastodon: "siMastodon",
    youtube: "siYoutube",
  };

  const platformCamel = platform.name.charAt(0).toUpperCase() + platform.name.slice(1);
  const platformIconIdentifier = iconNameMap[platform.name.toLowerCase()] || `si${platformCamel}`;

  const renderIcon = () => {
    // LinkedIn was removed from simple-icons, use Lucide icon instead
    if (platform.name.toLowerCase() === "linkedin") {
      return <Linkedin className="h-5 w-5" />;
    }

    const icon: SimpleIcon = Icons[platformIconIdentifier as keyof typeof Icons];
    if (!icon) {
      return null;
    }
    return (
      <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d={icon.path}></path>
      </svg>
    );
  };

  return (
    <Button asChild {...props}>
      <Link href={platform.link} rel={platform.name === "mastodon" ? "me" : "noreferrer noopener"} target="_blank">
        {renderIcon()}
        <span className={cn(props.size === "icon" ? "sr-only" : "ml-2")}>Go to my {platformCamel} profile</span>
      </Link>
    </Button>
  );
}

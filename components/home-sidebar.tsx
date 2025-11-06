import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Book, MapPin } from "lucide-react";

import { books } from "@/lib/books-data";
import siteMetadata, { defaultAuthor } from "@/lib/metadata";
import { songs } from "@/lib/songs-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocationImage } from "@/components/location-image";
import { PersonalityTypeImage } from "@/components/personality-type-image";

type CardProps = React.ComponentProps<typeof Card>;

export function Sidebar({ className, ...props }: CardProps) {
  return (
    <>
      <Card className={cn("mb-4", className)} {...props}>
        <CardHeader>
          <CardTitle>Where am I currently?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center rounded-md pl-2">
            <MapPin />
            <div className="ml-2 mr-auto">
              <p className="text-sm font-medium leading-none">
                {defaultAuthor.location.city}, {defaultAuthor.location.country}
              </p>
              <LocationImage
                src={defaultAuthor.location.media}
                alt={`${defaultAuthor.location.city}, ${defaultAuthor.location.country}`}
                city={defaultAuthor.location.city}
                country={defaultAuthor.location.country}
              />
            </div>
            <Image
              src={defaultAuthor.location.media}
              alt={`${defaultAuthor.location.city}, ${defaultAuthor.location.country}`}
              width={56}
              height={56}
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <Card className={cn(className)} {...props}>
        <CardHeader>
          <CardTitle>What am I currently reading?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          {books
            .filter((book) => book.inProgress)
            .slice(0, siteMetadata.booksOnHomePage)
            .map((book) => (
              <Link
                href={book.href}
                target="_blank"
                key={book.title.trim()}
                className="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-[#ddd2c5]"
              >
                <Book />
                <div className="ml-2 mr-auto">
                  <p className="text-sm font-medium leading-none">{book.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{book.author}</p>
                </div>
                <Image
                  src={book.mediaSrc}
                  alt={book.title}
                  width={56}
                  height={56}
                  className="h-16 w-16 rounded-md object-cover"
                />
              </Link>
            ))}
        </CardContent>
      </Card>

      <Card className={cn("mt-4", className)} {...props}>
        <CardHeader>
          <CardTitle>What am I learning on guitar?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1">
          {songs.slice(0, siteMetadata.songsOnHomePage).map((song) => (
            <div
              key={song.title.trim()}
              className="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-[#ddd2c5]"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <div className="ml-2 mr-auto">
                <p className="text-sm font-medium leading-none">{song.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{song.artist}</p>
              </div>
              <Link
                href={song.sheetUrl}
                target="_blank"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Open on Spotify"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="pb-4 pt-4">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/guitar">
              All songs <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className={cn("mt-4", className)} {...props}>
        <CardHeader>
          <CardTitle>Personality Type</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <PersonalityTypeImage
            src="/images/about/personality-type.png"
            alt="ISTJ-A Personality Type"
            personalityType="ISTJ-A"
          />
        </CardContent>
      </Card>

      <Card className={cn("mt-4 bg-[#E6E5DF]", className)} {...props}>
        <CardHeader>
          <CardTitle>About me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-justify text-sm text-muted-foreground">
          <p>
            Software Engineer with over 20 years of experience in the Software Industry. I have worked with different
            technologies and projects allowing me to get a wider view of diverse business needs. I'm open-source
            enthusiast and at my spare time I like to learn and study about Astronomy and Astrophysics. Areas of
            expertise include Cloud Computing, Microservices, Integration, Security, Technology and Application
            Architecture.
          </p>
          <p className="text-xs italic">
            <strong>Disclaimer:</strong> This is a personal blog. The opinions expressed here represent my own and not
            those of my current or previous employers. In addition, my thoughts and opinions may change from time to
            time and I consider this a necessary consequence of having an open mind.
          </p>
          <p className="text-xs italic">
            All content provided on this blog is for informational purposes only. The owner of this blog makes no
            representations as to the accuracy or completeness of any information on this site or found by following any
            link on this site.
          </p>
          <p className="text-xs italic">Use at your own risk.</p>
        </CardContent>
      </Card>
    </>
  );
}

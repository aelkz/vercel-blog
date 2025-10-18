import { Metadata } from "next";

import { defaultAuthor } from "@/lib/metadata";
import { songs } from "@/lib/songs-data";
import { SongItem } from "@/components/song-item";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Guitar Learning",
    description: `Songs ${defaultAuthor.name} is learning on electric guitar`,
  };
}

export default function Guitar() {
  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">Learning Guitar</h1>
        <p className="text-muted-foreground">Songs I'm currently learning on my electric guitar.</p>
        <hr className="my-4" />
        <div className="not-prose grid grid-flow-row gap-3">
          {songs.length > 0 ? (
            songs.map((song) => <SongItem song={song} key={song.title} />)
          ) : (
            <p className="text-muted-foreground">No songs yet. Check back soon!</p>
          )}
        </div>
      </div>
    </div>
  );
}

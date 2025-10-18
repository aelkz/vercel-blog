"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pause, Play } from "lucide-react";

import { Song } from "@/lib/songs-data";

interface SongItemProps {
  song: Song;
}

export function SongItem({ song }: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/50">
      <button
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-sm font-medium leading-none">{song.title}</p>
        <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
      </div>

      <Link
        href={song.sheetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
        aria-label="Open sheet music"
      >
        <ExternalLink className="h-5 w-5" />
      </Link>

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

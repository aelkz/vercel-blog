"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, X } from "lucide-react";

interface VideoProps {
  src: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function Video({ src, caption, autoPlay = false, loop = false, muted = true }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const modalProgressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Check video duration on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }
  }, []);

  // Reset zoom when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      setZoom(1);
      // Sync modal video state with main video
      if (modalVideoRef.current && videoRef.current) {
        modalVideoRef.current.currentTime = videoRef.current.currentTime;
        // Set duration from main video if available
        if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
          setDuration(videoRef.current.duration);
        }
        if (isPlaying) {
          modalVideoRef.current.play();
        }
      }
    } else {
      // Sync main video state back from modal
      if (modalVideoRef.current && videoRef.current) {
        videoRef.current.currentTime = modalVideoRef.current.currentTime;
        if (isPlaying) {
          videoRef.current.play();
        }
      }
    }
  }, [isModalOpen]);

  const togglePlay = (isModal = false) => {
    const video = isModal ? modalVideoRef.current : videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleZoom = (level: number) => {
    setZoom(level);
  };

  const handleTimeUpdate = (isModal = false) => {
    const video = isModal ? modalVideoRef.current : videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = (isModal = false) => {
    const video = isModal ? modalVideoRef.current : videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    setDuration(video.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, isModal = false) => {
    const progressBar = isModal ? modalProgressRef.current : progressRef.current;
    const video = isModal ? modalVideoRef.current : videoRef.current;
    if (!progressBar || !video) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="my-6">
        <div className="group relative overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={() => handleTimeUpdate(false)}
            onLoadedMetadata={() => handleLoadedMetadata(false)}
            onCanPlay={() => handleLoadedMetadata(false)}
          />

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {/* Timeline */}
            <div className="mb-3">
              <div
                ref={progressRef}
                className="group/progress relative h-1 cursor-pointer rounded-full bg-white/30 hover:h-1.5"
                onClick={(e) => handleProgressClick(e, false)}
              >
                <div
                  className="h-full rounded-full bg-gray-500 transition-all group-hover/progress:bg-gray-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-white">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePlay(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white transition-colors hover:bg-gray-700"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Maximize button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute right-2 top-2 rounded-md bg-gray-600 p-2 text-white opacity-0 transition-opacity hover:bg-gray-700 group-hover:opacity-100"
            aria-label="Open video in full screen"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {caption && <p className="mt-2 text-center text-sm italic text-slate-600 dark:text-slate-400">{caption}</p>}
      </div>

      {/* Full-screen Modal with Zoom Controls */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Zoom Controls */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleZoom(1)}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors ${
                zoom === 1 ? "bg-gray-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
              aria-label="100% zoom"
            >
              100%
            </button>
            <button
              onClick={() => handleZoom(1.15)}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors ${
                zoom === 1.15 ? "bg-gray-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
              aria-label="115% zoom"
            >
              115%
            </button>
            <button
              onClick={() => handleZoom(1.25)}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors ${
                zoom === 1.25 ? "bg-gray-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
              aria-label="125% zoom"
            >
              125%
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-600 p-3 text-white shadow-lg transition-colors hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Video Container */}
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.3s ease",
            }}
          >
            <video
              ref={modalVideoRef}
              src={src}
              loop={loop}
              muted={muted}
              playsInline
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => handleTimeUpdate(true)}
              onLoadedMetadata={() => handleLoadedMetadata(true)}
              onCanPlay={() => handleLoadedMetadata(true)}
            />

            {/* Modal Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              {/* Timeline */}
              <div className="mb-4">
                <div
                  ref={modalProgressRef}
                  className="group/progress relative h-2 cursor-pointer rounded-full bg-white/30 hover:h-2.5"
                  onClick={(e) => handleProgressClick(e, true)}
                >
                  <div
                    className="h-full rounded-full bg-gray-500 transition-all group-hover/progress:bg-gray-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Play button */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => togglePlay(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white transition-colors hover:bg-gray-700"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-md bg-gray-600 px-4 py-2 text-sm text-white shadow-lg">
            Click timeline to seek • ESC to close
          </div>
        </div>
      )}
    </>
  );
}

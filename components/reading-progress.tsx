"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateProgress = () => {
      // Get the scroll position
      const scrollTop = window.scrollY;
      // Get the total scrollable height
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      // Calculate the scroll percentage
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(scrollPercent);
    };

    // Update progress on scroll
    window.addEventListener("scroll", updateProgress);
    // Update on mount
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 h-1 bg-gradient-to-r from-[#A97125] via-[#CA9F55] to-[#A97125]"
      style={{
        transform: `translateX(${progress - 100}%)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

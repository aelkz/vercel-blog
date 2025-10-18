"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LocationImageProps {
  src: string;
  alt: string;
  city: string;
  country: string;
}

export function LocationImage({ src, alt, city, country }: LocationImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="mt-1 text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
      >
        View more
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] cursor-default duration-300 animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -right-4 -top-4 z-10 rounded-full bg-background p-2 shadow-lg transition-transform hover:scale-110"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <Image
              src={src}
              alt={alt}
              width={800}
              height={800}
              className="rounded-lg object-contain shadow-2xl"
              priority
            />
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-semibold text-white">
                {city}, {country}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/70 underline underline-offset-2 transition-colors hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

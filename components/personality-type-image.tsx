"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface PersonalityTypeImageProps {
  src: string;
  alt: string;
  personalityType: string;
}

export function PersonalityTypeImage({ src, alt, personalityType }: PersonalityTypeImageProps) {
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
        className="flex w-full items-center rounded-md px-2 py-1 transition-colors hover:bg-[#ddd2c5]"
      >
        <div className="ml-2 mr-auto">
          <p className="text-sm font-medium leading-none">{personalityType}</p>
        </div>
        <Image
          src="/images/about/personality-avatar.png"
          alt={alt}
          width={56}
          height={56}
          className="h-16 w-16 rounded-md object-cover"
        />
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
              <p className="text-lg font-semibold text-white">{personalityType}</p>
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

"use client";

import React, { useState } from "react";
import Image from "next/image";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { ListingGalleryProps } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200";
const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400";

export function ListingGallery({ listing }: ListingGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const mediaImages =
    listing.media && listing.media.length > 0
      ? [...listing.media]
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((m) => m.url)
      : [FALLBACK_IMAGE];

  const activeImage = mediaImages[selectedImageIndex] || mediaImages[0];

  return (
    <div className="space-y-4">
      {/* Primary Display Card */}
      <AnimationWrapper type="zoom" duration={0.6}>
        <div className="rounded-2xl overflow-hidden border border-primary bg-[#141414] relative">
          <Image
            src={activeImage}
            alt={listing.title}
            width={800}
            height={500}
            unoptimized
            className="w-full h-100 md:h-125 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>
      </AnimationWrapper>

      {/* Thumbnails Carousel Row */}
      {mediaImages.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {mediaImages.map((img, i) => (
            <AnimationWrapper key={i} type="fade-up" delay={0.05 * (i + 1)}>
              <button
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                className={`w-full rounded-xl overflow-hidden border transition-all h-24 md:h-32 text-left cursor-pointer ${
                  selectedImageIndex === i
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-[#262626] opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${listing.title} thumbnail ${i + 1}`}
                  width={200}
                  height={120}
                  unoptimized
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_THUMB;
                  }}
                />
              </button>
            </AnimationWrapper>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { Heart, Share2, Check } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPGallerySectionProps } from "./types";

export function VIPGallerySection({
  title,
  images,
  selectedImage,
  onSelectImage,
  isSaved,
  onToggleSave,
  copied,
  onShare,
}: VIPGallerySectionProps) {
  const activeImageSrc = images[selectedImage] || images[0];

  return (
    <div className="flex-1 min-w-0">
      {/* Main Image */}
      <AnimationWrapper type="zoom" duration={0.6} delay={0.1}>
        <div className="relative rounded-2xl overflow-hidden bg-black w-full max-h-102.25 group">
          <Image
            src={activeImageSrc}
            alt={title}
            width={1200}
            height={410}
            unoptimized
            className="w-full h-102.25 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Floating actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onToggleSave}
              className={`w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10 ${
                isSaved ? "text-red-500" : "text-white/80 hover:text-red-400"
              }`}
              title={isSaved ? "Remove from Saved" : "Save Listing"}
            >
              <Heart className="w-4.5 h-4.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onShare}
              className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-[#E78F23] transition-colors border border-white/10"
              title="Share Listing"
            >
              {copied ? (
                <Check className="w-4.5 h-4.5 text-green-400" />
              ) : (
                <Share2 className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </AnimationWrapper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((img, idx) => (
            <AnimationWrapper key={idx} type="fade-up" duration={0.4} delay={0.15 + idx * 0.05}>
              <button
                onClick={() => onSelectImage(idx)}
                className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                  selectedImage === idx
                    ? "border-[#E78F23] shadow-[0_0_12px_rgba(231,143,35,0.3)]"
                    : "border-[#2C2C2E] hover:border-[#E78F23]/40 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} ${idx + 1}`}
                  width={100}
                  height={72}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </button>
            </AnimationWrapper>
          ))}
        </div>
      )}
    </div>
  );
}

export default VIPGallerySection;

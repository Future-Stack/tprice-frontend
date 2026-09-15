import React from "react";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { BuyerListingGalleryProps } from "./types";

export function BuyerListingGallery({
  product,
  productImages,
  safeSelectedImage,
  onSelectImage,
  isSaved,
  isSaving,
  onToggleSave,
  overviewText,
}: BuyerListingGalleryProps) {
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Main Image */}
      <AnimationWrapper type="zoom" duration={0.6} delay={0.1}>
        <div className="relative rounded-2xl overflow-hidden bg-black w-full max-h-102.25 group">
          <Image
            src={productImages[safeSelectedImage]}
            alt={product.title}
            width={800}
            height={409}
            unoptimized
            className="w-full h-102.25 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200";
            }}
          />
          {/* Floating actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onToggleSave}
              disabled={isSaving}
              className={`w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10 cursor-pointer ${
                isSaved ? "text-red-500" : "text-white/80 hover:text-red-400"
              }`}
            >
              <Heart className="w-4.5 h-4.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-primary transition-colors border border-white/10 cursor-pointer"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </AnimationWrapper>

      {/* Thumbnails */}
      {productImages.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {productImages.map((img, idx) => (
            <AnimationWrapper
              key={idx}
              type="fade-up"
              duration={0.4}
              delay={0.15 + idx * 0.05}
            >
              <button
                onClick={() => onSelectImage(idx)}
                className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer ${
                  safeSelectedImage === idx
                    ? "border-primary shadow-[0_0_12px_rgba(231,143,35,0.3)]"
                    : "border-[#2C2C2E] hover:border-[#E78F23]/40 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  width={100}
                  height={72}
                  unoptimized
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              </button>
            </AnimationWrapper>
          ))}
        </div>
      )}

      {/* Overview Section */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
        <div className="mt-10">
          <h3 className="text-xl font-clash font-bold mb-4">Overview</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{overviewText}</p>
        </div>
      </AnimationWrapper>
    </div>
  );
}

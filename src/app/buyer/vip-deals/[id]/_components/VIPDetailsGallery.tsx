import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { VIPDetailsGalleryProps } from "./types";

export function VIPDetailsGallery({
  product,
  productImages,
  safeSelectedImage,
  onSelectImage,
  badgeLabel,
  isSaved,
  isSaving,
  onToggleSave,
}: VIPDetailsGalleryProps) {
  return (
    <div className="flex-1 min-w-0">
      <AnimationWrapper type="fade-right" duration={0.5}>
        <div className="space-y-4">
          {/* Main Preview Image */}
          <div className="relative w-full h-102.25 rounded-2xl overflow-hidden bg-[#161618] border border-white/5 shadow-2xl">
            <Image
              src={productImages[safeSelectedImage]}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-[#E78F23] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                {badgeLabel}
              </span>
              {product.category && (
                <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-white/10">
                  {product.category}
                </span>
              )}
            </div>

            <button
              onClick={onToggleSave}
              disabled={isSaving}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Heart className="w-5 h-5 text-primary" fill={isSaved ? "#E78F23" : "none"} />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectImage(idx)}
                  className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    safeSelectedImage === idx
                      ? "border-primary scale-[1.02] shadow-lg shadow-[#E78F23]/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Description Section */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
        <div className="mt-10 space-y-4 bg-[#161618] border border-[#2C2C2E] rounded-2xl p-7">
          <h3 className="text-xl font-clash font-semibold text-white">Asset Overview</h3>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-normal">
            {product.description ||
              "This off-market VIP asset is available exclusively to verified members. Complete privacy, escrow protection, and direct access to concierge negotiation are included."}
          </p>
        </div>
      </AnimationWrapper>
    </div>
  );
}

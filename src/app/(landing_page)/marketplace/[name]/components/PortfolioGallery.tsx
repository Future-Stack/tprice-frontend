"use client";

import React, { useState } from "react";
import { ServiceItem } from "../../data";
import { MapPin } from "lucide-react";

interface PortfolioGalleryProps {
  item: ServiceItem;
}

export default function PortfolioGallery({ item }: PortfolioGalleryProps) {
  const images = item.portfolioImages || [item.image];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 mb-8">
      <h2 className="text-xl text-primary font-medium mb-6">Portfolio</h2>
      
      {/* Main Image */}
      <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] rounded-lg overflow-hidden mb-4">
        <img src={images[activeIndex]} alt="Portfolio Main" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h3 className="text-white text-2xl font-serif mb-2">Pink Villa</h3>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <MapPin className="w-4 h-4" />
            <span>2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
          </div>
        </div>
      </div>
      
      {/* Thumbnails */}
      <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
             className={`relative w-32 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden shrink-0 border-[3px] transition-all ${
              activeIndex === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

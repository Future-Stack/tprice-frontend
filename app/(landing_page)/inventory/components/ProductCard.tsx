"use client";

import React, { useState } from "react";
import { Heart, MapPin, CheckCircle2, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MarketplaceItem } from "../data";

interface ProductCardProps {
  item: MarketplaceItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat) {
      case "Automotive": return "bg-[#34A853]/20 text-[#34A853]";
      case "Real Estate": return "bg-[#EA4335]/20 text-[#EA4335]";
      case "Aviation": return "bg-[#4285F4]/20 text-[#4285F4]";
      case "Yachts": return "bg-[#00D1FF]/20 text-[#00D1FF]";
      default: return "bg-white/10 text-white";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-[#0A0A0A] border border-white/[0.03] rounded-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-300 shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* VIP Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3.5 py-1 border border-primary text-primary text-[10px] uppercase font-medium tracking-wider rounded-full backdrop-blur-md bg-black/20">
            VIP
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md border border-white/20 hover:border-white/50 ${
            isWishlisted ? "text-red-500" : "text-white hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Category Badge(s) */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${getCategoryBadgeStyle(item.category)}`}>
            {item.category}
          </span>
          {item.category === "Real Estate" && (
            <span className="px-2.5 py-1 bg-[#EA4335]/20 text-[#EA4335] text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md">
              VILLA
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-serif text-white mb-2 truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-2 text-white/40 text-[12px] mb-6 font-light">
          <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
          {item.specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2 text-white/50">
              <div className="text-white/40">
                <spec.icon size={16} strokeWidth={1} />
              </div>
              <p className="text-[12px] font-light truncate">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-1.5 text-white/70">
            <CheckCircle2 className="w-4 h-4 text-[#00D1FF]" />
            <span className="text-[11px] font-medium">{item.dealerName || "Elite Motors Collection"}</span>
          </div>
          
          <Link href={`/inventory/${item.id}`} className="group/link flex items-center gap-1.5 text-primary text-[12px] font-medium hover:text-primary/80 transition-colors">
            View details
            <MoveRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

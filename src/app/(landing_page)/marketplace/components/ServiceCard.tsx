"use client";

import React from "react";
import { Star, Heart, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceCardProps {
  item: {
    id: number;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    category: string;
    tags: string[];
    experience: string;
    image: string;
    expertImage: string;
    badge: string;
  };
}

export default function ServiceCard({ item }: ServiceCardProps) {
  const profileSlug = item.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-500"
    >
      {/* Top Image Section */}
      <Link href={`/marketplace/${profileSlug}`} className="block relative aspect-[4/3] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">
              {item.badge}
            </span>
          </div>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => e.preventDefault()}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-500 transition-colors"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Expert Profile Overlap */}
        <div className="absolute -bottom-7 left-6 z-20">
           <div className="relative w-14 h-14 rounded-full border-[3px] border-[#0A0A0A] overflow-hidden bg-[#1A1A1A] shadow-xl">
                <img src={item.expertImage} alt={item.name} className="w-full h-full object-cover" />
           </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6 pt-10 flex flex-col">
        <div className="mb-3">
             <Link href={`/marketplace/${profileSlug}`}>
               <h3 className="text-xl text-white font-medium group-hover:text-primary transition-colors">{item.name}</h3>
             </Link>
             <p className="text-white/40 text-[13px] mt-0.5">{item.title}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-white/40 text-[11px] font-medium">
            ({item.reviews} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-white/50 text-[13px] leading-relaxed mb-4 line-clamp-3 font-light italic">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[9px] text-white/30 border border-white/10 px-2.5 py-1 rounded-full tracking-wider group-hover:border-primary/20 transition-colors uppercase">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <span className="text-white/30 text-[11px] font-medium italic">{item.experience}</span>
          <Link href={`/marketplace/${profileSlug}`} className="flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all">
            View Profile
            <MoveRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

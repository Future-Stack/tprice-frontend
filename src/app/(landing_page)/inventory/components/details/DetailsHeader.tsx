"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface DetailsHeaderProps {
  title: string;
  category: string;
  location: string;
  typeBadge: string;
}

export default function DetailsHeader({ title, category, location, typeBadge }: DetailsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Type Badge */}
      <div className="inline-flex py-1 px-4 rounded-full border border-primary/20 bg-primary/5">
        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
          {typeBadge || "VIP EXCLUSIVE"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">
        {title}
      </h1>

      {/* Category Subtitle */}
      <div className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
        {category}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-white/30 text-sm">
        <MapPin className="w-4 h-4 text-primary" />
        {location}
      </div>
    </div>
  );
}

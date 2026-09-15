"use client";

import React from "react";

interface SpecItem {
  label: string;
  value: string;
}

interface ProductSpecsGridProps {
  specs: SpecItem[];
}

export default function ProductSpecsGrid({ specs }: ProductSpecsGridProps) {
  // Split specs into two columns
  const midpoint = Math.ceil(specs.length / 2);
  const leftCol = specs.slice(0, midpoint);
  const rightCol = specs.slice(midpoint);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
      {/* Left Column */}
      <div className="space-y-4">
        {leftCol.map((spec, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-white/60 text-sm font-montserrat font-medium whitespace-nowrap">
              {spec.label}
            </span>
            <div className="flex-1 border-b border-dotted border-white/10" />
            <span className="text-white text-[16px] font-medium font-inter  flex-wrap">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {rightCol.map((spec, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-white/60 font-montserrat text-sm font-medium  whitespace-wrap">
              {spec.label}
            </span>
            <div className="flex-1 border-b border-dotted border-white/10" />
            <span className="text-white text-[16px] font-inter font-medium  word-warp text-right">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

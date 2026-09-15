"use client";

import React from "react";
import { ServiceItem } from "../../data";

interface AboutSectionProps {
  item: ServiceItem;
}

export default function AboutSection({ item }: AboutSectionProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 mb-8">
      <h2 className="text-xl text-primary font-medium mb-6">About</h2>
      <p className="text-white/60 text-sm leading-relaxed mb-10 font-light">
        {item.description} With projects spanning Monaco penthouses, Cöte d'Azur villas, and 60M superyachts, {item.name.split(" ")[0]}'s work is defined by an obsessive attention to material quality and spatial harmony.
      </p>
      
      <div className="border-t border-white/5 pt-6">
        <h4 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">Area of Expertise</h4>
        <div className="flex flex-wrap gap-3">
          {item.tags.map((tag) => (
            <span key={tag} className="px-4 py-1.5 rounded-full border border-primary/20 text-primary text-xs tracking-wide">
              {tag}
            </span>
          ))}
          {/* Mock extra tags since mock data only has two */}
          <span className="px-4 py-1.5 rounded-full border border-primary/20 text-primary text-xs tracking-wide">
            BESPOKE FURNITURE
          </span>
        </div>
      </div>
    </div>
  );
}

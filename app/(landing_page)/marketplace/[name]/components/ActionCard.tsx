"use client";

import React from "react";
import { ServiceItem } from "../../data";

interface ActionCardProps {
  item: ServiceItem;
}

export default function ActionCard({ item }: ActionCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-2xl border border-white/5 sticky top-32 z-20">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-black shrink-0">
          <img
            src={item.expertImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-serif text-white">{item.name}</h3>
          <p className="text-primary text-sm italic font-serif">
            Interior Designer
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => {
          document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="w-full bg-primary hover:bg-primary/90 text-[#111] font-semibold py-4 rounded-sm transition-colors text-lg tracking-wide"
      >
        Send Inquiry
      </button>
    </div>
  );
}

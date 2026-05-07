"use client";

import React from "react";
import { Star, MapPin, Briefcase } from "lucide-react";
import { ServiceItem } from "../../data";

interface ProfileCardProps {
  item: ServiceItem;
}

export default function ProfileCard({ item }: ProfileCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-8 relative mt-[-100px] shadow-2xl border border-white/5 md:p-10 z-10 w-full mb-8">
      {/* Dynamic Avatar Overlap */}
      <div className="absolute -top-16 left-8 md:left-10 z-20">
        <div className="w-32 h-32 rounded-full border-8 border-[#1A1A1A] overflow-hidden bg-black shadow-xl">
          <img
            src={item.expertImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Header Info */}
      <div className="mt-16 sm:mt-10 md:ml-[160px] md:mt-0 flex flex-col items-start gap-2">
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
          {item.name}
        </h1>
        <p className="text-primary font-serif italic text-lg">{item.title}</p>
        
        <div className="flex flex-wrap items-center gap-6 mt-3 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>sdfjlkjkl</span> {/* Placeholder from design image */}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>sdfjlkjkl</span> {/* Placeholder from design image */}
          </div>
          
          <div className="flex items-center gap-1.5 ml-auto">
             <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-white/40 text-xs font-medium">
              ({item.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/5 my-8" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-serif text-primary mb-1">
            {item.projects || 45}
          </div>
          <div className="text-white/40 text-sm font-medium">Projects</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-serif text-primary mb-1">
            {item.countries || 16}
          </div>
          <div className="text-white/40 text-sm font-medium">Countries</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-serif text-primary mb-1">
            {item.awards || 24}
          </div>
          <div className="text-white/40 text-sm font-medium">Awards</div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-serif text-primary mb-1">
            {item.experience.replace(/[^0-9]/g, "") || 2} <span className="text-xl">years</span>
          </div>
          <div className="text-white/40 text-sm font-medium">Experiences</div>
        </div>
      </div>
    </div>
  );
}

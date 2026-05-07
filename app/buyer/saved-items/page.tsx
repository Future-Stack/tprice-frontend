"use client";

import React, { useState } from 'react';
import { MapPin, Heart } from 'lucide-react';
import AnimationWrapper from "../../components/AnimationWrapper";

interface SavedItem {
  id: number;
  image: string;
  badge: { type: 'buy_now' | 'auction', text: string };
  title: string;
  location: string;
  priceType: 'Current Bid' | 'Price';
  price: string;
  feesPrice: string;
}

const savedItems: SavedItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    badge: { type: 'auction', text: 'Auction' },
    title: "Ferrari 488 Spider",
    location: "Monaco",
    priceType: 'Current Bid',
    price: "$372,000",
    feesPrice: "$377,580 incl. fees",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    badge: { type: 'buy_now', text: 'Buy Now' },
    title: "Azimut Grande 35M",
    location: "Cannes, France",
    priceType: 'Price',
    price: "$12,500,000",
    feesPrice: "$12,687,500 incl. fees",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1508614999368-92751c144e53?auto=format&fit=crop&q=80&w=800", // Used a more general luxury watch image since precise patek might not be found easily
    badge: { type: 'auction', text: 'Auction' },
    title: "Patek Philippe Nautilus 5711",
    location: "Geneva, Switzerland",
    priceType: 'Current Bid',
    price: "$178,000",
    feesPrice: "$180,670 incl. fees",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    badge: { type: 'buy_now', text: 'Buy Now' },
    title: "Porsche 911 GT3 RS",
    location: "Stuttgart, Germany",
    priceType: 'Price',
    price: "$289,000",
    feesPrice: "$293,335 incl. fees",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    badge: { type: 'buy_now', text: 'Buy Now' },
    title: "Mediterranean Villa",
    location: "Ibiza, Spain",
    priceType: 'Price',
    price: "$8,500,000",
    feesPrice: "$8,627,500 incl. fees",
  }
];

export default function SavedItems() {
  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8 py-6">
      {/* ── Page Header ── */}
      <div className="mb-6 lg:mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h2 className="text-2xl sm:text-4xl font-clash font-medium  tracking-tight text-white">
            Saved Items
          </h2>
        </AnimationWrapper>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {savedItems.map((item, index) => (
          <AnimationWrapper key={item.id} type="fade-up" duration={0.5} delay={0.05 * index}>
            <SavedItemCard item={item} />
          </AnimationWrapper>
        ))}
      </div>
    </div>
  );
}

function SavedItemCard({ item }: { item: SavedItem }) {
  const [isSaved, setIsSaved] = useState(true);

  return (
    <div className="bg-[#161618] rounded-xl border border-[#2C2C2E] overflow-hidden group hover:border-[#E78F23]/40 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col h-full">
      {/* Target image aspect ratio */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {item.badge.type === 'auction' ? (
            <span className="bg-[#3b3211] text-[#E78F23] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md">
              {item.badge.text}
            </span>
          ) : (
            <span className="bg-[#1a3b30] text-[#3bd87d] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md">
              {item.badge.text}
            </span>
          )}
        </div>

        {/* Heart Icon */}
        <button
          onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }}
          className="absolute top-3 right-3 p-1.5 sm:p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isSaved ? 'fill-[#E78F23] text-[#E78F23]' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col grow">
        {/* Title and Location */}
        <h4 className="font-semibold font-inter text-[15px] sm:text-base text-white mb-1.5">
          {item.title}
        </h4>
        <div className="flex items-center text-[11px] sm:text-xs text-gray-400 mb-6">
          <MapPin className="w-3.5 h-3.5 mr-1.5" /> {item.location}
        </div>

        {/* Price and Button section at bottom */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-[11px] text-gray-500 mb-0.5">
              {item.priceType}
            </div>
            <div className="font-semibold text-[17px] text-white mb-1">
              {item.price}
            </div>
            <div className="text-[10px] text-gray-500">
              {item.feesPrice}
            </div>
          </div>

          <button className="px-5 py-2.5 bg-[#D4AE4B] hover:bg-[#c4a045] text-white text-xs sm:text-[13px] font-semibold rounded-lg transition-transform active:scale-95 shadow-lg">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

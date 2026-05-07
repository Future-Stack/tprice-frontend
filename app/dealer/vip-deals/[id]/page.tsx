"use client";

import React, { useState } from "react";
import { MapPin, Info, BadgeCheck, ChevronLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";

import AnimationWrapper from "@/app/components/AnimationWrapper";

/* ─── Static Data (will be replaced by API) ─── */
const categories = ["All", "Cars", "Yachts", "Aviation", "Real Estate", "Watches"];

const productImages = [
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
];

const product = {
  badge: "Auction",
  title: "Ferrari 488 Spider",
  location: "Monaco",
  currentBidLabel: "CURRENT BID",
  price: "$295,000",
  year: "2019",
  mileage: "12,000 miles",
  condition: "Pristine",
  seller: {
    name: "Monaco Exotics",
    badge: "Verified Premium Dealer",
    initial: "M",
  },
  overview:
    "This immaculate Ferrari 488 Spider represents the pinnacle of luxury and performance. Meticulously maintained and stored in a climate-controlled environment, it stands ready for its next owner. Complete documentation and providence are available upon request for verified buyers.",
};

export default function VIPDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBidSummary, setShowBidSummary] = useState(false);
  const [inclFees, setInclFees] = useState(true);
  const [isBiddingMode, setIsBiddingMode] = useState(false);

  return (
    <div className="mx-auto relative z-0">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-[40px] font-clash font-semibold">
              Exclusive Collection
            </h2>
            <p className="text-white text-[20px] mt-1 font-medium">
              Discover the world&apos;s finest assets available for acquisition.
            </p>
          </div>
        </AnimationWrapper>

      </div>

      {/* ── Back link ── */}
      <AnimationWrapper type="fade-right" duration={0.4} delay={0.15}>
        <Link
          href="/buyer/marketplace"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E78F23] text-sm font-medium mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Marketplace
        </Link>
      </AnimationWrapper>

      {/* ── Product Layout: Image + Details ── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — Gallery */}
        <div className="flex-1 min-w-0">
          {/* Main Image aspect-16/10*/}
          <AnimationWrapper type="zoom" duration={0.6} delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden bg-black w-full max-h-102.25  group">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-102.25 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Floating actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-red-400 transition-colors border border-white/10">
                  <Heart className="w-4.5 h-4.5" />
                </button>
                <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-[#E78F23] transition-colors border border-white/10">
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </AnimationWrapper>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-3 mt-4">
            {productImages.map((img, idx) => (
              <AnimationWrapper key={idx} type="fade-up" duration={0.4} delay={0.15 + idx * 0.05}>
                <button
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0
                    ${selectedImage === idx
                      ? "border-[#E78F23] shadow-[0_0_12px_rgba(231,143,35,0.3)]"
                      : "border-[#2C2C2E] hover:border-[#E78F23]/40 opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </AnimationWrapper>
            ))}
          </div>

          {/* Overview Section */}
          <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
            <div className="mt-10">
              <h3 className="text-xl font-clash font-bold mb-4">Overview</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                {product.overview}
              </p>
            </div>
          </AnimationWrapper>
        </div>

        {/* Right — Details Sidebar */}
        <div className="max-w-95 w-full shrink-0">
          {!isBiddingMode ? (
            <div className="space-y-5">
              {/* Auction Badge & Title */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
                <div>
                  <span className="inline-block bg-[#E78F23]/10 text-[#E78F23] text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-[#E78F23]/20">
                    {product.badge}
                  </span>
                  <h2 className="text-[32px] font-clash font-medium tracking-tight leading-tight text-white">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2.5 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{product.location}</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Price */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.15}>
                <div className="pt-2">
                  <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1">
                    {product.currentBidLabel}
                  </p>
                  <p className="text-3xl font-inter font-medium text-[#E78F23]">
                    {product.price}
                  </p>
                </div>
              </AnimationWrapper>

              {/* Action Buttons */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.2} >
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => setIsBiddingMode(true)}
                    className="w-full py-4 bg-[#E78F23] hover:bg-[#E78F23]/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide"
                  >
                    Place Bid
                  </button>
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all border border-white/10 active:scale-[0.98] capitalize tracking-wide">
                    send offer
                  </button>
                </div>
              </AnimationWrapper>

              {/* Key Specifications */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
                <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Info className="w-4 h-4 text-[#E78F23]" />
                    <h4 className="text-sm font-semibold text-white">Key Specifications</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-y-5">
                    <SpecItem label="YEAR" value={product.year} />
                    <SpecItem label="MILEAGE" value={product.mileage} />
                    <SpecItem label="CONDITION" value={product.condition} />
                  </div>
                </div>
              </AnimationWrapper>

              {/* Seller Information */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.3}>
                <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6">
                  <h4 className="text-sm font-semibold mb-5 text-white">
                    Seller Information
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#2C2C2E] font-inter flex items-center justify-center text-[#E78F23] font-bold text-lg border border-[#3C3C3E]">
                      {product.seller.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] text-white">
                        {product.seller.name}
                      </p>
                      <p className="text-xs text-green-400/90 flex items-center gap-1.5 mt-1 font-medium">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {product.seller.badge}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimationWrapper>
            </div>
          ) : (
            /* ── Bidding Mode Sidebar ── */
            <div className="space-y-6">
              {/* Header */}
              <AnimationWrapper type="fade-down" duration={0.4}>
                <div>
                  <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
                    Auction
                  </span>
                  <h2 className="text-3xl font-clash font-semibold text-white">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{product.location}</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Price Summary Card */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
                <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price Summary</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 font-medium tracking-wide">Show total incl. fees</span>
                      <button
                        onClick={() => setInclFees(!inclFees)}
                        className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${inclFees ? 'bg-white' : 'bg-[#2C2C2E]'}`}
                      >
                        <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${inclFees ? 'left-5.5 bg-black' : 'left-1 bg-white'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <span className="text-gray-400">Current Bid</span>
                      <span className="text-white font-medium">$372,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">VIP Fee (1.5%)</span>
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <span className="text-white font-medium">$5,580</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-400 mt-1">Total Payable</span>
                      <div className="text-right">
                        <p className="text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">$377,580</p>
                        <p className="text-[11px] text-gray-500">Asking: $389,000</p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
                    <div className="w-1.5 h-1.5 bg-[#E78F23] rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
                    <span className="text-[9px] text-[#E78F23] font-bold uppercase tracking-widest">VIP reduced fee applied</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Attributes Grid (image style 2x2) */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Mileage</p>
                    <p className="text-[15px] font-medium text-white">1,200 mi</p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Engine</p>
                    <p className="text-[15px] font-medium text-white">3.9L V8 Twin-Turbo</p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Power</p>
                    <p className="text-[15px] font-medium text-white">661 HP</p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">0-60</p>
                    <p className="text-[15px] font-medium text-white">2.9s</p>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Seller - image style */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
                <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-none mb-1">Monaco Prestige Motors</p>
                    <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
                      <BadgeCheck className="w-3 h-3" />
                      Verified Dealer
                    </p>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Bidding Actions */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.4}>
                <div className="space-y-3 pt-2">
                  <button className="w-full py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98]">
                    Place Bid
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors">
                      <Heart className="w-4 h-4 text-[#E78F23]" fill="#E78F23" />
                      Saved
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-400" />
                      Share
                    </button>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Cancel / Back Link (Optional but helpful) */}
              <button
                onClick={() => setIsBiddingMode(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors pt-2 font-medium"
              >
                Go Back to Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}


/* ─── Sub-components ─── */
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

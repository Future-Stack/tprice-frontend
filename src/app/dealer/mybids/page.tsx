 "use client";

import React, { useState } from "react";
import {
  MapPin,
  Info,
  BadgeCheck,
  ArrowUpRight,
  Share2,
  Eye,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

/* ─── Mock Data (unchanged) ─── */
const categories = ["All", "Cars", "Yachts", "Aviation", "Real Estate", "Watches"];

const bids = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=100",
    title: "Patek Philippe Nautilus 5711",
    yourBid: "$373,000",
    highestBid: "$373,000",
    status: "Leading",
    location: "Monaco",
    category: "Watches",
    priceSummary: {
      currentBid: "$372,000",
      vipFee: "$5,580",
      totalPayable: "$377,580",
      askingPrice: "$389,000"
    },
    specs: [
      { label: "Case", value: "Stainless Steel" },
      { label: "Movement", value: "Automatic" },
      { label: "Size", value: "40mm" },
      { label: "Year", value: "2021" }
    ],
    seller: {
      name: "Luxury Watch Co",
      initial: "L"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=100",
    title: "Ferrari 488 Spider",
    yourBid: "$175,000",
    highestBid: "$178,000",
    status: "Won",
    location: "Monaco",
    category: "Cars",
    priceSummary: {
      currentBid: "$175,000",
      vipFee: "$2,625",
      totalPayable: "$177,625",
      askingPrice: "$180,000"
    },
    specs: [
      { label: "Mileage", value: "1,200 mi" },
      { label: "Engine", value: "3.9L V8 Twin-Turbo" },
      { label: "Power", value: "661 HP" },
      { label: "0-60", value: "2.9s" }
    ],
    seller: {
      name: "Monaco Prestige Motors",
      initial: "M"
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=100",
    title: "Lamborghini Revuelto",
    yourBid: "$585,000",
    highestBid: "$585,000",
    status: "Outbid",
    location: "Dubai",
    category: "Cars",
    priceSummary: {
      currentBid: "$585,000",
      vipFee: "$8,775",
      totalPayable: "$593,775",
      askingPrice: "$600,000"
    },
    specs: [
      { label: "Mileage", value: "500 mi" },
      { label: "Engine", value: "6.5L V12 Hybrid" },
      { label: "Power", value: "1001 HP" },
      { label: "0-60", value: "2.5s" }
    ],
    seller: {
      name: "Dubai Exotics",
      initial: "D"
    }
  }
];

export default function MyBidsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBidId, setSelectedBidId] = useState(bids[1].id);
  const [inclFees, setInclFees] = useState(true);

  const filteredBids = bids.filter(
    (bid) => activeCategory === "All" || bid.category === activeCategory
  );

  const selectedBid = bids.find((bid) => bid.id === selectedBidId) || bids[0];

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 lg:mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-clash font-medium text-white">
              My Bids
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 font-medium">
              Manage and track your active auction participations.
            </p>
          </div>
        </AnimationWrapper>

        {/* Category Tabs – scrollable on mobile */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1} >
          <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap
                    ${activeCategory === cat
                      ? "bg-[#E78F23] text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* Main content – stack on mobile, side‑by‑side on large screens */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* ── Left: Bids Table (scrollable on small screens) ── */}
        <div className="flex-1 min-w-0">
          {/* Table header – hidden on mobile when scrolling, but visible on larger screens */}
          <div className="hidden sm:grid grid-cols-[1fr_repeat(3,100px)_150px] gap-4 mb-6 px-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Item</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Your Bid</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Highest Bid</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Status</span>
            <span></span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="space-y-4 min-w-175 sm:min-w-0">
              {filteredBids.map((bid, index) => (
                <AnimationWrapper
                  key={bid.id}
                  type="fade-right"
                  duration={0.4}
                  delay={0.05 * index}
                >
                  <div
                    onClick={() => setSelectedBidId(bid.id)}
                    className={`grid grid-cols-[1fr_repeat(3,100px)_150px] items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group
                      ${selectedBidId === bid.id
                        ? "bg-white/5 border-[#E78F23]/20 shadow-lg shadow-black/20"
                        : "bg-[#161618] border-[#2C2C2E] hover:border-white/10"
                      }`}
                  >
                    {/* Item */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/5">
                        <img src={bid.image} alt={bid.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                        {bid.title}
                      </span>
                    </div>

                    {/* Your Bid */}
                    <span className="text-sm font-medium text-gray-400">{bid.yourBid}</span>

                    {/* Highest Bid */}
                    <span className="text-sm font-medium text-gray-400">{bid.highestBid}</span>

                    {/* Status */}
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wide
                        ${bid.status === "Leading" ? "text-emerald-500" :
                          bid.status === "Won" ? "text-[#E78F23]" : "text-red-500"}
                      `}>
                        {bid.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 sm:gap-2 pr-2">
                      {bid.status === "Outbid" && (
                        <button className="p-2 sm:p-2.5 bg-[#E78F23]/10 hover:bg-[#E78F23]/20 text-[#E78F23] rounded-lg transition-colors border border-[#E78F23]/20 group/btn">
                          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-[11px] font-bold rounded-lg border border-white/5 transition-all whitespace-nowrap">
                        View Details <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </AnimationWrapper>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Bid Details Panel (full width on mobile, sticky on large) ── */}
        <div className="w-full lg:w-95 shrink-0">
          <AnimationWrapper type="fade-left" duration={0.6}>
            <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-8">
              {/* Product Info */}
              <div>
                <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
                  Auction
                </span>
                <h2 className="text-2xl sm:text-3xl font-clash font-semibold text-white">
                  {selectedBid.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedBid.location}</span>
                </div>
              </div>

              {/* Price Summary Card */}
              <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price Summary</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">Show total incl. fees</span>
                    <button
                      onClick={() => setInclFees(!inclFees)}
                      className={`w-9 sm:w-10 h-5 sm:h-5.5 rounded-full relative transition-all duration-300 ${inclFees ? 'bg-white' : 'bg-[#2C2C2E]'}`}
                    >
                      <div className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${inclFees ? 'left-5 sm:left-5.5 bg-black' : 'left-0.5 sm:left-1 bg-white'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm tracking-tight">
                    <span className="text-gray-400">Current Bid</span>
                    <span className="text-white font-medium">{selectedBid.priceSummary.currentBid}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm tracking-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">VIP Fee (1.5%)</span>
                      <Info className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="text-white font-medium">{selectedBid.priceSummary.vipFee}</span>
                  </div>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <span className="text-sm font-medium text-gray-400">Total Payable</span>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl sm:text-3xl lg:text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">{selectedBid.priceSummary.totalPayable}</p>
                      <p className="text-[11px] text-gray-500">Asking: {selectedBid.priceSummary.askingPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
                  <div className="w-1.5 h-1.5 bg-[#E78F23] rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
                  <span className="text-[9px] text-[#E78F23] font-bold uppercase tracking-widest">VIP reduced fee applied</span>
                </div>
              </div>

              {/* Specs Grid – 2 columns on all screens */}
              <div className="grid grid-cols-2 gap-3">
                {selectedBid.specs.map((spec, i) => (
                  <div key={i} className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{spec.label}</p>
                    <p className="text-sm sm:text-[15px] font-medium text-white truncate">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Seller Info */}
              <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5 shrink-0">
                  {selectedBid.seller.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-none mb-1 truncate">{selectedBid.seller.name}</p>
                  <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
                    <BadgeCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">Verified Dealer</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button className="w-full py-4 sm:py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98]">
                  Increase Bid
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-4 sm:py-4.5 bg-transparent border border-white/10 hover:bg-white/5 text-white text-[13px] font-bold rounded-xl transition-all active:scale-[0.98]">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  Share
                </button>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </div>
  );
}
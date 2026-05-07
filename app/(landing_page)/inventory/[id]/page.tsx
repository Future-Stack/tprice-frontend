"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_ITEMS, MarketplaceItem } from "../data";
import ProductGallery from "../components/details/ProductGallery";
import ProductSpecsGrid from "../components/details/ProductSpecsGrid";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  MapPin,
  ChevronLeft,
  Calendar,
  Gauge,
  Cog,
  Zap,
  CheckCircle2,
  Heart,
  ExternalLink,
  ShieldCheck,
  Clock,
  Wrench
} from "lucide-react";

// Mock detailed data for demonstration
const MOCK_DETAILS = {
  detailedSpecs: [
    { label: "Engine", value: "3.9L Twin-Turbo V8" },
    { label: "Horsepower", value: "661 hp" },
    { label: "Torque", value: "561 lb-ft" },
    { label: "Transmission", value: "7-Speed Dual-Clutch" },
    { label: "Drive Type", value: "RWD" },
    { label: "Exterior Color", value: "Rosso Corsa" },
    { label: "Interior Color", value: "Black Leather" },
    { label: "Fuel Type", value: "Petrol" },
  ],
  history: [
    "Full service history available",
    "Single owner from new",
    "No accidents reported",
    "Monaco registration",
    "Ferrari Classiche certified",
  ],
  seller: {
    name: "Elite Motors Collection",
    location: "Beverly Hills, CA",
    listings: 3,
    description: "Premier luxury and exotic car dealership with over 20 years of experience."
  }
};

export default function InventoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const item = DEMO_ITEMS[0];

  // Merge with mock details if empty
  const detailedSpecs = item.detailedSpecs.length > 0 ? item.detailedSpecs : MOCK_DETAILS.detailedSpecs;
  const history = item.history.length > 0 ? item.history : MOCK_DETAILS.history;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
      {/* Product Gallery Section */}
      <section className="relative w-full">
        <ProductGallery media={item.media} />


      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">

            {/* Header Card */}
            <AnimationWrapper type="fade-up">
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm">
                <div className="flex flex-col md:flex-row justify-between   gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h1 className="text-3xl md:text-[24px] font-cormorant text-white   font-semibold tracking-wide">
                        {item.year} {item.title}
                      </h1>


                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={16} className="text-[#D4AF37]" />
                      <span>{item.location}</span>
                    </div>

                    <div className="text-[#D4AF37] text-4xl md:text-[36px]  font-semibold  font-montserrat">
                      ${item.price.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white/60 uppercase tracking-widest rounded-sm">
                      {item.condition}
                    </span>

                  </div>

                </div>
              </div>
            </AnimationWrapper>

            {/* Quick Specs Grid */}
            <AnimationWrapper type="fade-up" delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickSpecBox
                  icon={<Calendar size={20} className="text-[#D4AF37]" />}
                  label="Year"
                  value={String(item.year)}
                />
                <QuickSpecBox
                  icon={<Gauge size={20} className="text-[#D4AF37]" />}
                  label="Mileage"
                  value={`${item.mileage.toLocaleString()} mi`}
                />
                <QuickSpecBox
                  icon={<Zap size={20} className="text-[#D4AF37]" />}
                  label="Engine"
                  value="3.9L Twin-Turbo V8"
                />
                <QuickSpecBox
                  icon={<Cog size={20} className="text-[#D4AF37]" />}
                  label="Transmission"
                  value="7-Speed Dual-Clutch"
                />
              </div>
            </AnimationWrapper>

            {/* Description */}
            <AnimationWrapper type="fade-up" delay={0.2}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/5 pb-4">Description</h3>
                <p className="text-white/60 leading-relaxed font-light italic">
                  {item.description}
                </p>
              </div>
            </AnimationWrapper>

            {/* Specifications */}
            <AnimationWrapper type="fade-up" delay={0.3}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/5 pb-4">Specifications</h3>
                <ProductSpecsGrid specs={detailedSpecs} />
              </div>
            </AnimationWrapper>

            {/* History */}
            <AnimationWrapper type="fade-up" delay={0.4}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/5 pb-4">History</h3>
                <div className="space-y-4">
                  {history.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
                        <CheckCircle2 size={14} className="text-white/40 group-hover:text-[#D4AF37]" />
                      </div>
                      <span className="text-white/60 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimationWrapper>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <AnimationWrapper type="fade-left" delay={0.2}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm sticky top-12 space-y-8">
                {/* Dealer Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                    <ShieldCheck size={18} />
                    <h4 className="text-lg font-serif text-white">{MOCK_DETAILS.seller.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                      <MapPin size={14} />
                      <span>{MOCK_DETAILS.seller.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                      <Clock size={14} />
                      <span>{MOCK_DETAILS.seller.listings} listings</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed italic">
                    {MOCK_DETAILS.seller.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4">
                  <button className="w-full py-4 bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#B8962E] transition-all cursor-pointer flex items-center justify-center gap-2">
                    View All Listings
                  </button>
                  <button className="w-full py-4 bg-transparent border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Heart size={16} />
                    Save to Wishlist
                  </button>
                </div>

                {/* Additional Sidebar Info */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                    <Wrench size={16} className="group-hover:text-[#D4AF37]" />
                    <span className="text-xs uppercase tracking-widest">Certified Inspection</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                    <ShieldCheck size={16} className="group-hover:text-[#D4AF37]" />
                    <span className="text-xs uppercase tracking-widest">Warranty Included</span>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>

        </div>
      </div>
    </div>
  );
}

function QuickSpecBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm space-y-4 hover:border-[#D4AF37]/30 transition-all group">
      <div className="flex justify-center">
        {icon}
      </div>
      <div className="text-center space-y-1">
        <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{label}</div>
        <div className="text-white text-sm font-bold group-hover:text-white transition-colors">{value}</div>
      </div>
    </div>
  );
}
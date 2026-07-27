"use client";

import React, { useMemo } from "react";
import { Heart, MapPin, CheckCircle2, MoveRight, Gauge, Calendar, Zap, Cog } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ListingItem } from "@/lib/api/listings";
import { useSaveListingMutation, useSavedListingsQuery } from "@/hooks/useListings";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface ProductCardProps {
  item: ListingItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const saveMutation = useSaveListingMutation();
  const token = Cookies.get("access_token") || useAuthStore((state) => state.token);

  // Fetch saved listings if authenticated to cross-reference saved status
  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const isSavedInListings = useMemo(() => {
    if (!savedResponse?.data) return false;
    return savedResponse.data.some((savedItem) => savedItem.id === item.id);
  }, [savedResponse, item.id]);

  const isSaved = item.isSaved !== undefined ? item.isSaved : isSavedInListings;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please sign in to save listings to your favorites.");
      return;
    }

    saveMutation.mutate(item.id);
  };

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "automotive":
      case "supercars":
      case "supercar":
        return "bg-[#34A853]/20 text-[#34A853]";
      case "real estate":
      case "villa":
        return "bg-[#EA4335]/20 text-[#EA4335]";
      case "aviation":
      case "jet":
        return "bg-[#4285F4]/20 text-[#4285F4]";
      case "yachts":
      case "yacht":
        return "bg-[#00D1FF]/20 text-[#00D1FF]";
      default:
        return "bg-white/10 text-white";
    }
  };

  const imageUrl =
    item.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80";

  const locationStr =
    [item.locationCity, item.locationCountry].filter(Boolean).join(", ") ||
    "Worldwide";

  const formattedPrice = item.askingPrice
    ? `$${Number(item.askingPrice).toLocaleString()}`
    : "Price on Request";

  const ownerName = item.owner
    ? `${item.owner.firstName} ${item.owner.lastName}`
    : item.brand || "Elite Collection";

  // Dynamic specs derived from item.specifications or item fields
  const specs = [];
  if (item.buildYear) {
    specs.push({ icon: Calendar, value: String(item.buildYear) });
  }
  if (item.specifications?.mileage !== undefined) {
    specs.push({
      icon: Gauge,
      value: `${Number(item.specifications.mileage).toLocaleString()} mi`,
    });
  }
  if (item.specifications?.engine) {
    specs.push({ icon: Zap, value: item.specifications.engine });
  }
  if (item.specifications?.transmission) {
    specs.push({ icon: Cog, value: item.specifications.transmission });
  }
  if (item.specifications?.horsepower) {
    specs.push({ icon: Zap, value: `${item.specifications.horsepower} hp` });
  }

  // Ensure up to 4 specs
  const displaySpecs = specs.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-[#0A0A0A] border border-white/[0.03] rounded-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-300 shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden shrink-0 bg-black/40">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Featured/VIP Badge */}
        {item.isFeatured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1 border border-primary text-primary text-[10px] uppercase font-medium tracking-wider rounded-full backdrop-blur-md bg-black/40">
              VIP
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleSave}
          disabled={saveMutation.isPending}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md border hover:scale-110 active:scale-95 cursor-pointer ${
            isSaved
              ? "text-red-500 bg-black/60 border-red-500/50 shadow-lg shadow-red-500/20"
              : "text-white hover:text-white bg-black/30 border-white/20 hover:border-white/50"
          }`}
          title={isSaved ? "Remove from saved" : "Save listing"}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isSaved ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Category Badge(s) */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          {item.category && (
            <span
              className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${getCategoryBadgeStyle(
                item.category
              )}`}
            >
              {item.category}
            </span>
          )}
          {item.subCategory && (
            <span className="px-2.5 py-1 bg-white/10 text-white/90 text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md">
              {item.subCategory}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-lg font-serif text-white truncate flex-1">
            {item.title}
          </h3>
        </div>

        <div className="text-primary text-xl font-bold mb-3 font-serif">
          {formattedPrice}
        </div>

        <div className="flex items-center gap-2 text-white/40 text-[12px] mb-5 font-light">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{locationStr}</span>
        </div>

        {/* Specs Grid */}
        {displaySpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
            {displaySpecs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50">
                <div className="text-primary/70">
                  <spec.icon size={15} strokeWidth={1.5} />
                </div>
                <p className="text-[12px] font-light truncate">{spec.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-1.5 text-white/70 truncate mr-2">
            <CheckCircle2 className="w-4 h-4 text-[#00D1FF] shrink-0" />
            <span className="text-[11px] font-medium truncate">{ownerName}</span>
          </div>

          <Link
            href={`/inventory/${item.slug || item.id}`}
            className="group/link flex items-center gap-1.5 text-primary text-[12px] font-medium hover:text-primary/80 transition-colors shrink-0"
          >
            View details
            <MoveRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

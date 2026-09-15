import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Eye, Heart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSaveListingMutation, useSavedListingsQuery } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { MarketplaceCardProps } from "./types";

export function MarketplaceCard({ asset }: MarketplaceCardProps) {
  const saveMutation = useSaveListingMutation();
  const { token } = useAuth();

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const isSavedInListings = useMemo(() => {
    if (!savedResponse?.data) return false;
    return savedResponse.data.some((savedItem) => savedItem.id === asset.id);
  }, [savedResponse, asset.id]);

  const isSaved = asset.isSaved !== undefined ? asset.isSaved : isSavedInListings;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please sign in to save listings to your favorites.");
      return;
    }

    saveMutation.mutate(asset.id);
  };

  const imageUrl = asset.media?.[0]?.url;
  const formattedPrice = asset.askingPrice
    ? `$${Number(asset.askingPrice).toLocaleString()}`
    : "Price on Request";

  const locationText =
    [asset.locationCity, asset.locationCountry].filter(Boolean).join(", ") || "Worldwide";

  return (
    <Link href={`/buyer/marketplace/${asset.slug || asset.id}`} className="block h-full">
      <div className="bg-[#1C1C1E] rounded-xl border border-[#2C2C2E] overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-[#E78F23]/5 flex flex-col h-full">
        {/* Media Container */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
          <Image
            src={imageUrl}
            alt={asset.title}
            width={400}
            height={200}
            unoptimized
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {asset.category && (
              <span className="bg-black/70 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-primary/30">
                {asset.category}
              </span>
            )}
            {asset.buildYear && (
              <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                {asset.buildYear}
              </span>
            )}
            {asset.isFeatured && (
              <span className="bg-primary text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                FEATURED
              </span>
            )}
          </div>

          {/* Heart Wishlist Button */}
          <button
            onClick={handleToggleSave}
            disabled={saveMutation.isPending}
            className={`absolute top-3 right-3 p-2 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md border hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 ${
              isSaved
                ? "text-red-500 bg-black/70 border-red-500/50 shadow-lg shadow-red-500/20"
                : "text-white hover:text-white bg-black/40 border-white/20 hover:border-white/50"
            }`}
            title={isSaved ? "Remove from saved" : "Save listing"}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isSaved ? "fill-current scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 mb-2 font-medium">
              <span className="flex items-center gap-1 truncate pr-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{locationText}</span>
              </span>
              {asset.owner?.isVerified && (
                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Verified Seller
                </span>
              )}
            </div>

            <h4 className="font-semibold text-white text-base sm:text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
              {asset.title}
            </h4>

            <div className="text-lg sm:text-xl font-bold font-clash text-primary mb-4">
              {formattedPrice}
            </div>
          </div>

          <button className="w-full py-2.5 cursor-pointer bg-primary hover:bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
            View Details <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MarketplaceCard;

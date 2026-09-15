import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { BidTableRowProps, formatPrice, getStatusBadge } from "./types";

export function BidTableRow({ bid, isSelected, onSelect, index }: BidTableRowProps) {
  const statusInfo = getStatusBadge(bid.status);
  const imageUrl =
    bid.listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=100";
  const itemTitle = bid.listing?.title || "Untitled Item";
  const bidCurrency = bid.listing?.currency || "USD";

  return (
    <AnimationWrapper type="fade-right" duration={0.4} delay={0.05 * index}>
      <div
        onClick={() => onSelect(bid.id)}
        className={`grid grid-cols-[1fr_repeat(3,100px)_150px] items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
          isSelected
            ? "bg-white/5 border-[#E78F23]/20 shadow-lg shadow-black/20"
            : "bg-[#161618] border-[#2C2C2E] hover:border-white/10"
        }`}
      >
        {/* Item */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/5">
            <Image
              src={imageUrl}
              alt={itemTitle}
              width={48}
              height={40}
              unoptimized
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=100";
              }}
            />
          </div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
            {itemTitle}
          </span>
        </div>

        {/* Your Bid */}
        <span className="text-sm font-medium text-gray-400">
          {formatPrice(bid.initialAmount || bid.currentAmount, bidCurrency)}
        </span>

        {/* Highest Bid */}
        <span className="text-sm font-medium text-gray-400">
          {formatPrice(bid.currentAmount, bidCurrency)}
        </span>

        {/* Status */}
        <div>
          <span className={`text-xs font-bold uppercase tracking-wide ${statusInfo.colorClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 pr-2">
          {(bid.listing?.saleType || "").toUpperCase() === "AUCTION" &&
            (bid.status || "").toUpperCase() !== "ACCEPTED" &&
            (bid.status || "").toUpperCase() !== "WON" &&
            ((bid.status || "").toUpperCase() === "OUTBID" ||
              (bid.status || "").toUpperCase() === "COUNTERED") && (
              <Link
                href={`/buyer/marketplace/${bid.listing?.slug || bid.listingId}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 sm:p-2.5 bg-[#E78F23]/10 hover:bg-[#E78F23]/20 text-[#E78F23] rounded-lg transition-colors border border-[#E78F23]/20 group/btn"
                title="Increase Bid"
              >
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(bid.id);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-[11px] font-bold rounded-lg border border-white/5 transition-all whitespace-nowrap cursor-pointer"
          >
            View Details <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default BidTableRow;

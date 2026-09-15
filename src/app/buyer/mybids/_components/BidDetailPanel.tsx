import React from "react";
import Link from "next/link";
import { MapPin, Info, BadgeCheck, Share2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { BidDetailPanelProps, formatPrice, formatDate, getStatusBadge } from "./types";

export function BidDetailPanel({
  selectedBid,
  inclFees,
  onToggleInclFees,
  onShare,
}: BidDetailPanelProps) {
  const currentBidVal = parseFloat(selectedBid.currentAmount || selectedBid.initialAmount || "0");
  const vipFeeVal = currentBidVal * 0.015;
  const totalPayableVal = inclFees ? currentBidVal + vipFeeVal : currentBidVal;
  const currency = selectedBid.listing?.currency || "USD";
  const statusInfo = getStatusBadge(selectedBid.status);
  const sellerInitial =
    selectedBid.seller?.firstName?.[0] || selectedBid.seller?.lastName?.[0] || "S";
  const sellerName =
    [selectedBid.seller?.firstName, selectedBid.seller?.lastName].filter(Boolean).join(" ") ||
    "Verified Seller";

  const isAuction = (selectedBid.listing?.saleType || "").toUpperCase() === "AUCTION";
  const isTerminal =
    (selectedBid.status || "").toUpperCase() === "ACCEPTED" ||
    (selectedBid.status || "").toUpperCase() === "WON";

  return (
    <div className="w-full lg:w-95 shrink-0">
      <AnimationWrapper type="fade-left" duration={0.6}>
        <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-8">
          {/* Product Info */}
          <div>
            <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
              {selectedBid.listing?.saleType?.replace("_", " ") || "Auction"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-clash font-semibold text-white">
              {selectedBid.listing?.title || "Listing Details"}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Worldwide</span>
            </div>
          </div>

          {/* Price Summary Card */}
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Price Summary
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Show total incl. fees
                </span>
                <button
                  onClick={onToggleInclFees}
                  className={`w-9 sm:w-10 h-5 sm:h-5.5 rounded-full relative transition-all duration-300 ${
                    inclFees ? "bg-white" : "bg-[#2C2C2E]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                      inclFees ? "left-5 sm:left-5.5 bg-black" : "left-0.5 sm:left-1 bg-white"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm tracking-tight">
                <span className="text-gray-400">Current Bid</span>
                <span className="text-white font-medium">
                  {formatPrice(currentBidVal, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm tracking-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">VIP Fee (1.5%)</span>
                  <Info className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <span className="text-white font-medium">{formatPrice(vipFeeVal, currency)}</span>
              </div>
            </div>

            <div className="pt-5 sm:pt-6 border-t border-white/5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <span className="text-sm font-medium text-gray-400">Total Payable</span>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl lg:text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">
                    {formatPrice(totalPayableVal, currency)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Asking: {formatPrice(selectedBid.listing?.askingPrice, currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
              <div className="w-1.5 h-1.5 bg-[#E78F23] rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
              <span className="text-[9px] text-[#E78F23] font-bold uppercase tracking-widest">
                VIP reduced fee applied
              </span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Status
              </p>
              <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                {statusInfo.label}
              </p>
            </div>
            <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Rounds Count
              </p>
              <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                {selectedBid.roundsCount || 1}
              </p>
            </div>
            <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Initial Offer
              </p>
              <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                {formatPrice(selectedBid.initialAmount, currency)}
              </p>
            </div>
            <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Submitted Date
              </p>
              <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                {formatDate(selectedBid.createdAt)}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5 shrink-0 uppercase">
              {sellerInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-none mb-1 truncate">
                {sellerName}
              </p>
              <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
                <BadgeCheck className="w-3 h-3 shrink-0" />
                <span className="truncate">Verified Dealer</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {isAuction && !isTerminal && (
              <Link
                href={`/buyer/marketplace/${selectedBid.listing?.slug || selectedBid.listingId}`}
                className="w-full py-4 sm:py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Increase Bid
              </Link>
            )}
            <button
              onClick={onShare}
              className="w-full flex items-center justify-center gap-2 py-4 sm:py-4.5 bg-transparent border border-white/10 hover:bg-white/5 text-white text-[13px] font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-gray-400" />
              Share
            </button>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default BidDetailPanel;

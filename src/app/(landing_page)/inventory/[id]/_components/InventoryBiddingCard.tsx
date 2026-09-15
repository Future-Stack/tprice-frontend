import React from "react";
import { Gavel, Send, Clock, RefreshCw } from "lucide-react";
import type { InventoryBiddingCardProps } from "./types";

export function InventoryBiddingCard({
  currencySymbol,
  isAuction,
  isFixedPrice,
  allowCounterOffers,
  highestBidVal,
  startingBidVal,
  totalBidsCountVal,
  existingOffer,
  isOffersLoading,
  onOpenPlaceBid,
  onOpenSendOffer,
  onOpenCounterOffer,
}: InventoryBiddingCardProps) {
  return (
    <>
      {/* Auction Actions */}
      {isAuction && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          {/* Highest Bid Card */}
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                Highest Bid
              </span>
              {totalBidsCountVal !== null && totalBidsCountVal > 0 ? (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20 font-medium">
                  {totalBidsCountVal} {totalBidsCountVal === 1 ? "bid" : "bids"}
                </span>
              ) : (
                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-sm font-medium">
                  {highestBidVal ? "Active" : "No bids yet"}
                </span>
              )}
            </div>

            <div className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">
              {highestBidVal !== null
                ? `${currencySymbol}${highestBidVal.toLocaleString()}`
                : startingBidVal !== null
                  ? `${currencySymbol}${startingBidVal.toLocaleString()}`
                  : "No Bids Yet"}
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-1 border-t border-white/5">
              <span>Starting Bid:</span>
              <span className="text-white/70 font-medium">
                {startingBidVal !== null
                  ? `${currencySymbol}${startingBidVal.toLocaleString()}`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Place / Increase Bid Button */}
          {isOffersLoading ? (
            <div className="w-full h-12 bg-white/5 border border-white/10 rounded-sm animate-pulse" />
          ) : existingOffer &&
            ["PENDING", "LEADING", "OUTBID", "COUNTERED", "ACCEPTED"].includes(
              (existingOffer.status || "").toUpperCase()
            ) ? (
            <button
              onClick={onOpenPlaceBid}
              className="w-full py-4 bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37]/25 transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm active:scale-[0.99]"
            >
              <Gavel size={16} />
              Increase Bid ($
              {Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})
            </button>
          ) : (
            <button
              onClick={onOpenPlaceBid}
              className="w-full py-4 bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#B8962E] transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-lg active:scale-[0.99]"
            >
              <Gavel size={16} />
              Place Bid
            </button>
          )}
        </div>
      )}

      {/* Fixed Price Actions */}
      {isFixedPrice && (
        <div className="space-y-3 pt-4 border-t border-white/5">
          {/* Send Offer Button */}
          {isOffersLoading ? (
            <div className="w-full h-12 bg-white/5 border border-white/10 rounded-sm animate-pulse" />
          ) : existingOffer &&
            ["PENDING", "COUNTERED", "ACCEPTED"].includes(
              (existingOffer.status || "").toUpperCase()
            ) ? (
            <button
              onClick={onOpenSendOffer}
              className="w-full py-4 bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37]/25 transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm active:scale-[0.99]"
            >
              <Clock size={16} />
              Offer Sent ($
              {Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})
            </button>
          ) : (
            <button
              onClick={onOpenSendOffer}
              className="w-full py-4 bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#B8962E] transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-lg active:scale-[0.99]"
            >
              <Send size={16} />
              Send Offer
            </button>
          )}

          {/* Counter Offer Button when allowed */}
          {allowCounterOffers && (
            <button
              onClick={onOpenCounterOffer}
              className="w-full py-4 bg-white/5 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm active:scale-[0.99]"
            >
              <RefreshCw size={16} />
              Counter Offer
            </button>
          )}
        </div>
      )}
    </>
  );
}

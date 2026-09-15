import React from "react";
import Image from "next/image";
import { Check, DollarSign, Info } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { formatPrice, formatDate } from "./types";
import type { BuyerOfferSummaryProps } from "./types";

export function BuyerOfferSummary({
  offer,
  sellerName,
  sellerAvatar,
}: BuyerOfferSummaryProps) {
  const listing = offer.listing;

  return (
    <div className="md:col-span-5 space-y-6">
      <AnimationWrapper type="fade-right">
        <h1 className="text-3xl md:text-[32px] font-medium font-clash tracking-tight mb-6">
          {listing?.title || "Untitled Listing"}
        </h1>

        {/* Seller Card */}
        <div className="bg-[#111113] rounded-2xl border border-white/5 p-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <Image
                src={sellerAvatar}
                alt={sellerName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-sm text-white/90">{sellerName}</div>
              <div className="text-[10px] text-green-500/80 flex items-center gap-1">
                <Check size={10} /> Verified Dealer
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E78F23] shadow-[0_0_8px_rgba(231,143,35,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {offer.status || "Negotiation"}
            </span>
          </div>
        </div>

        {/* Deal Summary Card */}
        <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 md:p-8 space-y-8 mb-3">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
            Deal Summary
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-[11px] font-bold text-gray-400 mb-1">
                Current Offer
              </div>
              <div className="flex text-[32px] md:text-[40px] font-black text-[#D4AF37] leading-none tracking-tight">
                <DollarSign />
                {formatPrice(offer.currentAmount || offer.initialAmount)}
              </div>
              {listing?.askingPrice && (
                <div className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                  Asking: {formatPrice(listing.askingPrice)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-gray-500 uppercase tracking-widest">
                Last Updated
              </span>
              <span className="text-white/80">
                {formatDate(offer.updatedAt || offer.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-gray-500 uppercase tracking-widest">
                Offer ID
              </span>
              <span className="text-white/80 font-mono tracking-normal">
                {offer.id}
              </span>
            </div>
            {listing?.askingPrice && (
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-gray-500 uppercase tracking-widest">
                  Listed Price
                </span>
                <span className="text-white/80">
                  {formatPrice(listing.askingPrice)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Smart Insight */}
        <div className="bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-xl p-4 flex gap-3">
          <div className="w-5 h-5 rounded-full bg-[#E78F23] flex items-center justify-center shrink-0 mt-0.5">
            <Info size={12} className="text-black font-bold" />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#E78F23] uppercase tracking-wider">
              Smart Insight
            </div>
            <p className="text-[11px] leading-relaxed text-[#E78F23]/90">
              {offer.roundsCount && offer.roundsCount > 1
                ? `${offer.roundsCount} negotiation rounds recorded — active conversation with seller.`
                : "Initial offer placed — awaiting seller counter or acceptance."}
            </p>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

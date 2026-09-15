import React from "react";
import Image from "next/image";
import { MapPin, Handshake, RefreshCcw, X } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { BuyerOfferActionsProps } from "./types";

export function BuyerOfferActions({
  offer,
  imageUrl,
  statusUpper,
  showCounterButton,
  isAccepting,
  isWithdrawing,
  onAccept,
  onOpenCounterModal,
  onWithdraw,
}: BuyerOfferActionsProps) {
  const listing = offer.listing;

  return (
    <div className="md:col-span-6 space-y-6">
      <AnimationWrapper type="fade-left">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          <MapPin size={14} className="text-gray-600" />
          Verified Listing
        </div>

        {/* Main Product Image */}
        <div className="relative aspect-16/10 rounded-[2rem] overflow-hidden border border-white/5 group">
          <Image
            src={imageUrl}
            alt={listing?.title || "Listing image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          {statusUpper === "COUNTERED" && (
            <button
              onClick={onAccept}
              disabled={isAccepting}
              className="w-full py-4.5 bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Handshake size={18} />
              {isAccepting ? "Accepting..." : "Accept offer"}
            </button>
          )}

          {showCounterButton && (
            <button
              onClick={onOpenCounterModal}
              className="w-full py-4.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <RefreshCcw size={16} />
              Send Counter Offer
            </button>
          )}

          {statusUpper !== "ACCEPTED" &&
            statusUpper !== "REJECTED" &&
            statusUpper !== "WITHDRAWN" && (
              <button
                onClick={onWithdraw}
                disabled={isWithdrawing}
                className="w-full py-4.5 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 disabled:opacity-50 text-[#FF4D4D] font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-[#8B0000]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <X size={16} className={isWithdrawing ? "animate-spin" : ""} />
                {isWithdrawing ? "Withdrawing..." : "Withdraw Offer"}
              </button>
            )}
        </div>
      </AnimationWrapper>
    </div>
  );
}

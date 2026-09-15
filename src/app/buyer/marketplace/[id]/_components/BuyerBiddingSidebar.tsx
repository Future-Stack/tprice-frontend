import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Info, BadgeCheck, Gavel, Heart, Share2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { BuyerBiddingSidebarProps } from "./types";

export function BuyerBiddingSidebar({
  product,
  locationText,
  formattedPrice,
  numericPrice,
  existingOffer,
  isSaving,
  isSaved,
  dynamicSpecs,
  sellerName,
  sellerInitial,
  onOpenPlaceBid,
  onToggleSave,
  onExitBiddingMode,
}: BuyerBiddingSidebarProps) {
  const [inclFees, setInclFees] = useState(true);

  const vipFeeRate = 0.015;
  const vipFee = Math.round(numericPrice * vipFeeRate);
  const totalPayable = inclFees ? numericPrice + vipFee : numericPrice;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimationWrapper type="fade-down" duration={0.4}>
        <div>
          <span className="inline-block bg-[#E78F23]/20 text-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
            {product.subCategory || product.category || "AUCTION"}
          </span>
          <h2 className="text-3xl font-clash font-semibold text-white">{product.title}</h2>
          <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationText}</span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Price Summary Card */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Price Summary
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                Show total incl. fees
              </span>
              <button
                onClick={() => setInclFees(!inclFees)}
                className={`w-10 h-5.5 rounded-full relative transition-all duration-300 cursor-pointer ${inclFees ? "bg-white" : "bg-[#2C2C2E]"}`}
              >
                <div
                  className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${inclFees ? "left-5.5 bg-black" : "left-1 bg-white"}`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm tracking-tight">
              <span className="text-gray-400">Asking Price</span>
              <span className="text-white font-medium">{formattedPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm tracking-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">VIP Fee (1.5%)</span>
                <Info className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <span className="text-white font-medium">${vipFee.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-400 mt-1">Total Payable</span>
              <div className="text-right">
                <p className="text-[32px] font-clash font-medium text-primary leading-none mb-1 tracking-tight">
                  ${totalPayable.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500">Asking: {formattedPrice}</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">
              VIP reduced fee applied
            </span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Attributes Grid (Dynamic Key & Value) */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
        <div className="grid grid-cols-2 gap-3">
          {dynamicSpecs.length > 0 ? (
            dynamicSpecs.map((spec, index) => (
              <div key={index} className="bg-[#161618] rounded-xl p-4 border border-white/3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 truncate">
                  {spec.label}
                </p>
                <p className="text-[15px] font-medium text-white truncate" title={spec.value}>
                  {spec.value}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-[#161618] rounded-xl p-4 border border-white/3 text-xs text-gray-500 italic">
              No specifications available
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Seller */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
        <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
          {product.owner?.avatarUrl ? (
            <Image
              src={product.owner.avatarUrl}
              alt={sellerName}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5">
              {sellerInitial}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white leading-none mb-1">{sellerName}</p>
            <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
              <BadgeCheck className="w-3 h-3" />
              {product.owner?.isVerified ? "Verified Dealer" : "Seller"}
            </p>
          </div>
        </div>
      </AnimationWrapper>

      {/* Bidding Actions */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.4}>
        <div className="space-y-3 pt-2">
          <button
            onClick={onOpenPlaceBid}
            className="w-full py-4.5 bg-primary hover:brightness-110 text-white text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Gavel className="w-4.5 h-4.5" />
            {existingOffer
              ? `Increase Bid ($${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})`
              : "Place Bid"}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onToggleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Heart className="w-4 h-4 text-primary" fill={isSaved ? "#E78F23" : "none"} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-gray-400" />
              Share
            </button>
          </div>
        </div>
      </AnimationWrapper>

      {/* Cancel / Back Link */}
      <button
        onClick={onExitBiddingMode}
        className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors pt-2 font-medium cursor-pointer"
      >
        Go Back to Details
      </button>
    </div>
  );
}

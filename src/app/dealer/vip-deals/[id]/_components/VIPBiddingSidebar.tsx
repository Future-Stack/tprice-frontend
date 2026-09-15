import React from "react";
import Image from "next/image";
import { MapPin, Info, BadgeCheck, Heart, Share2, Check } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPBiddingSidebarProps } from "./types";

export function VIPBiddingSidebar({
  vm,
  title,
  categoryFallback,
  sellerAvatarUrl,
  inclFees,
  onToggleInclFees,
  isSaved,
  onToggleSave,
  copied,
  onShare,
  onSubmitBid,
  onCancelBidding,
}: VIPBiddingSidebarProps) {
  return (
    <div className="max-w-95 w-full shrink-0 space-y-6">
      {/* Header */}
      <AnimationWrapper type="fade-down" duration={0.4}>
        <div>
          <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
            {vm.badgeLabel}
          </span>
          <h2 className="text-3xl font-clash font-semibold text-white">{title}</h2>
          <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{vm.locationText}</span>
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
                onClick={onToggleInclFees}
                className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${
                  inclFees ? "bg-white" : "bg-[#2C2C2E]"
                }`}
              >
                <div
                  className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    inclFees ? "left-5.5 bg-black" : "left-1 bg-white"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm tracking-tight">
              <span className="text-gray-400">Current Price</span>
              <span className="text-white font-medium">{vm.formattedPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm tracking-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">VIP Fee (1.5%)</span>
                <Info className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <span className="text-white font-medium">{vm.formattedVipFee}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-400 mt-1">Total Payable</span>
              <div className="text-right">
                <p className="text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">
                  {vm.formattedTotalPayable}
                </p>
                <p className="text-[11px] text-gray-500">Asking: {vm.formattedPrice}</p>
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
      </AnimationWrapper>

      {/* Attributes Grid (image style 2x2) */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
        <div className="grid grid-cols-2 gap-3">
          {vm.specItems.slice(0, 4).map((item, idx) => (
            <div key={idx} className="bg-[#161618] rounded-xl p-4 border border-white/3">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-[15px] font-medium text-white truncate">{item.value}</p>
            </div>
          ))}
          {vm.specItems.length < 4 && (
            <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                CATEGORY
              </p>
              <p className="text-[15px] font-medium text-white truncate">{categoryFallback}</p>
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Seller - compact style */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
        <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
          {sellerAvatarUrl ? (
            <Image
              src={sellerAvatarUrl}
              alt={vm.sellerName}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover border border-white/5"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5">
              {vm.sellerInitial}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white leading-none mb-1">{vm.sellerName}</p>
            <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
              <BadgeCheck className="w-3.5 h-3.5" />
              {vm.sellerBadge}
            </p>
          </div>
        </div>
      </AnimationWrapper>

      {/* Bidding Actions */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.4}>
        <div className="space-y-3 pt-2">
          <button
            onClick={onSubmitBid}
            className="w-full py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98]"
          >
            Place Bid
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onToggleSave}
              className={`flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors ${
                isSaved ? "text-[#E78F23]" : ""
              }`}
            >
              <Heart className="w-4 h-4 text-[#E78F23]" fill={isSaved ? "#E78F23" : "none"} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share2 className="w-4 h-4 text-gray-400" />
              )}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </AnimationWrapper>

      {/* Cancel / Back Link */}
      <button
        onClick={onCancelBidding}
        className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors pt-2 font-medium"
      >
        Go Back to Details
      </button>
    </div>
  );
}

export default VIPBiddingSidebar;

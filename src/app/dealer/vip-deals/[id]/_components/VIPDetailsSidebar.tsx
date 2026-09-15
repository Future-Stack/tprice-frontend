import React from "react";
import Image from "next/image";
import { MapPin, Info, BadgeCheck } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPDetailsSidebarProps } from "./types";

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-white truncate">{value}</p>
    </div>
  );
}

export function VIPDetailsSidebar({
  vm,
  title,
  sellerAvatarUrl,
  onPlaceBid,
  onSendOffer,
}: VIPDetailsSidebarProps) {
  return (
    <div className="max-w-95 w-full shrink-0 space-y-5">
      {/* Auction Badge & Title */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
        <div>
          <span className="inline-block bg-[#E78F23]/10 text-[#E78F23] text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-[#E78F23]/20">
            {vm.badgeLabel}
          </span>
          <h2 className="text-[32px] font-clash font-medium tracking-tight leading-tight text-white">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-2.5 text-gray-400 text-sm">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="font-medium">{vm.locationText}</span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Price */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.15}>
        <div className="pt-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1">
            {vm.currentBidLabel}
          </p>
          <p className="text-3xl font-inter font-medium text-[#E78F23]">{vm.formattedPrice}</p>
        </div>
      </AnimationWrapper>

      {/* Action Buttons */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onPlaceBid}
            className="w-full py-4 bg-[#E78F23] hover:bg-[#E78F23]/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide"
          >
            Place Bid
          </button>
          <button
            onClick={onSendOffer}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all border border-white/10 active:scale-[0.98] capitalize tracking-wide"
          >
            send offer
          </button>
        </div>
      </AnimationWrapper>

      {/* Key Specifications */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
        <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
          <div className="flex items-center gap-2.5 mb-5">
            <Info className="w-4 h-4 text-[#E78F23]" />
            <h4 className="text-sm font-semibold text-white">Key Specifications</h4>
          </div>

          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            {vm.specItems.length > 0 ? (
              vm.specItems.map((item, idx) => (
                <SpecItem key={idx} label={item.label} value={item.value} />
              ))
            ) : (
              <>
                <SpecItem label="YEAR" value="2023" />
                <SpecItem label="CATEGORY" value="VIP Asset" />
                <SpecItem label="CONDITION" value="Pristine" />
              </>
            )}
          </div>
        </div>
      </AnimationWrapper>

      {/* Seller Information */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.3}>
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6">
          <h4 className="text-sm font-semibold mb-5 text-white">Seller Information</h4>
          <div className="flex items-center gap-4">
            {sellerAvatarUrl ? (
              <Image
                src={sellerAvatarUrl}
                alt={vm.sellerName}
                width={44}
                height={44}
                unoptimized
                className="w-11 h-11 rounded-full object-cover border border-[#3C3C3E]"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#2C2C2E] font-inter flex items-center justify-center text-[#E78F23] font-bold text-lg border border-[#3C3C3E]">
                {vm.sellerInitial}
              </div>
            )}
            <div>
              <p className="font-semibold text-[15px] text-white">{vm.sellerName}</p>
              <p className="text-xs text-green-400/90 flex items-center gap-1.5 mt-1 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                {vm.sellerBadge}
              </p>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default VIPDetailsSidebar;

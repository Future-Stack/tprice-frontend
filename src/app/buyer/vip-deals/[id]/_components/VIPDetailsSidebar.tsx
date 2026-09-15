"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Info, BadgeCheck, Heart, Share2, Check, DollarSign, Gavel } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { VIPDetailsSidebarProps } from "./types";

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
  product,
  badgeLabel,
  locationText,
  formattedPrice,
  currencySymbol,
  askingPriceVal,
  startingBidVal,
  highestBidVal,
  totalBidsCountVal,
  existingOffer,
  specItems,
  sellerName,
  sellerInitial,
  sellerBadge,
  isSaved,
  isSaving,
  copied,
  onOpenOfferModal,
  onStartBidding,
  onToggleSave,
  onShare,
}: VIPDetailsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <AnimationWrapper type="fade-left" duration={0.5}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#E78F23]/20 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {badgeLabel}
            </span>
            {existingOffer && (
              <span className="inline-block bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-teal-500/30">
                Offer Submitted ($
                {Number(
                  existingOffer.currentAmount || existingOffer.initialAmount
                ).toLocaleString()}
                )
              </span>
            )}
          </div>

          <h1 className="text-3xl font-clash font-semibold text-white leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{locationText}</span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Price Card */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
              Asking Price
            </p>
            <p className="text-3xl font-clash font-semibold text-primary">{formattedPrice}</p>
            <p className="text-xs text-gray-500 mt-1">
              Includes VIP Concierge Inspection & Verification
            </p>
          </div>

          {/* Conditional Property Details Breakdown */}
          {(askingPriceVal !== null ||
            startingBidVal !== null ||
            highestBidVal !== null ||
            totalBidsCountVal !== null) && (
            <div className="bg-[#111111] border border-white/5 rounded-xl p-3.5 grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              {askingPriceVal !== null && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                    Asking Price
                  </p>
                  <p className="text-sm font-medium text-white">
                    {currencySymbol}
                    {askingPriceVal.toLocaleString()}
                  </p>
                </div>
              )}
              {startingBidVal !== null && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                    Starting Bid
                  </p>
                  <p className="text-sm font-medium text-white">
                    {currencySymbol}
                    {startingBidVal.toLocaleString()}
                  </p>
                </div>
              )}
              {highestBidVal !== null && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                    Highest Bid
                  </p>
                  <p className="text-sm font-medium text-green-400">
                    {currencySymbol}
                    {highestBidVal.toLocaleString()}
                  </p>
                </div>
              )}
              {totalBidsCountVal !== null && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                    Total Bids
                  </p>
                  <p className="text-sm font-medium text-white">{totalBidsCountVal}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Main Actions */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
        <div className="space-y-3">
          <button
            onClick={onOpenOfferModal}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            {existingOffer ? "Update My Offer" : "Make an Offer"}
          </button>

          <button
            onClick={onStartBidding}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Gavel className="w-4 h-4 text-primary" />
            View Fee Breakdown & Bidding
          </button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onToggleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 py-3.5 bg-[#161618] text-white text-xs font-semibold rounded-xl border border-[#2C2C2E] hover:border-white/20 transition-all cursor-pointer ${
                isSaved ? "text-primary border-primary/50" : ""
              }`}
            >
              <Heart className="w-4 h-4 text-primary" fill={isSaved ? "#E78F23" : "none"} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 py-3.5 bg-[#161618] text-white text-xs font-semibold rounded-xl border border-[#2C2C2E] hover:border-white/20 transition-all cursor-pointer"
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

      {/* Key Specifications */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
        <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
          <div className="flex items-center gap-2.5 mb-5">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-white">Key Specifications</h4>
          </div>

          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            {specItems.length > 0 ? (
              specItems.map((item, idx) => (
                <SpecItem key={idx} label={item.label} value={item.value} />
              ))
            ) : (
              <>
                <SpecItem label="YEAR" value={String(product.buildYear || 2024)} />
                <SpecItem label="CATEGORY" value={product.category || "VIP Asset"} />
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
            {product.owner?.avatarUrl ? (
              <Image
                src={product.owner.avatarUrl}
                alt={sellerName}
                className="w-11 h-11 rounded-full object-cover border border-[#3C3C3E]"
                width={44}
                height={44}
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#2C2C2E] font-inter flex items-center justify-center text-primary font-bold text-lg border border-[#3C3C3E]">
                {sellerInitial}
              </div>
            )}
            <div>
              <p className="font-semibold text-[15px] text-white">{sellerName}</p>
              <p className="text-xs text-green-400/90 flex items-center gap-1.5 mt-1 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                {sellerBadge}
              </p>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Send,
  Gavel,
  Lock,
  Info,
  BadgeCheck,
  Mail,
  Phone,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { BuyerListingSidebarProps } from "./types";

export function BuyerListingSidebar({
  product,
  locationText,
  formattedPrice,
  currencySymbol,
  askingPriceVal,
  startingBidVal,
  highestBidVal,
  totalBidsCountVal,
  isAuction,
  isFixedPrice,
  isPrivateSale,
  existingOffer,
  isUserOffersLoading,
  dynamicSpecs,
  sellerName,
  sellerInitial,
  onOpenSendOffer,
  onOpenViewOffer,
  onOpenPlaceBid,
}: BuyerListingSidebarProps) {
  return (
    <div className="space-y-5">
      {/* Auction/Category Badge & Title */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
        <div>
          <span className="inline-block bg-[#E78F23]/10 text-primary text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-[#E78F23]/20">
            {product.subCategory || product.category || "EXOTIC"}
          </span>
          <h2 className="text-[32px] font-clash font-medium tracking-tight leading-tight text-white">
            {product.title}
          </h2>
          <div className="flex items-center gap-2 mt-2.5 text-gray-400 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{locationText}</span>
          </div>
        </div>
      </AnimationWrapper>

      {/* Price */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.15}>
        <div className="pt-2 space-y-3">
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1">
              {isAuction
                ? "STARTING BID / CURRENT BID"
                : isPrivateSale
                  ? "ESTIMATED VALUE / ASK"
                  : "CURRENT PRICE / ASK"}
            </p>
            <p className="text-3xl font-inter font-medium text-primary">
              {formattedPrice}
            </p>
          </div>

          {/* Conditional Property Details Breakdown */}
          {(askingPriceVal !== null ||
            startingBidVal !== null ||
            highestBidVal !== null ||
            totalBidsCountVal !== null) && (
            <div className="bg-[#161618] border border-[#2C2C2E] rounded-xl p-4 grid grid-cols-2 gap-3">
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

      {/* Action Buttons */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
        {isFixedPrice && (
          <>
            {isUserOffersLoading ? (
              <div className="w-full h-13 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl animate-pulse" />
            ) : existingOffer &&
              ["PENDING", "COUNTERED", "ACCEPTED"].includes(
                (existingOffer.status || "").toUpperCase()
              ) ? (
              <button
                onClick={onOpenViewOffer}
                className="w-full py-4 bg-[#E78F23]/15 border border-[#E78F23]/40 text-primary hover:bg-[#E78F23]/25 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <Clock className="w-4.5 h-4.5 text-primary" />
                Offer Sent ($
                {Number(
                  existingOffer.currentAmount || existingOffer.initialAmount
                ).toLocaleString()}
                )
              </button>
            ) : (
              <button
                onClick={onOpenSendOffer}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Offer
              </button>
            )}
          </>
        )}

        {isAuction && (
          <>
            {isUserOffersLoading ? (
              <div className="w-full h-13 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl animate-pulse" />
            ) : existingOffer &&
              ["PENDING", "LEADING", "OUTBID", "COUNTERED", "ACCEPTED"].includes(
                (existingOffer.status || "").toUpperCase()
              ) ? (
              <button
                onClick={onOpenPlaceBid}
                className="w-full py-4 bg-[#E78F23]/15 border border-[#E78F23]/40 text-primary hover:bg-[#E78F23]/25 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <Gavel className="w-4.5 h-4.5 text-primary" />
                Increase Bid ($
                {Number(
                  existingOffer.currentAmount || existingOffer.initialAmount
                ).toLocaleString()}
                )
              </button>
            ) : (
              <button
                onClick={onOpenPlaceBid}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                <Gavel className="w-4 h-4" />
                Place Bid
              </button>
            )}
          </>
        )}

        {isPrivateSale && (
          <div className="w-full py-4 px-4 bg-[#161618] border border-[#E78F23]/30 rounded-xl text-center flex items-center justify-center gap-2.5 shadow-lg">
            <Lock className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-medium text-gray-300">
              This item is available for{" "}
              <span className="text-primary font-semibold">Private Sale</span> only.
            </p>
          </div>
        )}
      </AnimationWrapper>

      {/* Key Specifications (Dynamic Key & Value) */}
      <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
        <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
          <div className="flex items-center gap-2.5 mb-5">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-white">Key Specifications</h4>
          </div>

          {dynamicSpecs.length > 0 ? (
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {dynamicSpecs.map((spec, index) => (
                <div key={index}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1.5 truncate">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-white truncate" title={spec.value}>
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No specifications listed</p>
          )}
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
                width={44}
                height={44}
                unoptimized
                className="w-11 h-11 rounded-full object-cover border border-[#3C3C3E]"
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
                {product.owner?.isVerified
                  ? "Verified Premium Dealer"
                  : "Registered Seller"}
              </p>
            </div>
          </div>

          {(product.owner?.email || product.owner?.phone) && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
              {product.owner?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{product.owner.email}</span>
                </div>
              )}
              {product.owner?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{product.owner.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </AnimationWrapper>
    </div>
  );
}

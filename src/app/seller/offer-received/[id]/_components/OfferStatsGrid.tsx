import React from "react";
import { DollarSign } from "lucide-react";
import { formatTimeAgo } from "./types";
import type { OfferStatsGridProps } from "./types";

export function OfferStatsGrid({
  formattedCurrentAmount,
  formattedInitialAmount,
  formattedAskingPrice,
  priceDiffPercent,
  roundsCount,
  updatedAt,
}: OfferStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Current Offer Card */}
      <div className="relative group bg-[#111113] rounded-2xl border border-[#E78F23]/30 p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <DollarSign size={48} className="text-[#E78F23]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Latest Offer Amount
        </p>
        <div className="text-3xl font-black text-primary tracking-tight">
          {formattedCurrentAmount}
        </div>
        {priceDiffPercent !== null && (
          <p
            className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${
              priceDiffPercent >= 0 ? "text-emerald-400" : "text-primary"
            }`}
          >
            <span>{priceDiffPercent >= 0 ? `+${priceDiffPercent}%` : `${priceDiffPercent}%`}</span>
            <span className="text-gray-500">vs asking price</span>
          </p>
        )}
      </div>

      {/* Initial Offer Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Initial Offer
        </p>
        <div className="text-2xl font-bold text-white tracking-tight">{formattedInitialAmount}</div>
        <p className="text-[11px] text-gray-500 mt-2">Starting proposal</p>
      </div>

      {/* Listing Asking Price Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Asking Price
        </p>
        <div className="text-2xl font-bold text-gray-200 tracking-tight">
          {formattedAskingPrice}
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Listed value</p>
      </div>

      {/* Negotiation Rounds Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Negotiation Rounds
        </p>
        <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>{roundsCount}</span>
          <span className="text-xs text-gray-500 font-normal">
            {roundsCount === 1 ? "round" : "rounds"}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Last update {formatTimeAgo(updatedAt)}</p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { PricingTabProps } from "./types";

export default function PricingTab({
  saleType,
  setSaleType,
  askingPrice,
  setAskingPrice,
  startingBid,
  setStartingBid,
  auctionEndsAt,
  setAuctionEndsAt,
  currency,
  allowCounterOffers,
  setAllowCounterOffers,
}: PricingTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-2">
          Sale Format <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "FIXED_PRICE" as const, label: "Fixed Price" },
            { id: "AUCTION" as const, label: "Auction" },
            { id: "PRIVATE_SALE" as const, label: "Private Treaty" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setSaleType(st.id)}
              className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                saleType === st.id
                  ? "bg-[#EAB308] text-black border-[#EAB308]"
                  : "bg-[#111111] border-[#333333] text-gray-300 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(saleType === "FIXED_PRICE" || saleType === "PRIVATE_SALE") && (
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Asking Price <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="295000"
                min="0"
                className="w-full bg-[#111111] border border-[#333333] rounded-xl pl-8 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>
        )}

        {saleType === "AUCTION" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Starting Bid <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  placeholder="150000"
                  min="0"
                  className="w-full bg-[#111111] border border-[#333333] rounded-xl pl-8 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Auction End Date
              </label>
              <input
                type="datetime-local"
                value={auctionEndsAt ? new Date(auctionEndsAt).toISOString().slice(0, 16) : ""}
                onChange={(e) => setAuctionEndsAt(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Currency</label>
          <div className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100">
            {currency || "USD"}
          </div>
        </div>
      </div>

      {saleType === "FIXED_PRICE" && (
        <div className="pt-2">
          <label className="flex items-center gap-3 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl cursor-pointer hover:border-[#444] transition-colors">
            <input
              type="checkbox"
              checked={allowCounterOffers}
              onChange={(e) => setAllowCounterOffers(e.target.checked)}
              className="w-4 h-4 accent-[#EAB308] rounded cursor-pointer"
            />
            <div>
              <span className="text-sm font-semibold text-gray-100 block">
                Allow Counter Offers / Buyer Offers
              </span>
              <span className="text-xs text-gray-400">
                Enable buyers to submit custom negotiation offers on this asset.
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

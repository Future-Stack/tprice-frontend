import React from "react";
import { DollarSign, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { PricingStepProps, SaleType } from "./types";

const SALE_TYPES: { id: SaleType; title: string; desc: string }[] = [
  {
    id: "FIXED_PRICE",
    title: "Fixed Price",
    desc: "Set a specific asking price",
  },
  {
    id: "AUCTION",
    title: "Auction",
    desc: "Set starting bid and auction end date",
  },
  {
    id: "PRIVATE_SALE",
    title: "Private Sale",
    desc: "Price on Application (POA)",
  },
];

export function PricingStep({
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
  minAuctionDate,
  maxAuctionDate,
}: PricingStepProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" /> Pricing & Sale Type
      </h3>

      {/* Sale Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SALE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setSaleType(type.id)}
            className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
              saleType === type.id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-gray-600"
            }`}
          >
            <span
              className={`font-semibold text-sm mb-1 ${
                saleType === type.id ? "text-primary" : "text-white"
              }`}
            >
              {type.title}
            </span>
            <span className="text-gray-400 text-xs">{type.desc}</span>
          </button>
        ))}
      </div>

      {/* Pricing Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asking Price */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Asking Price ({currency}){" "}
            {saleType === "FIXED_PRICE" ? (
              <span className="text-primary">*</span>
            ) : (
              <span className="text-gray-500 font-normal normal-case text-xs">
                (Optional for Private Sale)
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
              $
            </span>
            <input
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              placeholder="625000"
              className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Starting Bid if Auction */}
        {saleType === "AUCTION" && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Starting Bid ({currency}) <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  placeholder="500000"
                  className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Auction Ends At{" "}
                  <span className="text-primary">*</span>
                </label>
                <span className="text-[11px] text-gray-400">Max 7 days from today</span>
              </div>
              <DatePicker
                selected={auctionEndsAt ? new Date(auctionEndsAt) : null}
                onChange={(date: Date | null) => {
                  setAuctionEndsAt(date ? date.toISOString() : "");
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                minDate={minAuctionDate}
                maxDate={maxAuctionDate}
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner cursor-pointer"
                wrapperClassName="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Allow Counter Offers - Only for FIXED_PRICE */}
      {saleType === "FIXED_PRICE" && (
        <div className="flex items-center gap-3 bg-[#1c1c1e] border border-[#2C2C2E] p-4 rounded-xl">
          <input
            type="checkbox"
            id="allowCounterOffers"
            checked={allowCounterOffers}
            onChange={(e) => setAllowCounterOffers(e.target.checked)}
            className="w-4 h-4 rounded border-[#2C2C2E] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
          />
          <label
            htmlFor="allowCounterOffers"
            className="text-xs font-semibold text-gray-200 cursor-pointer"
          >
            Allow potential buyers to submit counter-offers
          </label>
        </div>
      )}
    </div>
  );
}

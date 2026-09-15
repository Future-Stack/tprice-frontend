import React from "react";
import { ChevronDown, X } from "lucide-react";
import { DealerFilterDrawerProps, DEALER_CATEGORIES } from "./types";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[#E78F23] transition-colors cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1C1C1E] text-white">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

function FilterContent(props: DealerFilterDrawerProps) {
  const {
    activeCategory,
    setActiveCategory,
    draftFilters,
    setDraftFilters,
    handleReset,
    handleApply,
    minLimit,
    maxLimit,
  } = props;

  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">Filter Listing</h3>
        <button
          onClick={handleReset}
          className="text-[#E78F23] text-xs sm:text-sm font-medium hover:underline cursor-pointer"
        >
          Reset
        </button>
      </div>
      <div className="h-px bg-[#2C2C2E] w-full mb-5 sm:mb-6" />

      {/* Category */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Category</label>
        <div className="flex flex-col gap-1">
          {DEALER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 sm:px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#2C2C2E] text-white font-medium"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <FilterSelect
        label="Type"
        value={draftFilters.type}
        onChange={(val) => setDraftFilters((prev) => ({ ...prev, type: val }))}
        options={["All", "Sport", "Yacht", "Luxury", "Private Jet", "Convertible", "Casual"]}
      />

      {/* Model */}
      <FilterSelect
        label="Model"
        value={draftFilters.model}
        onChange={(val) => setDraftFilters((prev) => ({ ...prev, model: val }))}
        options={["All", "Ferrari", "Volvo", "Rolex", "Azimut", "Gulfstream"]}
      />

      {/* Build Year */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Build Year</label>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={draftFilters.yearFrom}
            onChange={(e) => setDraftFilters((prev) => ({ ...prev, yearFrom: e.target.value }))}
            className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
            placeholder="2005"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input
            type="text"
            value={draftFilters.yearTo}
            onChange={(e) => setDraftFilters((prev) => ({ ...prev, yearTo: e.target.value }))}
            className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
            placeholder="2024"
          />
        </div>
      </div>

      <div className="h-px bg-[#2C2C2E] w-full mb-5 sm:mb-6" />

      {/* Price Range */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-5 sm:mb-6">Price Range</label>
        <div className="relative h-1 bg-[#2C2C2E] rounded-full mb-5 sm:mb-6">
          <div
            className="absolute h-full bg-[#E78F23]"
            style={{
              left: `${((draftFilters.priceMin - minLimit) / (maxLimit - minLimit)) * 100}%`,
              right: `${100 - ((draftFilters.priceMax - minLimit) / (maxLimit - minLimit)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={draftFilters.priceMin}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                priceMin: Math.min(Number(e.target.value), draftFilters.priceMax - 1000),
              }))
            }
            className="absolute w-full -top-2 h-5 appearance-none bg-transparent pointer-events-none z-10
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-5 sm:[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:h-6 
              [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-[#E78F23] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 sm:[&::-moz-range-thumb]:w-6 
              [&::-moz-range-thumb]:h-5 sm:[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-md 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#E78F23] 
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={draftFilters.priceMax}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                priceMax: Math.max(Number(e.target.value), draftFilters.priceMin + 1000),
              }))
            }
            className="absolute w-full -top-2 h-5 appearance-none bg-transparent pointer-events-none z-20
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-5 sm:[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:h-6 
              [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-[#E78F23] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 sm:[&::-moz-range-thumb]:w-6 
              [&::-moz-range-thumb]:h-5 sm:[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-md 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#E78F23] 
              [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-white">
          <span>${draftFilters.priceMin.toLocaleString()}</span>
          <span>${draftFilters.priceMax.toLocaleString()}</span>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full py-3.5 sm:py-4 bg-[#E78F23] hover:bg-[#D47D17] text-black font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
      >
        Apply
      </button>
    </div>
  );
}

export function DealerMarketplaceFilterDrawer(props: DealerFilterDrawerProps) {
  const { isMobileDrawerOpen, onCloseMobileDrawer } = props;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-75 shrink-0">
        <FilterContent {...props} />
      </aside>

      {/* Mobile Filter Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobileDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-[320px] bg-[#1C1C1E] shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <FilterContent {...props} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DealerMarketplaceFilterDrawer;

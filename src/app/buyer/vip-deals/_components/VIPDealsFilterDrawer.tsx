import React from "react";
import { Search, RotateCcw, ChevronDown, X } from "lucide-react";
import { VIPDealsFilterProps } from "./types";
import { PriceRangeSlider } from "./PriceRangeSlider";

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
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2 text-sm text-white appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
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

function FilterContent(props: VIPDealsFilterProps) {
  const {
    activeCategory,
    setActiveCategory,
    selectedBrand,
    setSelectedBrand,
    locationCity,
    setLocationCity,
    locationCountry,
    setLocationCountry,
    buildYear,
    setBuildYear,
    search,
    setSearch,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    handleReset,
    minLimit,
    maxLimit,
    categoriesList,
    brandsList,
  } = props;

  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">Filter Listings</h3>
        <button
          onClick={handleReset}
          className="text-primary text-xs sm:text-sm font-medium hover:underline cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
      <div className="h-px bg-[#2C2C2E] w-full" />

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keyword..."
            className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Category
        </label>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#E78F23]/15 text-primary font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location City & Country */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Location
        </label>
        <input
          type="text"
          value={locationCity}
          onChange={(e) => setLocationCity(e.target.value)}
          placeholder="City (e.g. Monaco, Geneva)"
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          value={locationCountry}
          onChange={(e) => setLocationCountry(e.target.value)}
          placeholder="Country (e.g. Switzerland)"
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Brand Filter */}
      <FilterSelect
        label="Brand"
        value={selectedBrand}
        onChange={(val) => setSelectedBrand(val)}
        options={brandsList}
      />

      {/* Build Year */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Build Year
        </label>
        <input
          type="number"
          value={buildYear}
          onChange={(e) => setBuildYear(e.target.value)}
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          placeholder="e.g. 2024"
        />
      </div>

      <div className="h-px bg-[#2C2C2E] w-full" />

      {/* Price Range */}
      <PriceRangeSlider
        minLimit={minLimit}
        maxLimit={maxLimit}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
      />
    </div>
  );
}

export function VIPDealsFilterDrawer(props: VIPDealsFilterProps) {
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobileDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-[340px] bg-[#1C1C1E] shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-white">Filter VIP Deals</h3>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <FilterContent {...props} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VIPDealsFilterDrawer;

import React from "react";
import { RotateCcw, X } from "lucide-react";
import { MarketplaceFilterProps } from "./types";

function FilterContent(props: MarketplaceFilterProps) {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    locationCity,
    setLocationCity,
    locationCountry,
    setLocationCountry,
    buildYear,
    setBuildYear,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    handleResetFilters,
  } = props;

  const maxLimit = 100000000;

  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">Filter Listings</h3>
        <button
          onClick={handleResetFilters}
          className="text-primary text-xs sm:text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
      <div className="h-px bg-[#2C2C2E] w-full" />

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Category
        </label>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-left px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? "bg-[#E78F23]/15 text-primary font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
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
          placeholder="City (e.g. Miami, Geneva)"
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          value={locationCountry}
          onChange={(e) => setLocationCountry(e.target.value)}
          placeholder="Country (e.g. United States)"
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Build Year */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Build Year
        </label>
        <input
          type="number"
          value={buildYear}
          onChange={(e) => setBuildYear(e.target.value)}
          placeholder="e.g. 2024"
          className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="h-px bg-[#2C2C2E] w-full" />

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Price Range ($)
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Min Price</span>
            <input
              type="number"
              value={priceMin || ""}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Max Price</span>
            <input
              type="number"
              value={priceMax >= maxLimit ? "" : priceMax}
              onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : maxLimit)}
              placeholder="Max"
              className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="relative h-1.5 bg-[#2C2C2E] rounded-full mb-3">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${Math.min(100, Math.max(0, (priceMin / maxLimit) * 100))}%`,
              right: `${Math.min(100, Math.max(0, 100 - (Math.min(priceMax, maxLimit) / maxLimit) * 100))}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 font-medium">
          <span>${priceMin.toLocaleString()}</span>
          <span>{priceMax >= maxLimit ? "Any Max" : `$${priceMax.toLocaleString()}`}</span>
        </div>
      </div>
    </div>
  );
}

export function MarketplaceFilterDrawer(props: MarketplaceFilterProps) {
  const { isMobileDrawerOpen, onCloseMobileDrawer } = props;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <FilterContent {...props} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobileDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-85 bg-[#1C1C1E] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-white">Filter Listings</h3>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
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

export default MarketplaceFilterDrawer;

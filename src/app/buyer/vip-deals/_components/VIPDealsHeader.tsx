import React from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPDealsHeaderProps, SORT_OPTIONS } from "./types";

export function VIPDealsHeader({
  categoriesList,
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
  onOpenMobileFilter,
  sortBy,
  onSortChange,
}: VIPDealsHeaderProps) {
  return (
    <>
      {/* ── Page Header & Category Tabs ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 lg:mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-clash font-medium tracking-wide text-white">
              VIP Deals
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
              Exclusive off-market listings available only to VIP members
            </p>
          </div>
        </AnimationWrapper>

        {/* Category Tabs */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* ── Search & Sort Control Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search VIP assets by title, model, or keyword..."
            className="w-full pl-10 pr-8 py-2 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilter}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 text-primary" />
            Filters
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline whitespace-nowrap">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-white appearance-none cursor-pointer focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1C1C1E] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VIPDealsHeader;

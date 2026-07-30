"use client";

import React, { useState, useMemo } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";

interface DualRangeState {
  min: number;
  max: number;
}

interface FilterSidebarProps {
  sortBy: string;
  setSortBy: (val: string) => void;

  category: string;
  setCategory: (val: string) => void;

  brands: string[];
  setBrands: (val: string[]) => void;

  priceRange: DualRangeState;
  setPriceRange: (val: DualRangeState) => void;
  yearRange: DualRangeState;
  setYearRange: (val: DualRangeState) => void;

  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const FALLBACK_BRANDS = [
  "Bugatti",
  "Ferrari",
  "Lamborghini",
  "Porsche",
  "McLaren",
  "Rolls-Royce",
  "Bentley",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "NEWEST" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Most Viewed", value: "VIEWS" },
];

interface DualSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: DualRangeState;
  onChange: (val: DualRangeState) => void;
  formatValue?: (val: number) => string;
}

const DualRangeSlider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: DualSliderProps) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value.max);
    onChange({ ...value, min: newMin });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value.min);
    onChange({ ...value, max: newMax });
  };

  const leftPercent = Math.max(
    0,
    Math.min(100, ((value.min - min) / (max - min)) * 100),
  );
  const rightPercent = Math.max(
    0,
    Math.min(100, ((value.max - min) / (max - min)) * 100),
  );

  return (
    <div className="mb-6">
      <div className="text-white/80 text-sm mb-3 font-light">
        {label}: {formatValue ? formatValue(value.min) : value.min} -{" "}
        {formatValue ? formatValue(value.max) : value.max}
      </div>

      <div className="relative h-6 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-1 bg-white/10 rounded-full" />

        {/* Active Track */}
        <div
          className="absolute h-1 bg-primary rounded-full"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />

        {/* Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer z-10"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer z-20"
        />
      </div>
    </div>
  );
};

export default function FilterSidebar({
  sortBy,
  setSortBy,
  category,
  setCategory,
  brands,
  setBrands,
  priceRange,
  setPriceRange,
  yearRange,
  setYearRange,
  isOpen,
  onClose,
  onClear,
}: FilterSidebarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Dynamic Categories and Brands from React Query hooks
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: brandsResponse } = useGetBrandsQuery({ limit: 100 });

  const categoriesList = useMemo(() => {
    const items = categoriesResponse?.data;
    if (items && items.length > 0) {
      return ["All", ...items.map((c) => c.name)];
    }
    return [
      "All",
      "Supercars",
      "Automotive",
      "Real Estate",
      "Yachts",
      "Aviation",
    ];
  }, [categoriesResponse]);

  const brandsList = useMemo(() => {
    const items = brandsResponse?.data;
    if (items && items.length > 0) {
      return Array.from(new Set(items.map((b) => b.name)));
    }
    return FALLBACK_BRANDS;
  }, [brandsResponse]);

  const toggleBrand = (brandName: string) => {
    setBrands(
      brands.includes(brandName)
        ? brands.filter((b) => b !== brandName)
        : [...brands, brandName],
    );
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || sortBy;

  const content = (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif text-white tracking-wide">
            Filters
          </h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="relative">
        <h3 className="text-white text-sm mb-3 font-medium">Sort By</h3>
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full flex items-center justify-between bg-white/5 border border-primary/30 rounded-md py-3 px-4 text-white/80 text-sm hover:border-primary/50 transition-colors"
        >
          {currentSortLabel}
          <ChevronDown className="w-4 h-4 text-white/50" />
        </button>
        {isSortOpen && (
          <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-md shadow-2xl py-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6 space-y-3">
        <h3 className="text-white text-sm font-medium mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categoriesList.map((catItem) => {
            const isSelected =
              (catItem === "All" &&
                (!category || category === "ALL" || category === "All")) ||
              category === catItem;
            return (
              <button
                key={catItem}
                onClick={() => setCategory(catItem === "All" ? "ALL" : catItem)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-black font-semibold shadow-md shadow-primary/20"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {catItem}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <DualRangeSlider
        label="Price Range"
        min={0}
        max={20000000}
        step={50000}
        value={priceRange}
        onChange={setPriceRange}
        formatValue={(val) =>
          val >= 1000000
            ? `$${(val / 1000000).toFixed(1)}M`
            : `$${(val / 1000).toFixed(0)}k`
        }
      />

      {/* Brands List */}
      <div className="mb-6 space-y-3">
        <h3 className="text-white text-sm font-medium mb-3">Brand</h3>
        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {brandsList.map((bName) => (
            <label
              key={bName}
              className="flex items-center gap-3 cursor-pointer group py-0.5"
              onClick={() => toggleBrand(bName)}
            >
              <div
                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                  brands.includes(bName)
                    ? "bg-primary border-primary"
                    : "border-white/20 group-hover:border-primary/50"
                }`}
              >
                {brands.includes(bName) && (
                  <div className="w-2 h-2 bg-black rounded-sm" />
                )}
              </div>
              <span className="text-white/70 text-sm font-light group-hover:text-white transition-colors">
                {bName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Year Range Slider */}
      <DualRangeSlider
        label="Build Year"
        min={1990}
        max={2026}
        step={1}
        value={yearRange}
        onChange={setYearRange}
      />

      {/* Reset Button */}
      <div className="pt-4">
        <button
          onClick={onClear}
          className="w-full py-2.5 text-center text-[#00E5FF] text-sm hover:text-[#00E5FF]/80 transition-colors tracking-wide border border-[#00E5FF]/30 rounded-lg hover:border-[#00E5FF]/60"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-75 shrink-0 bg-[#111111] border border-white/3 rounded-xl py-8 px-6 sticky top-28 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-200 lg:hidden transition-all duration-500 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 bg-[#111111] p-8 overflow-y-auto transition-transform duration-500 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </div>
      </div>
    </>
  );
}

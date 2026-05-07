"use client";

import React, { useState } from "react";
import { Eye, MapPin, ChevronDown, RotateCcw, Filter, X } from "lucide-react";
import Link from "next/link";
import AnimationWrapper from "../../components/AnimationWrapper";

/* ─── Data (unchanged) ─── */
const categories = ["All", "Car", "Yacht", "Jet", "Real Estate", "Watch"];

interface Asset {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  category: string;
  type?: string;
  model?: string;
  year?: number;
  priceValue: number;
}

const assets: Asset[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    title: "Ferrari 488 Spider",
    location: "Monaco",
    price: "$295,000",
    category: "Car",
    type: "Sport",
    model: "Ferrari",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Volvo",
    year: 2021,
    priceValue: 295000,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Luxury",
    model: "Rolex",
    year: 2023,
    priceValue: 295000,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2020,
    priceValue: 295000,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Sport",
    model: "Rolex",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    title: "Gulfstream G650ER",
    location: "Monaco",
    price: "$295,000",
    category: "Jet",
    type: "Private Jet",
    model: "Gulfstream",
    year: 2019,
    priceValue: 295000,
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    title: "Ferrari 488 Spider",
    location: "Monaco",
    price: "$295,000",
    category: "Car",
    type: "Convertible",
    model: "Ferrari",
    year: 2023,
    priceValue: 295000,
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Casual",
    model: "Rolex",
    year: 2024,
    priceValue: 295000,
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2021,
    priceValue: 295000,
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Luxury",
    model: "Rolex",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    title: "Gulfstream G650ER",
    location: "Monaco",
    price: "$295,000",
    category: "Jet",
    type: "Private Jet",
    model: "Gulfstream",
    year: 2023,
    priceValue: 295000,
  },
];

/* ─── Page Component ─── */
export default function VIPDeals() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    type: "All",
    model: "All",
    yearFrom: "2005",
    yearTo: "2024",
    priceMin: 12000,
    priceMax: 500000
  });

  // Draft filters (for sidebar inputs)
  const [draftFilters, setDraftFilters] = useState({ ...appliedFilters });

  const minLimit = 0;
  const maxLimit = 500000;

  const handleReset = () => {
    setActiveCategory("All");
    const resetValues = {
      type: "All",
      model: "All",
      yearFrom: "2005",
      yearTo: "2024",
      priceMin: 12000,
      priceMax: 500000
    };
    setDraftFilters(resetValues);
    setAppliedFilters(resetValues);
  };

  const handleApply = () => {
    setAppliedFilters({ ...draftFilters });
    setIsFilterOpen(false); // close drawer on mobile after apply
  };

  const filteredAssets = assets.filter((asset) => {
    const categoryMatch = activeCategory === "All" || asset.category === activeCategory;
    const typeMatch = appliedFilters.type === "All" || asset.type === appliedFilters.type;
    const modelMatch = appliedFilters.model === "All" || asset.model === appliedFilters.model;
    const yearMatch = (asset.year || 0) >= parseInt(appliedFilters.yearFrom) && (asset.year || 0) <= parseInt(appliedFilters.yearTo);
    const priceMatch = asset.priceValue >= appliedFilters.priceMin && asset.priceValue <= appliedFilters.priceMax;

    return categoryMatch && typeMatch && modelMatch && yearMatch && priceMatch;
  });

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 lg:mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-clash font-medium tracking-wide">
                 VIP Deals
            </h2>
            <p className="text-white text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
             Exclusive off-market listings available only to VIP members
            </p>
          </div>
        </AnimationWrapper>

        {/* Category Tabs - hidden on mobile, scrollable on small, normal on lg+ */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1} >
          <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap
                    ${activeCategory === cat
                      ? "bg-[#E78F23] text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimationWrapper>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#18181A] border border-[#2C2C2E] rounded-full text-white text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* ── Body: Filter Sidebar + Grid ── */}
      <div className="flex gap-8">
        {/* Desktop Sidebar (always visible on lg+) */}
        <aside className="hidden lg:block w-75 shrink-0">
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            draftFilters={draftFilters}
            setDraftFilters={setDraftFilters}
            handleReset={handleReset}
            handleApply={handleApply}
            minLimit={minLimit}
            maxLimit={maxLimit}
          />
        </aside>

        {/* Mobile Filter Drawer (overlay) */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-[320px] bg-[#1C1C1E] shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6">
                <FilterSidebar
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  draftFilters={draftFilters}
                  setDraftFilters={setDraftFilters}
                  handleReset={handleReset}
                  handleApply={handleApply}
                  minLimit={minLimit}
                  maxLimit={maxLimit}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAssets.map((asset, index) => (
              <AnimationWrapper key={asset.id} type="fade-up" duration={0.5} delay={0.05 * (index % 3)}>
                <Link href={`/buyer/vip-deals/${asset.id}`}>
                  <MarketplaceCard asset={asset} />
                </Link>
              </AnimationWrapper>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <AnimationWrapper type="zoom" duration={0.4}>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-500">
                <p className="text-base sm:text-lg font-medium">No assets found</p>
                <p className="text-xs sm:text-sm mt-1">Try adjusting your filters or category.</p>
              </div>
            </AnimationWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Sidebar Component (reused for desktop & mobile) ─── */
interface FilterSidebarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  draftFilters: any;
  setDraftFilters: React.Dispatch<React.SetStateAction<any>>;
  handleReset: () => void;
  handleApply: () => void;
  minLimit: number;
  maxLimit: number;
}

function FilterSidebar({
  activeCategory,
  setActiveCategory,
  draftFilters,
  setDraftFilters,
  handleReset,
  handleApply,
  minLimit,
  maxLimit,
}: FilterSidebarProps) {
  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">Filter Listing</h3>
        <button
          onClick={handleReset}
          className="text-[#E78F23] text-xs sm:text-sm font-medium hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="h-px bg-[#2C2C2E] w-full mb-5 sm:mb-6" />

      {/* Category */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Category</label>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 sm:px-4 py-2 rounded-lg text-sm transition-all ${activeCategory === cat
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
        onChange={(val) => setDraftFilters((prev: any) => ({ ...prev, type: val }))}
        options={["All", "Sport", "Yacht", "Luxury", "Private Jet", "Convertible", "Casual"]}
      />

      {/* Model */}
      <FilterSelect
        label="Model"
        value={draftFilters.model}
        onChange={(val) => setDraftFilters((prev: any) => ({ ...prev, model: val }))}
        options={["All", "Ferrari", "Volvo", "Rolex", "Azimut", "Gulfstream"]}
      />

      {/* Build Year */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Build Year</label>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={draftFilters.yearFrom}
            onChange={(e) => setDraftFilters((prev: any) => ({ ...prev, yearFrom: e.target.value }))}
            className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
            placeholder="2005"
          />
          <span className="text-gray-500 text-sm">to</span>
          <input
            type="text"
            value={draftFilters.yearTo}
            onChange={(e) => setDraftFilters((prev: any) => ({ ...prev, yearTo: e.target.value }))}
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
              setDraftFilters((prev: any) => ({
                ...prev,
                priceMin: Math.min(Number(e.target.value), draftFilters.priceMax - 1000),
              }))
            }
            className="absolute w-full -top-2 h-5 appearance-none bg-transparent pointer-events-none 
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
              setDraftFilters((prev: any) => ({
                ...prev,
                priceMax: Math.max(Number(e.target.value), draftFilters.priceMin + 1000),
              }))
            }
            className="absolute w-full -top-2 h-5 appearance-none bg-transparent pointer-events-none 
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
        className="w-full py-3.5 sm:py-4 bg-[#E78F23] hover:bg-[#D47D17] text-black font-bold rounded-xl transition-all active:scale-[0.98]"
      >
        Apply
      </button>
    </div>
  );
}

/* ─── FilterSelect Component (unchanged but slightly responsive) ─── */
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

/* ─── MarketplaceCard (unchanged, already responsive) ─── */
function MarketplaceCard({ asset }: { asset: Asset }) {
  return (
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden group hover:border-[#E78F23]/20 transition-all shadow-xl hover:shadow-[#E78F23]/5">
      <div className="relative h-45 sm:h-50 lg:h-54.25 overflow-hidden bg-black">
        <img
          src={asset.image}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />
      </div>

      <div className="p-4 sm:p-5 relative mt-4 sm:mt-6">
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 mb-2 font-medium">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {asset.location}
          </span>
          <span className="tracking-widest uppercase text-gray-500">Price</span>
        </div>
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h4 className="font-semibold font-inter text-sm sm:text-[15px] truncate pr-3 text-white">
            {asset.title}
          </h4>
          <span className="font-bold font-inter text-base sm:text-[17px] text-white whitespace-nowrap">
            {asset.price}
          </span>
        </div>

        <button className="w-full py-2 sm:py-2.5 cursor-pointer bg-[#D98728] hover:bg-[#E6983A] text-white text-xs sm:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
          View Details <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
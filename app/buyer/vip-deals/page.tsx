"use client";

import React, { useState } from "react";
import { Eye, MapPin, ChevronDown, Filter, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useVipListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useDebounce } from "@/hooks/useDebounce";
import { ListingItem, GetListingsParams } from "@/lib/api/listings";

/* ─── Page Component ─── */
export default function VIPDeals() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [buildYear, setBuildYear] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000000);
  const [search, setSearch] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  // Range limit constants
  const minLimit = 0;
  const maxLimit = 100000000;

  // Debounced input values to prevent API request spamming on every slider move / keystroke
  const debouncedSearch = useDebounce(search, 400);
  const debouncedBuildYear = useDebounce(buildYear, 400);
  const debouncedPriceMin = useDebounce(priceMin, 400);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  // Fetch Categories from API using useGetCategoriesQuery
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = React.useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      const names = categoriesResponse.data.map((cat) => cat.name);
      return ["All", ...Array.from(new Set(names))];
    }
    return ["All"];
  }, [categoriesResponse]);

  // Fetch Brands from API using useGetBrandsQuery
  const { data: brandsResponse } = useGetBrandsQuery({ limit: 100 });
  const brandsList = React.useMemo(() => {
    if (brandsResponse?.data && brandsResponse.data.length > 0) {
      const names = brandsResponse.data.map((b) => b.name);
      return ["All", ...Array.from(new Set(names))];
    }
    return ["All"];
  }, [brandsResponse]);

  // Construct query params for API request
  const queryParams: GetListingsParams = {
    page: currentPage,
    limit,
    category: activeCategory !== "All" && activeCategory !== "ALL" ? activeCategory : undefined,
    brand: selectedBrand !== "All" && selectedBrand !== "ALL" ? selectedBrand : undefined,
    buildYear: debouncedBuildYear ? Number(debouncedBuildYear) : undefined,
    minPrice: debouncedPriceMin > minLimit ? debouncedPriceMin : undefined,
    maxPrice: debouncedPriceMax < maxLimit ? debouncedPriceMax : undefined,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
  };

  // Fetch VIP Listings from API
  const { data: listingsResponse, isLoading, isFetching, isError } = useVipListingsQuery(queryParams);

  const assets = listingsResponse?.data || [];
  const meta = listingsResponse?.meta;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleBuildYearChange = (year: string) => {
    setBuildYear(year);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePriceMinChange = (val: number) => {
    setPriceMin(val);
    setCurrentPage(1);
  };

  const handlePriceMaxChange = (val: number) => {
    setPriceMax(val);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setActiveCategory("All");
    setSelectedBrand("All");
    setBuildYear("");
    setPriceMin(minLimit);
    setPriceMax(maxLimit);
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 lg:mb-10">
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

        {/* Category Tabs - hidden on mobile, scrollable on small, normal on lg+ */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer
                    ${activeCategory === cat
                      ? "bg-[#E78F23] text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)] font-semibold"
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
            className="flex items-center gap-2 px-4 py-2.5 bg-[#18181A] border border-[#2C2C2E] rounded-full text-white text-sm font-medium cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#E78F23]" />
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
            setActiveCategory={handleCategoryChange}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleBrandChange}
            buildYear={buildYear}
            setBuildYear={handleBuildYearChange}
            search={search}
            setSearch={handleSearchChange}
            priceMin={priceMin}
            setPriceMin={handlePriceMinChange}
            priceMax={priceMax}
            setPriceMax={handlePriceMaxChange}
            handleReset={handleReset}
            minLimit={minLimit}
            maxLimit={maxLimit}
            categoriesList={categoriesList}
            brandsList={brandsList}
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
              <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6">
                <FilterSidebar
                  activeCategory={activeCategory}
                  setActiveCategory={handleCategoryChange}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={handleBrandChange}
                  buildYear={buildYear}
                  setBuildYear={handleBuildYearChange}
                  search={search}
                  setSearch={handleSearchChange}
                  priceMin={priceMin}
                  setPriceMin={handlePriceMinChange}
                  priceMax={priceMax}
                  setPriceMax={handlePriceMaxChange}
                  handleReset={handleReset}
                  minLimit={minLimit}
                  maxLimit={maxLimit}
                  categoriesList={categoriesList}
                  brandsList={brandsList}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Skeleton Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : isError ? (
            <AnimationWrapper type="zoom" duration={0.4}>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-400 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl">
                <p className="text-base sm:text-lg font-medium text-red-400">Failed to load VIP deals</p>
                <p className="text-xs sm:text-sm mt-1 text-gray-400">Please try refreshing or check back later.</p>
              </div>
            </AnimationWrapper>
          ) : assets.length === 0 ? (
            <AnimationWrapper type="zoom" duration={0.4}>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-500 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl">
                <p className="text-base sm:text-lg font-medium text-white">No VIP assets found</p>
                <p className="text-xs sm:text-sm mt-1 text-gray-400">Try adjusting your category or sidebar filters.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-[#E78F23] hover:bg-[#D47D17] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </AnimationWrapper>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {assets.map((asset, index) => (
                  <AnimationWrapper key={asset.id} type="fade-up" duration={0.5} delay={0.05 * (index % 3)}>
                    <Link href={`/buyer/vip-deals/${asset.slug || asset.id}`}>
                      <MarketplaceCard asset={asset} />
                    </Link>
                  </AnimationWrapper>
                ))}
              </div>

              {/* Pagination Section */}
              {meta && meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-4 sm:px-6">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Page <span className="font-semibold text-white">{meta.page}</span> of{" "}
                    <span className="font-semibold text-white">{meta.totalPages}</span> ({meta.total} total deals)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={meta.page <= 1 || isFetching}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-[#18181A] border border-[#2C2C2E] rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2C2C2E] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: meta.totalPages }, (_, idx) => idx + 1)
                        .filter((p) => Math.abs(p - meta.page) <= 1 || p === 1 || p === meta.totalPages)
                        .map((p, i, arr) => (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <span className="text-gray-500 text-xs px-1">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(p)}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${meta.page === p
                                ? "bg-[#E78F23] text-black shadow-md"
                                : "bg-[#18181A] text-gray-400 border border-[#2C2C2E] hover:text-white"
                                }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>
                    <button
                      disabled={meta.page >= meta.totalPages || isFetching}
                      onClick={() => setCurrentPage((prev) => Math.min(meta.totalPages, prev + 1))}
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-[#E78F23] text-black font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D47D17] transition-colors cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Card Component ─── */
function SkeletonCard() {
  return (
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden animate-pulse flex flex-col justify-between h-full min-h-[340px]">
      <div>
        <div className="h-45 sm:h-50 lg:h-54 bg-[#2C2C2E]/60 w-full" />
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-[#2C2C2E] rounded w-1/3" />
            <div className="h-3 bg-[#2C2C2E] rounded w-1/4" />
          </div>
          <div className="flex justify-between items-center pt-1">
            <div className="h-5 bg-[#2C2C2E] rounded w-1/2" />
            <div className="h-5 bg-[#2C2C2E] rounded w-1/3" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 pt-0">
        <div className="h-10 bg-[#2C2C2E]/80 rounded-xl w-full" />
      </div>
    </div>
  );
}

/* ─── Filter Sidebar Component ─── */
interface FilterSidebarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  buildYear: string;
  setBuildYear: (year: string) => void;
  search: string;
  setSearch: (query: string) => void;
  priceMin: number;
  setPriceMin: (min: number) => void;
  priceMax: number;
  setPriceMax: (max: number) => void;
  handleReset: () => void;
  minLimit: number;
  maxLimit: number;
  categoriesList: string[];
  brandsList: string[];
}

function FilterSidebar({
  activeCategory,
  setActiveCategory,
  selectedBrand,
  setSelectedBrand,
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
}: FilterSidebarProps) {
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

      {/* Search Input */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Search VIP Deals</label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Category */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Category</label>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 sm:px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${activeCategory === cat
                ? "bg-[#2C2C2E] text-[#E78F23] font-semibold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <FilterSelect
        label="Brand"
        value={selectedBrand}
        onChange={(val) => setSelectedBrand(val)}
        options={brandsList}
      />

      {/* Build Year */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">Build Year</label>
        <input
          type="number"
          value={buildYear}
          onChange={(e) => setBuildYear(e.target.value)}
          className="w-full bg-transparent border border-[#E78F23]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
          placeholder="e.g. 2024"
        />
      </div>

      <div className="h-px bg-[#2C2C2E] w-full mb-5 sm:mb-6" />

      {/* Price Range */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-300 mb-5 sm:mb-6">Price Range</label>
        <div className="relative h-1 bg-[#2C2C2E] rounded-full mb-5 sm:mb-6">
          <div
            className="absolute h-full bg-[#E78F23]"
            style={{
              left: `${((priceMin - minLimit) / (maxLimit - minLimit)) * 100}%`,
              right: `${100 - ((priceMax - minLimit) / (maxLimit - minLimit)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={10000}
            value={priceMin}
            onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 10000))}
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
            step={10000}
            value={priceMax}
            onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 10000))}
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
        <div className="flex justify-between text-xs sm:text-sm text-white font-medium">
          <span>${priceMin.toLocaleString()}</span>
          <span>${priceMax.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── FilterSelect Component ─── */
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

/* ─── MarketplaceCard Component ─── */
function MarketplaceCard({ asset }: { asset: ListingItem }) {
  const image = asset.media?.[0]?.url || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
  const location = [asset.locationCity, asset.locationCountry].filter(Boolean).join(", ") || "N/A";
  const formattedPrice = asset.askingPrice
    ? `$${Number(asset.askingPrice).toLocaleString()}`
    : "Price on Request";

  return (
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden group hover:border-[#E78F23]/20 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col justify-between h-full">
      <div>
        <div className="relative h-45 sm:h-50 lg:h-54 overflow-hidden bg-black">
          <img
            src={image}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          />
          {asset.isFeatured && (
            <span className="absolute top-2.5 right-2.5 bg-[#E78F23] text-black font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
              VIP Featured
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 relative mt-2">
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1 sm:gap-1.5 truncate pr-2">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#E78F23]" /> {location}
            </span>
            <span className="tracking-widest uppercase text-gray-500 shrink-0">Asking Price</span>
          </div>
          <div className="flex justify-between items-center mb-4 sm:mb-5 gap-2">
            <h4 className="font-semibold font-inter text-sm sm:text-[15px] truncate text-white" title={asset.title}>
              {asset.title}
            </h4>
            <span className="font-bold font-inter text-base sm:text-[17px] text-[#E78F23] whitespace-nowrap">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <button className="w-full py-2 sm:py-2.5 cursor-pointer bg-[#D98728] hover:bg-[#E6983A] text-white text-xs sm:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
          View Details <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
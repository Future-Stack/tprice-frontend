"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  MapPin,
  ChevronDown,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useVipListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useDebounce } from "@/hooks/useDebounce";
import { ListingItem, GetListingsParams } from "@/lib/api/listings";

const SORT_OPTIONS = [
  { label: "Newest Listed", value: "NEWEST" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Most Viewed", value: "VIEWS" },
];

/* ─── Page Component ─── */
export default function VIPDeals() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(100000000);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  // Range limit constants
  const minLimit = 0;
  const maxLimit = 100000000;

  // Debounced input values to prevent API request spamming on every slider move / keystroke
  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(locationCity, 400);
  const debouncedCountry = useDebounce(locationCountry, 400);
  const debouncedBuildYear = useDebounce(buildYear, 400);
  const debouncedPriceMin = useDebounce(priceMin, 400);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  // Fetch Categories from API using useGetCategoriesQuery
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      const names = categoriesResponse.data.map((cat) => cat.name);
      return ["All", ...Array.from(new Set(names))];
    }
    return ["All"];
  }, [categoriesResponse]);

  // Fetch Brands from API using useGetBrandsQuery
  const { data: brandsResponse } = useGetBrandsQuery({ limit: 100 });
  const brandsList = useMemo(() => {
    if (brandsResponse?.data && brandsResponse.data.length > 0) {
      const names = brandsResponse.data.map((b) => b.name);
      return ["All", ...Array.from(new Set(names))];
    }
    return ["All"];
  }, [brandsResponse]);

  // Reset pagination page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    selectedBrand,
    debouncedCity,
    debouncedCountry,
    debouncedBuildYear,
    debouncedPriceMin,
    debouncedPriceMax,
    debouncedSearch,
    sortBy,
  ]);

  // Construct query params for API request
  const queryParams: GetListingsParams = {
    page: currentPage,
    limit,
    category:
      activeCategory !== "All" && activeCategory !== "ALL"
        ? activeCategory
        : undefined,
    brand:
      selectedBrand !== "All" && selectedBrand !== "ALL"
        ? selectedBrand
        : undefined,
    locationCity: debouncedCity.trim() || undefined,
    locationCountry: debouncedCountry.trim() || undefined,
    buildYear: debouncedBuildYear ? Number(debouncedBuildYear) : undefined,
    minPrice: debouncedPriceMin > minLimit ? debouncedPriceMin : undefined,
    maxPrice: debouncedPriceMax < maxLimit ? debouncedPriceMax : undefined,
    search: debouncedSearch.trim() || undefined,
    sortBy: sortBy,
  };

  // Fetch VIP Listings from API
  const {
    data: listingsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useVipListingsQuery(queryParams);

  const assets = listingsResponse?.data || [];
  const meta = listingsResponse?.meta;

  const handleReset = () => {
    setActiveCategory("All");
    setSelectedBrand("All");
    setLocationCity("");
    setLocationCountry("");
    setBuildYear("");
    setPriceMin(minLimit);
    setPriceMax(maxLimit);
    setSearch("");
    setSortBy("NEWEST");
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      {/* ── Page Header ── */}
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
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer
                    ${
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search VIP assets by title, model, or keyword..."
            className="w-full pl-10 pr-8 py-2 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
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
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-white appearance-none cursor-pointer focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#1C1C1E] text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: Filter Sidebar + Grid ── */}
      <div className="flex gap-8">
        {/* Desktop Sidebar (always visible on lg+) */}
        <aside className="hidden lg:block w-75 shrink-0">
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            locationCity={locationCity}
            setLocationCity={setLocationCity}
            locationCountry={locationCountry}
            setLocationCountry={setLocationCountry}
            buildYear={buildYear}
            setBuildYear={setBuildYear}
            search={search}
            setSearch={setSearch}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-[340px] bg-[#1C1C1E] shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-white">Filter VIP Deals</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <FilterSidebar
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  locationCity={locationCity}
                  setLocationCity={setLocationCity}
                  locationCountry={locationCountry}
                  setLocationCountry={setLocationCountry}
                  buildYear={buildYear}
                  setBuildYear={setBuildYear}
                  search={search}
                  setSearch={setSearch}
                  priceMin={priceMin}
                  setPriceMin={setPriceMin}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
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
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-400 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
                <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
                <p className="text-base sm:text-lg font-medium text-red-400">
                  Failed to load VIP deals
                </p>
                <p className="text-xs sm:text-sm mt-1 text-gray-400 max-w-sm">
                  Please try refreshing or adjusting your search filters.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </AnimationWrapper>
          ) : assets.length === 0 ? (
            <AnimationWrapper type="zoom" duration={0.4}>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-500 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
                <div className="w-14 h-14 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-3">
                  <Search className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-base sm:text-lg font-medium text-white">
                  No VIP assets found
                </p>
                <p className="text-xs sm:text-sm mt-1 text-gray-400 max-w-sm">
                  We couldn&apos;t find any VIP deals matching your active criteria.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            </AnimationWrapper>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {assets.map((asset, index) => (
                  <AnimationWrapper
                    key={asset.id}
                    type="fade-up"
                    duration={0.5}
                    delay={0.05 * (index % 3)}
                  >
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
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {assets.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {meta.total}
                    </span>{" "}
                    VIP deals
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage <= 1 || isFetching}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-[#18181A] border border-[#2C2C2E] rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2C2C2E] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: meta.totalPages },
                        (_, idx) => idx + 1,
                      )
                        .filter(
                          (p) =>
                            Math.abs(p - meta.page) <= 1 ||
                            p === 1 ||
                            p === meta.totalPages,
                        )
                        .map((p, i, arr) => (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <span className="text-gray-500 text-xs px-1">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setCurrentPage(p)}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                meta.page === p
                                  ? "bg-primary text-black shadow-md"
                                  : "bg-[#18181A] text-gray-400 border border-[#2C2C2E] hover:text-white"
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>
                    <button
                      disabled={currentPage >= meta.totalPages || isFetching}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(meta.totalPages, prev + 1),
                        )
                      }
                      className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary transition-colors cursor-pointer"
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
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden animate-pulse flex flex-col justify-between h-full min-h-85">
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
  locationCity: string;
  setLocationCity: (city: string) => void;
  locationCountry: string;
  setLocationCountry: (country: string) => void;
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
}: FilterSidebarProps) {
  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Filter Listings
        </h3>
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
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Price Range ($)
        </label>

        {/* Numeric Min / Max Inputs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">
              Min Price
            </span>
            <input
              type="number"
              value={priceMin || ""}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">
              Max Price
            </span>
            <input
              type="number"
              value={priceMax >= maxLimit ? "" : priceMax}
              onChange={(e) =>
                setPriceMax(e.target.value ? Number(e.target.value) : maxLimit)
              }
              placeholder="Max"
              className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Dual Range Slider */}
        <div className="relative h-1.5 bg-[#2C2C2E] rounded-full mb-3">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${Math.min(100, Math.max(0, (priceMin / maxLimit) * 100))}%`,
              right: `${Math.min(100, Math.max(0, 100 - (Math.min(priceMax, maxLimit) / maxLimit) * 100))}%`,
            }}
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={10000}
            value={priceMin}
            onChange={(e) =>
              setPriceMin(Math.min(Number(e.target.value), priceMax - 10000))
            }
            className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none z-10
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 
              [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={10000}
            value={priceMax}
            onChange={(e) =>
              setPriceMax(Math.max(Number(e.target.value), priceMin + 10000))
            }
            className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none z-20
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 
              [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
              [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 font-medium">
          <span>${priceMin.toLocaleString()}</span>
          <span>
            {priceMax >= maxLimit ? "Any Max" : `$${priceMax.toLocaleString()}`}
          </span>
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

/* ─── MarketplaceCard Component ─── */
function MarketplaceCard({ asset }: { asset: ListingItem }) {
  const image =
    asset.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
  const location =
    [asset.locationCity, asset.locationCountry].filter(Boolean).join(", ") ||
    "N/A";
  const formattedPrice = asset.askingPrice
    ? `${asset.currency || "$"}${Number(asset.askingPrice).toLocaleString()}`
    : "Price on Request";

  return (
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden group hover:border-primary/40 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col justify-between h-full">
      <div>
        <div className="relative h-45 sm:h-50 lg:h-54 overflow-hidden bg-black">
          <img
            src={image}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          />
          {asset.isFeatured && (
            <span className="absolute top-2.5 right-2.5 bg-primary text-black font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
              VIP Featured
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 relative mt-2">
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1 sm:gap-1.5 truncate pr-2">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-primary" />{" "}
              {location}
            </span>
            <span className="tracking-widest uppercase text-gray-500 shrink-0">
              Asking Price
            </span>
          </div>
          <div className="flex justify-between items-center mb-4 sm:mb-5 gap-2">
            <h4
              className="font-semibold font-inter text-sm sm:text-[15px] truncate text-white group-hover:text-primary transition-colors"
              title={asset.title}
            >
              {asset.title}
            </h4>
            <span className="font-bold font-inter text-base sm:text-[17px] text-primary whitespace-nowrap">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <button className="w-full py-2 sm:py-2.5 cursor-pointer bg-primary hover:bg-primary text-white text-xs sm:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
          View Details <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  MapPin,
  ChevronDown,
  RotateCcw,
  Filter,
  X,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { ListingItem } from "@/lib/api/listings";

const SORT_OPTIONS = [
  { label: "Newest Listed", value: "NEWEST" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Most Viewed", value: "VIEWS" },
];

export default function MarketplacePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch dynamic categories using React Query
  const { data: categoriesResponse } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    const fetchedCats = categoriesResponse?.data;
    if (fetchedCats && fetchedCats.length > 0) {
      return [
        { label: "All", value: "ALL" },
        ...fetchedCats.map((cat) => ({
          label: cat.name,
          value: cat.name,
        })),
      ];
    }
    return [
      { label: "All", value: "ALL" },
      { label: "Supercar", value: "SUPERCAR" },
      { label: "Yacht", value: "YACHT" },
      { label: "Jet", value: "JET" },
      { label: "Real Estate", value: "REAL_ESTATE" },
      { label: "Watch", value: "WATCH" },
    ];
  }, [categoriesResponse]);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState("NEWEST");
  const [page, setPage] = useState(1);
  const limit = 9;

  // Debounced inputs for smooth real-time onChange requests without spamming
  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(locationCity, 400);
  const debouncedCountry = useDebounce(locationCountry, 400);
  const debouncedBuildYear = useDebounce(buildYear, 400);
  const debouncedPriceMin = useDebounce(priceMin, 400);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  // Fetch listings using React Query
  const { data, isLoading, isError, error, refetch, isFetching } =
    useListingsQuery({
      category: activeCategory,
      search: debouncedSearch || undefined,
      locationCity: debouncedCity || undefined,
      locationCountry: debouncedCountry || undefined,
      buildYear: debouncedBuildYear ? Number(debouncedBuildYear) : undefined,
      minPrice: debouncedPriceMin > 0 ? debouncedPriceMin : undefined,
      maxPrice: debouncedPriceMax < 100000000 ? debouncedPriceMax : undefined,
      sortBy: sortBy,
      page: page,
      limit: limit,
    });

  const listings = data?.data || [];
  const meta = data?.meta;

  const handleResetFilters = () => {
    setActiveCategory("ALL");
    setSearch("");
    setLocationCity("");
    setLocationCountry("");
    setBuildYear("");
    setPriceMin(0);
    setPriceMax(100000000);
    setSortBy("NEWEST");
    setPage(1);
  };

  const handleCategoryChange = (catValue: string) => {
    setActiveCategory(catValue);
    setPage(1);
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-0">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-2xl sm:text-4xl font-clash font-medium tracking-wide text-white">
              Exclusive Collection
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
              Discover the world&apos;s finest luxury assets available for
              acquisition.
            </p>
          </div>
        </AnimationWrapper>

        {/* Category Tabs */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat.value
                      ? "bg-primary text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, make, or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Filter className="w-4 h-4" />
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
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
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

      {/* ── Main Layout: Sidebar + Card Grid ── */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
              setPage(1);
            }}
            locationCity={locationCity}
            setLocationCity={(val) => {
              setLocationCity(val);
              setPage(1);
            }}
            locationCountry={locationCountry}
            setLocationCountry={(val) => {
              setLocationCountry(val);
              setPage(1);
            }}
            buildYear={buildYear}
            setBuildYear={(val) => {
              setBuildYear(val);
              setPage(1);
            }}
            priceMin={priceMin}
            setPriceMin={(val) => {
              setPriceMin(val);
              setPage(1);
            }}
            priceMax={priceMax}
            setPriceMax={(val) => {
              setPriceMax(val);
              setPage(1);
            }}
            handleResetFilters={handleResetFilters}
          />
        </aside>

        {/* Mobile Drawer Overlay */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-[340px] bg-[#1C1C1E] shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-[#1C1C1E] p-4 border-b border-[#2C2C2E] flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-white">
                  Filter Listings
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <FilterSidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={(cat) => {
                    setActiveCategory(cat);
                    setPage(1);
                  }}
                  locationCity={locationCity}
                  setLocationCity={(val) => {
                    setLocationCity(val);
                    setPage(1);
                  }}
                  locationCountry={locationCountry}
                  setLocationCountry={(val) => {
                    setLocationCountry(val);
                    setPage(1);
                  }}
                  buildYear={buildYear}
                  setBuildYear={(val) => {
                    setBuildYear(val);
                    setPage(1);
                  }}
                  priceMin={priceMin}
                  setPriceMin={(val) => {
                    setPriceMin(val);
                    setPage(1);
                  }}
                  priceMax={priceMax}
                  setPriceMax={(val) => {
                    setPriceMax(val);
                    setPage(1);
                  }}
                  handleResetFilters={handleResetFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Error State */}
          {isError && (
            <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Failed to load listings
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {(error as any)?.response?.data?.message ||
                  error?.message ||
                  "An unexpected error occurred while fetching listings."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <ListingsSkeleton />
          ) : listings.length > 0 ? (
            <>
              {/* Listings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {listings.map((item, index) => (
                  <AnimationWrapper
                    key={item.id}
                    type="fade-up"
                    duration={0.4}
                    delay={0.04 * (index % 3)}
                  >
                    <Link href={`/buyer/marketplace/${item.slug || item.id}`}>
                      <MarketplaceCard asset={item} />
                    </Link>
                  </AnimationWrapper>
                ))}
              </div>

              {/* Pagination Controls */}
              {meta && meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-[#2C2C2E]">
                  <p className="text-xs text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {listings.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {meta.total}
                    </span>{" "}
                    listings
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page <= 1 || isFetching}
                      className="p-2 rounded-lg bg-[#1C1C1E] border border-[#2C2C2E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#E78F23] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg text-xs font-semibold text-white">
                      Page {page} of {meta.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, meta.totalPages))
                      }
                      disabled={page >= meta.totalPages || isFetching}
                      className="p-2 rounded-lg bg-[#1C1C1E] border border-[#2C2C2E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#E78F23] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            !isError && (
              <AnimationWrapper type="zoom" duration={0.4}>
                <div className="flex flex-col items-center justify-center py-20 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    No listings found
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    We couldn&apos;t find any assets matching your active filter
                    criteria. Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </button>
                </div>
              </AnimationWrapper>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Sidebar Component ─── */
interface FilterSidebarProps {
  categories: { label: string; value: string }[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  locationCity: string;
  setLocationCity: (val: string) => void;
  locationCountry: string;
  setLocationCountry: (val: string) => void;
  buildYear: string;
  setBuildYear: (val: string) => void;
  priceMin: number;
  setPriceMin: (val: number) => void;
  priceMax: number;
  setPriceMax: (val: number) => void;
  handleResetFilters: () => void;
}

function FilterSidebar({
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
}: FilterSidebarProps) {
  const minLimit = 0;
  const maxLimit = 10000000;

  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Filter Listings
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-primary text-xs sm:text-sm font-medium hover:underline flex items-center gap-1"
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
              className={`text-left px-3.5 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat.value
                  ? "bg-[#E78F23]/15 text-primary font-semibold "
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
              value={priceMax >= 100000000 ? "" : priceMax}
              onChange={(e) =>
                setPriceMax(e.target.value ? Number(e.target.value) : 100000000)
              }
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
          <span>
            {priceMax >= 100000000
              ? "Any Max"
              : `$${priceMax.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Loading Component ─── */
function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-[#1C1C1E] rounded-xl border border-[#2C2C2E] overflow-hidden animate-pulse flex flex-col"
        >
          <div className="h-48 sm:h-52 bg-[#2C2C2E]" />
          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3 bg-[#2C2C2E] rounded-full" />
                <div className="w-12 h-3 bg-[#2C2C2E] rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-[#2C2C2E] rounded-md" />
              <div className="w-1/2 h-6 bg-[#2C2C2E] rounded-md" />
            </div>
            <div className="w-full h-10 bg-[#2C2C2E] rounded-xl pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── MarketplaceCard Component ─── */
function MarketplaceCard({ asset }: { asset: ListingItem }) {
  const imageUrl = asset.media?.[0]?.url;

  const formattedPrice = asset.askingPrice
    ? `${asset.currency || "$"}${Number(asset.askingPrice).toLocaleString()}`
    : "Price on Request";

  const locationText =
    [asset.locationCity, asset.locationCountry].filter(Boolean).join(", ") ||
    "Worldwide";

  return (
    <div className="bg-[#1C1C1E] rounded-xl border border-[#2C2C2E] overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-[#E78F23]/5 flex flex-col h-full">
      {/* Media Container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
        <img
          src={imageUrl}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {asset.category && (
            <span className="bg-black/70 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-primary/30">
              {asset.category}
            </span>
          )}
          {asset.buildYear && (
            <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
              {asset.buildYear}
            </span>
          )}
        </div>

        {asset.isFeatured && (
          <div className="absolute top-3 right-3 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
            FEATURED
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[11px] text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1 truncate pr-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{locationText}</span>
            </span>
            {asset.owner?.isVerified && (
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Verified Seller
              </span>
            )}
          </div>

          <h4 className="font-semibold text-white text-base sm:text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {asset.title}
          </h4>

          <div className="text-lg sm:text-xl font-bold font-clash text-primary mb-4">
            {formattedPrice}
          </div>
        </div>

        <button className="w-full py-2.5 cursor-pointer bg-primary hover:bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
          View Details <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Search as SearchIcon,
} from "lucide-react";
import MarketplaceHero from "./components/MarketplaceHero";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "./components/ProductCard";
import { useListingsQuery } from "@/hooks/useListings";
import { useDebounce } from "@/hooks/useDebounce";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [brands, setBrands] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Best Match");

  // Filter sliders state
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
  const [yearRange, setYearRange] = useState({ min: 1990, max: 2026 });
  const [mileageRange, setMileageRange] = useState({ min: 0, max: 100000 });

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 9;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounced filter parameters to avoid unnecessary rapid API requests
  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(priceRange.min, 400);
  const debouncedMaxPrice = useDebounce(priceRange.max, 400);
  const debouncedMinYear = useDebounce(yearRange.min, 400);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [
    category,
    brands,
    conditions,
    sortBy,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedMinYear,
  ]);

  // Convert UI sortBy selection to backend sort string
  const getSortByParam = (sort: string) => {
    if (sort === "Price: Low to High") return "PRICE_ASC";
    if (sort === "Price: High to Low") return "PRICE_DESC";
    if (sort === "Newest Arrivals") return "NEWEST";
    return undefined;
  };

  // React Query hook to fetch listings from GET /api/v1/listings
  const { data, isLoading, isFetching, isError, error, refetch } =
    useListingsQuery({
      category: category !== "ALL" ? category : undefined,
      brand: brands.length > 0 ? brands[0] : undefined,
      minPrice: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
      maxPrice: debouncedMaxPrice < 20000000 ? debouncedMaxPrice : undefined,
      buildYear: debouncedMinYear > 1990 ? debouncedMinYear : undefined,
      search: debouncedSearch.trim() || undefined,
      sortBy: getSortByParam(sortBy),
      page: page,
      limit: limit,
    });

  const listings = data?.data || [];
  const meta = data?.meta;

  useEffect(() => {
    document.body.classList.add("scrollbar-hide");
    return () => {
      document.body.classList.remove("scrollbar-hide");
    };
  }, []);

  const handleClearFilters = () => {
    setCategory("ALL");
    setBrands([]);
    setConditions([]);
    setSearch("");
    setSortBy("Best Match");
    setPriceRange({ min: 0, max: 20000000 });
    setYearRange({ min: 1990, max: 2026 });
    setMileageRange({ min: 0, max: 100000 });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="bg-black min-h-screen">
      <MarketplaceHero />

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:flex gap-16">
          {/* Sidebar */}
          <FilterSidebar
            sortBy={sortBy}
            setSortBy={setSortBy}
            category={category}
            setCategory={setCategory}
            brands={brands}
            setBrands={setBrands}
            conditions={conditions}
            setConditions={setConditions}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            yearRange={yearRange}
            setYearRange={setYearRange}
            mileageRange={mileageRange}
            setMileageRange={setMileageRange}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            onClear={handleClearFilters}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <SearchBar
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            {/* Error Banner */}
            {isError && (
              <div className="bg-[#1C1212] border border-red-500/30 rounded-xl p-8 mb-8 text-center">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-serif text-white mb-1">
                  Failed to load marketplace listings
                </h3>
                <p className="text-sm text-white/50 mb-6">
                  {(error as any)?.response?.data?.message ||
                    error?.message ||
                    "An unexpected error occurred while fetching listings."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black font-semibold text-xs rounded-md transition-all shadow-lg shadow-primary/20"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Grid Container */}
            {isLoading ? (
              <MarketplaceSkeletonGrid />
            ) : listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-8 lg:gap-10">
                  <AnimatePresence mode="popLayout">
                    {listings.map((item) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-8 border-t border-white/5">
                    <p className="text-xs text-white/40 font-light">
                      Showing{" "}
                      <span className="font-semibold text-white">
                        {listings.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-white">
                        {meta.total}
                      </span>{" "}
                      luxury assets
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(Math.max(page - 1, 1))}
                        disabled={page <= 1 || isFetching}
                        className="p-2.5 rounded-md bg-[#111111] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <span className="px-4 py-2 bg-[#111111] border border-white/10 rounded-md text-xs font-medium text-white/90">
                        Page {page} of {meta.totalPages}
                      </span>

                      <button
                        onClick={() =>
                          handlePageChange(Math.min(page + 1, meta.totalPages))
                        }
                        disabled={page >= meta.totalPages || isFetching}
                        className="p-2.5 rounded-md bg-[#111111] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
                        title="Next Page"
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 text-center bg-[#0A0A0A] border border-white/5 rounded-xl px-6"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <SearchIcon className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2">
                    No matching luxury assets found
                  </h3>
                  <p className="text-white/40 text-sm font-light max-w-md mx-auto mb-6">
                    We couldn&apos;t find any assets matching your current
                    search and filter criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-black font-semibold text-xs rounded-md transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                  </button>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Skeleton Loading Grid Component ── */
function MarketplaceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-8 lg:gap-10">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-[#0A0A0A] border border-white/3 rounded-sm overflow-hidden flex flex-col h-120 animate-pulse"
        >
          <div className="h-56 bg-white/5 relative" />
          <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-5 bg-white/10 rounded w-3/4" />
              <div className="h-6 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-4 bg-white/5 rounded" />
              <div className="h-4 bg-white/5 rounded" />
              <div className="h-4 bg-white/5 rounded" />
              <div className="h-4 bg-white/5 rounded" />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

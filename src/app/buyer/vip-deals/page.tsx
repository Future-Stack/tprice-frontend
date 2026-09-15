"use client";

import React, { useState, useMemo } from "react";
import { useVipListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useDebounce } from "@/hooks/useDebounce";
import { GetListingsParams } from "@/lib/api/listings";
import {
  VIPDealsHeader,
  VIPDealsFilterDrawer,
  VIPDealsGrid,
  VIPDealsPagination,
  VIPDealsFilterProps,
  MIN_PRICE_LIMIT,
  MAX_PRICE_LIMIT,
} from "./_components";

export default function VIPDealsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(MAX_PRICE_LIMIT);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(locationCity, 400);
  const debouncedCountry = useDebounce(locationCountry, 400);
  const debouncedBuildYear = useDebounce(buildYear, 400);
  const debouncedPriceMin = useDebounce(priceMin, 400);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = useMemo(() => {
    const names = categoriesResponse?.data?.map((cat) => cat.name) || [];
    return ["All", ...Array.from(new Set(names))];
  }, [categoriesResponse]);

  const { data: brandsResponse } = useGetBrandsQuery({ limit: 100 });
  const brandsList = useMemo(() => {
    const names = brandsResponse?.data?.map((b) => b.name) || [];
    return ["All", ...Array.from(new Set(names))];
  }, [brandsResponse]);

  // Reset pagination to page 1 whenever filters change
  const filterKey = `${activeCategory}|${selectedBrand}|${debouncedCity}|${debouncedCountry}|${debouncedBuildYear}|${debouncedPriceMin}|${debouncedPriceMax}|${debouncedSearch}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const queryParams: GetListingsParams = {
    page: currentPage,
    limit,
    category: activeCategory !== "All" && activeCategory !== "ALL" ? activeCategory : undefined,
    brand: selectedBrand !== "All" && selectedBrand !== "ALL" ? selectedBrand : undefined,
    locationCity: debouncedCity.trim() || undefined,
    locationCountry: debouncedCountry.trim() || undefined,
    buildYear: debouncedBuildYear ? Number(debouncedBuildYear) : undefined,
    minPrice: debouncedPriceMin > MIN_PRICE_LIMIT ? debouncedPriceMin : undefined,
    maxPrice: debouncedPriceMax < MAX_PRICE_LIMIT ? debouncedPriceMax : undefined,
    search: debouncedSearch.trim() || undefined,
    sortBy,
  };

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
    setPriceMin(MIN_PRICE_LIMIT);
    setPriceMax(MAX_PRICE_LIMIT);
    setSearch("");
    setSortBy("NEWEST");
    setCurrentPage(1);
  };

  const filterProps: VIPDealsFilterProps = {
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
    minLimit: MIN_PRICE_LIMIT,
    maxLimit: MAX_PRICE_LIMIT,
    categoriesList,
    brandsList,
    isMobileDrawerOpen: isFilterOpen,
    onCloseMobileDrawer: () => setIsFilterOpen(false),
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      <VIPDealsHeader
        categoriesList={categoriesList}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
        onOpenMobileFilter={() => setIsFilterOpen(true)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="flex gap-8">
        <VIPDealsFilterDrawer {...filterProps} />

        <div className="flex-1 min-w-0">
          <VIPDealsGrid
            assets={assets}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onResetFilters={handleReset}
          />
          {meta && (
            <VIPDealsPagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              currentCount={assets.length}
              isFetching={isFetching}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MarketplaceHeader,
  MarketplaceFilterDrawer,
  MarketplaceGrid,
  MarketplacePagination,
  MarketplaceFilterProps,
  DEFAULT_CATEGORIES,
} from "./_components";

export default function MarketplacePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = useMemo(() => {
    const fetchedCats = categoriesResponse?.data;
    if (fetchedCats && fetchedCats.length > 0) {
      return [
        { label: "All", value: "ALL" },
        ...fetchedCats.map((cat) => ({ label: cat.name, value: cat.name })),
      ];
    }
    return DEFAULT_CATEGORIES;
  }, [categoriesResponse]);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(locationCity, 400);
  const debouncedCountry = useDebounce(locationCountry, 400);
  const debouncedBuildYear = useDebounce(buildYear, 400);
  const debouncedPriceMin = useDebounce(priceMin, 400);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  const { data, isLoading, isError, error, refetch, isFetching } = useListingsQuery({
    category: activeCategory,
    search: debouncedSearch || undefined,
    locationCity: debouncedCity || undefined,
    locationCountry: debouncedCountry || undefined,
    buildYear: debouncedBuildYear ? Number(debouncedBuildYear) : undefined,
    minPrice: debouncedPriceMin > 0 ? debouncedPriceMin : undefined,
    maxPrice: debouncedPriceMax < 100000000 ? debouncedPriceMax : undefined,
    sortBy,
    page,
    limit,
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

  const filterProps: MarketplaceFilterProps = {
    categories,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    locationCity,
    setLocationCity: (val) => {
      setLocationCity(val);
      setPage(1);
    },
    locationCountry,
    setLocationCountry: (val) => {
      setLocationCountry(val);
      setPage(1);
    },
    buildYear,
    setBuildYear: (val) => {
      setBuildYear(val);
      setPage(1);
    },
    priceMin,
    setPriceMin: (val) => {
      setPriceMin(val);
      setPage(1);
    },
    priceMax,
    setPriceMax: (val) => {
      setPriceMax(val);
      setPage(1);
    },
    handleResetFilters,
    isMobileDrawerOpen: isFilterOpen,
    onCloseMobileDrawer: () => setIsFilterOpen(false),
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-0">
      <MarketplaceHeader
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onOpenMobileFilter={() => setIsFilterOpen(true)}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
      />

      <div className="flex gap-8">
        <MarketplaceFilterDrawer {...filterProps} />

        <div className="flex-1 min-w-0">
          <MarketplaceGrid
            listings={listings}
            isLoading={isLoading}
            isError={isError}
            errorMessage={
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              error?.message
            }
            onRetry={() => refetch()}
            onResetFilters={handleResetFilters}
          />

          {meta && (
            <MarketplacePagination
              page={page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              currentCount={listings.length}
              isFetching={isFetching}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

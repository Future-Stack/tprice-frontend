"use client";

import React, { useState } from "react";
import {
  DEALER_CATEGORIES,
  DEFAULT_FILTER_STATE,
  DEALER_MARKETPLACE_ASSETS,
  FilterState,
  MIN_PRICE_LIMIT,
  MAX_PRICE_LIMIT,
  DealerMarketplaceHeader,
  DealerMarketplaceFilterDrawer,
  DealerMarketplaceGrid,
} from "./_components";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // Draft filters (for sidebar inputs)
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const handleReset = () => {
    setActiveCategory("All");
    setDraftFilters(DEFAULT_FILTER_STATE);
    setAppliedFilters(DEFAULT_FILTER_STATE);
  };

  const handleApply = () => {
    setAppliedFilters({ ...draftFilters });
    setIsFilterOpen(false);
  };

  const filteredAssets = DEALER_MARKETPLACE_ASSETS.filter((asset) => {
    const categoryMatch = activeCategory === "All" || asset.category === activeCategory;
    const typeMatch = appliedFilters.type === "All" || asset.type === appliedFilters.type;
    const modelMatch = appliedFilters.model === "All" || asset.model === appliedFilters.model;
    const yearMatch =
      (asset.year || 0) >= parseInt(appliedFilters.yearFrom, 10) &&
      (asset.year || 0) <= parseInt(appliedFilters.yearTo, 10);
    const priceMatch =
      asset.priceValue >= appliedFilters.priceMin && asset.priceValue <= appliedFilters.priceMax;

    return categoryMatch && typeMatch && modelMatch && yearMatch && priceMatch;
  });

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8">
      <DealerMarketplaceHeader
        categories={DEALER_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenMobileFilter={() => setIsFilterOpen(true)}
      />

      <div className="flex gap-8">
        <DealerMarketplaceFilterDrawer
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          handleReset={handleReset}
          handleApply={handleApply}
          minLimit={MIN_PRICE_LIMIT}
          maxLimit={MAX_PRICE_LIMIT}
          isMobileDrawerOpen={isFilterOpen}
          onCloseMobileDrawer={() => setIsFilterOpen(false)}
        />

        <DealerMarketplaceGrid assets={filteredAssets} />
      </div>
    </div>
  );
}

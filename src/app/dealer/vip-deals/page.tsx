"use client";

import React, { useState } from "react";
import {
  DEALER_VIP_CATEGORIES,
  DEFAULT_VIP_FILTER_STATE,
  DEALER_VIP_ASSETS,
  FilterState,
  MIN_PRICE_LIMIT,
  MAX_PRICE_LIMIT,
  DealerVIPHeader,
  DealerVIPFilterDrawer,
  DealerVIPGrid,
} from "./_components";

export default function VIPDeals() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_VIP_FILTER_STATE);

  // Draft filters (for sidebar inputs)
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_VIP_FILTER_STATE);

  const handleReset = () => {
    setActiveCategory("All");
    setDraftFilters(DEFAULT_VIP_FILTER_STATE);
    setAppliedFilters(DEFAULT_VIP_FILTER_STATE);
  };

  const handleApply = () => {
    setAppliedFilters({ ...draftFilters });
    setIsFilterOpen(false);
  };

  const filteredAssets = DEALER_VIP_ASSETS.filter((asset) => {
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
      <DealerVIPHeader
        categories={DEALER_VIP_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenMobileFilter={() => setIsFilterOpen(true)}
      />

      <div className="flex gap-8">
        <DealerVIPFilterDrawer
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

        <DealerVIPGrid assets={filteredAssets} />
      </div>
    </div>
  );
}

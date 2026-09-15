import React from "react";
import { AlertTriangle, Search, RotateCcw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { MarketplaceGridProps } from "./types";
import { MarketplaceCard } from "./MarketplaceCard";
import { MarketplaceSkeleton } from "./MarketplaceSkeleton";

export function MarketplaceGrid({
  listings,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onResetFilters,
}: MarketplaceGridProps) {
  if (isError) {
    return (
      <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">Failed to load listings</h3>
        <p className="text-sm text-gray-400 mb-4">
          {errorMessage || "An unexpected error occurred while fetching listings."}
        </p>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <MarketplaceSkeleton />;
  }

  if (listings.length === 0) {
    return (
      <AnimationWrapper type="zoom" duration={0.4}>
        <div className="flex flex-col items-center justify-center py-20 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">No listings found</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            We couldn&apos;t find any assets matching your active filter criteria. Try adjusting
            your filters or search term.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </AnimationWrapper>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {listings.map((item, index) => (
        <AnimationWrapper key={item.id} type="fade-up" duration={0.4} delay={0.04 * (index % 3)}>
          <MarketplaceCard asset={item} />
        </AnimationWrapper>
      ))}
    </div>
  );
}

export default MarketplaceGrid;

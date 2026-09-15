import React from "react";
import { AlertTriangle, Search, RotateCcw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPDealsGridProps } from "./types";
import { VIPDealCard } from "./VIPDealCard";
import { VIPDealSkeleton } from "./VIPDealSkeleton";

export function VIPDealsGrid({
  assets,
  isLoading,
  isError,
  onRetry,
  onResetFilters,
}: VIPDealsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <VIPDealSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <AnimationWrapper type="zoom" duration={0.4}>
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-400 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-base sm:text-lg font-medium text-red-400">Failed to load VIP deals</p>
          <p className="text-xs sm:text-sm mt-1 text-gray-400 max-w-sm">
            Please try refreshing or adjusting your search filters.
          </p>
          <button
            onClick={onRetry}
            className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </AnimationWrapper>
    );
  }

  if (assets.length === 0) {
    return (
      <AnimationWrapper type="zoom" duration={0.4}>
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-500 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl text-center px-4">
          <div className="w-14 h-14 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-3">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-medium text-white">No VIP assets found</p>
          <p className="text-xs sm:text-sm mt-1 text-gray-400 max-w-sm">
            We couldn&apos;t find any VIP deals matching your active criteria.
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
      {assets.map((asset, index) => (
        <AnimationWrapper key={asset.id} type="fade-up" duration={0.5} delay={0.05 * (index % 3)}>
          <VIPDealCard asset={asset} />
        </AnimationWrapper>
      ))}
    </div>
  );
}

export default VIPDealsGrid;

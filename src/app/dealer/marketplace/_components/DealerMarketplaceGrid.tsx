import React from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { DealerAssetCard } from "./DealerAssetCard";
import { DealerMarketplaceGridProps } from "./types";

export function DealerMarketplaceGrid({ assets }: DealerMarketplaceGridProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {assets.map((asset, index) => (
          <AnimationWrapper key={asset.id} type="fade-up" duration={0.5} delay={0.05 * (index % 3)}>
            <DealerAssetCard asset={asset} />
          </AnimationWrapper>
        ))}
      </div>

      {assets.length === 0 && (
        <AnimationWrapper type="zoom" duration={0.4}>
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-500">
            <p className="text-base sm:text-lg font-medium">No assets found</p>
            <p className="text-xs sm:text-sm mt-1">Try adjusting your filters or category.</p>
          </div>
        </AnimationWrapper>
      )}
    </div>
  );
}

export default DealerMarketplaceGrid;

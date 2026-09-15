import React from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import ProductSpecsGrid from "../../components/details/ProductSpecsGrid";
import { getDisplaySpecs } from "./types";
import type { InventoryOverviewSectionProps } from "./types";

export function InventoryOverviewSection({ item }: InventoryOverviewSectionProps) {
  const displaySpecs = getDisplaySpecs(item.specifications);

  const fallbackDescription = `${item.buildYear ? `${item.buildYear} ` : ""}${item.title} — An exceptional masterpiece of engineering and craftsmanship, meticulously maintained and available for immediate acquisition.`;

  return (
    <>
      {/* Description */}
      <AnimationWrapper type="fade-up" delay={0.2}>
        <div className="bg-[#101216] border border-white/5 p-8 rounded-sm space-y-4">
          <h3 className="text-[24px] font-cormorant font-medium text-white border-b border-white/5 pb-4">
            Description
          </h3>
          <p className="text-white/70 font-normal font-montserrat text-sm md:text-base">
            {item.description || fallbackDescription}
          </p>
        </div>
      </AnimationWrapper>

      {/* Specifications */}
      <AnimationWrapper type="fade-up" delay={0.3}>
        <div className="bg-[#101216] border border-white/5 p-8 rounded-sm space-y-6">
          <h3 className="text-[24px] font-cormorant text-white border-b border-white/5 pb-4">
            Specifications
          </h3>
          <ProductSpecsGrid specs={displaySpecs} />
        </div>
      </AnimationWrapper>
    </>
  );
}

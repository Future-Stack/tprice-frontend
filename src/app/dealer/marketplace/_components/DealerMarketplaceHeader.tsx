import React from "react";
import { Filter } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { DealerMarketplaceHeaderProps } from "./types";

export function DealerMarketplaceHeader({
  categories,
  activeCategory,
  onSelectCategory,
  onOpenMobileFilter,
}: DealerMarketplaceHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 lg:mb-10">
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div>
          <h2 className="text-2xl sm:text-[40px] font-clash font-medium tracking-wide">
            Exclusive Collection
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
            Discover the world&apos;s finest assets available for acquisition.
          </p>
        </div>
      </AnimationWrapper>

      {/* Category Tabs */}
      <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
        <div className="overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex items-center gap-1.5 bg-[#18181A] border border-[#2C2C2E] rounded-full p-1.5 w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#E78F23] text-white shadow-[0_2px_12px_rgba(231,143,35,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </AnimationWrapper>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={onOpenMobileFilter}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#18181A] border border-[#2C2C2E] rounded-full text-white text-sm font-medium cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>
    </div>
  );
}

export default DealerMarketplaceHeader;

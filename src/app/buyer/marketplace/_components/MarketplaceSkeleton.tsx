import React from "react";

export function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-[#1C1C1E] rounded-xl border border-[#2C2C2E] overflow-hidden animate-pulse flex flex-col"
        >
          <div className="h-48 sm:h-52 bg-[#2C2C2E]" />
          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3 bg-[#2C2C2E] rounded-full" />
                <div className="w-12 h-3 bg-[#2C2C2E] rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-[#2C2C2E] rounded-md" />
              <div className="w-1/2 h-6 bg-[#2C2C2E] rounded-md" />
            </div>
            <div className="w-full h-10 bg-[#2C2C2E] rounded-xl pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarketplaceSkeleton;

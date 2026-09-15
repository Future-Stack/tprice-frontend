import React from "react";

export function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Left Gallery Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="w-full h-102.25 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl" />
        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="w-25 h-18 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl shrink-0"
            />
          ))}
        </div>
        <div className="mt-10 space-y-3">
          <div className="w-32 h-6 bg-[#1C1C1E] rounded-md" />
          <div className="w-full h-4 bg-[#1C1C1E] rounded" />
          <div className="w-5/6 h-4 bg-[#1C1C1E] rounded" />
          <div className="w-3/4 h-4 bg-[#1C1C1E] rounded" />
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <div className="max-w-95 w-full shrink-0 space-y-6">
        <div className="space-y-3">
          <div className="w-24 h-5 bg-[#1C1C1E] rounded-md" />
          <div className="w-full h-8 bg-[#1C1C1E] rounded-md" />
          <div className="w-36 h-4 bg-[#1C1C1E] rounded" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="w-28 h-3 bg-[#1C1C1E] rounded" />
          <div className="w-48 h-9 bg-[#1C1C1E] rounded-md" />
        </div>

        <div className="flex gap-3">
          <div className="w-full h-12 bg-[#1C1C1E] rounded-xl" />
          <div className="w-full h-12 bg-[#1C1C1E] rounded-xl" />
        </div>

        <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-[#161618] space-y-4">
          <div className="w-36 h-5 bg-[#2C2C2E] rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
          </div>
        </div>

        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#2C2C2E] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-32 h-4 bg-[#2C2C2E] rounded" />
            <div className="w-24 h-3 bg-[#2C2C2E] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

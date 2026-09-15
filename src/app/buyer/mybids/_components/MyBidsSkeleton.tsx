import React from "react";

export function MyBidsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse">
      {/* Left side table skeleton */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Table header skeleton */}
        <div className="hidden sm:grid grid-cols-[1fr_repeat(3,100px)_150px] gap-4 px-4 mb-2">
          <div className="h-3 bg-[#252528] rounded w-16" />
          <div className="h-3 bg-[#252528] rounded w-16" />
          <div className="h-3 bg-[#252528] rounded w-20" />
          <div className="h-3 bg-[#252528] rounded w-14" />
          <div />
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_repeat(3,100px)_150px] items-center gap-4 p-4 rounded-xl border border-[#2C2C2E] bg-[#161618]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg bg-[#252528] shrink-0" />
              <div className="h-4 bg-[#252528] rounded w-36 sm:w-48" />
            </div>
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="flex justify-end">
              <div className="h-8 bg-[#252528] rounded-lg w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Right side detail panel skeleton */}
      <div className="w-full lg:w-95 shrink-0">
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-3 bg-[#252528] rounded w-16" />
            <div className="h-7 bg-[#252528] rounded w-3/4" />
            <div className="h-3 bg-[#252528] rounded w-1/3" />
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 space-y-4">
            <div className="flex justify-between">
              <div className="h-3 bg-[#252528] rounded w-24" />
              <div className="h-4 bg-[#252528] rounded-full w-8" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <div className="h-3 bg-[#252528] rounded w-20" />
                <div className="h-3 bg-[#252528] rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-[#252528] rounded w-24" />
                <div className="h-3 bg-[#252528] rounded w-14" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
              <div className="h-3 bg-[#252528] rounded w-24" />
              <div className="h-8 bg-[#252528] rounded w-32" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111111] rounded-xl p-3.5 border border-white/5 space-y-2"
              >
                <div className="h-2.5 bg-[#252528] rounded w-16" />
                <div className="h-4 bg-[#252528] rounded w-20" />
              </div>
            ))}
          </div>

          <div className="h-12 bg-[#252528] rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default MyBidsSkeleton;

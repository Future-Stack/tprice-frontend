import React from "react";

export function VIPDetailsSkeleton() {
  return (
    <div className="mx-auto relative z-0 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="h-10 w-72 bg-white/10 rounded-lg mb-2" />
          <div className="h-6 w-96 max-w-full bg-white/5 rounded-md" />
        </div>
      </div>

      {/* Back link Skeleton */}
      <div className="h-5 w-36 bg-white/5 rounded-md mb-6" />

      {/* Product Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — Gallery Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="w-full h-102.25 rounded-2xl bg-white/10 border border-white/5" />
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="w-25 h-18 rounded-xl bg-white/10 border border-white/5" />
            <div className="w-25 h-18 rounded-xl bg-white/5 border border-white/5" />
            <div className="w-25 h-18 rounded-xl bg-white/5 border border-white/5" />
          </div>

          <div className="mt-10 space-y-3">
            <div className="h-7 w-32 bg-white/10 rounded-md" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </div>
        </div>

        {/* Right — Details Sidebar Skeleton */}
        <div className="max-w-95 w-full shrink-0 space-y-5">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-[#E78F23]/10 rounded-md border border-[#E78F23]/20" />
            <div className="h-9 w-4/5 bg-white/10 rounded-lg" />
            <div className="h-5 w-1/2 bg-white/5 rounded" />
          </div>

          <div className="pt-2 space-y-2">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-9 w-48 bg-[#E78F23]/20 rounded-lg" />
          </div>

          <div className="flex gap-3">
            <div className="h-14 flex-1 bg-[#E78F23]/30 rounded-xl" />
            <div className="h-14 flex-1 bg-white/10 rounded-xl" />
          </div>

          <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2 space-y-5">
            <div className="h-5 w-36 bg-white/10 rounded-md" />
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-5 w-24 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-white/5 rounded" />
                <div className="h-5 w-16 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/10 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-[#3C3C3E]" />
              <div className="space-y-2">
                <div className="h-4 w-28 bg-white/10 rounded" />
                <div className="h-3 w-24 bg-green-500/20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VIPDetailsSkeleton;

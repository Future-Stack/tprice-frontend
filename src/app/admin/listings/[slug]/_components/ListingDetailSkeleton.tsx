import React from "react";

export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen text-white font-sans animate-in fade-in duration-300">
      <div>
        {/* Title Bar Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-[#1F1F1F] rounded-lg animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-[#1F1F1F] rounded-lg animate-pulse" />
            <div className="h-8 w-16 bg-[#1F1F1F] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Top Header Card Skeleton */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 w-full md:w-2/3">
            <div className="h-7 w-64 md:w-80 bg-[#1F1F1F] rounded-lg animate-pulse" />
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-8 w-32 bg-[#1F1F1F] rounded-lg animate-pulse" />
              <div className="h-8 w-40 bg-[#1F1F1F] rounded-full animate-pulse" />
              <div className="h-5 w-36 bg-[#1F1F1F] rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right w-full md:w-auto">
            <div className="h-8 w-36 bg-[#1F1F1F] rounded-lg animate-pulse" />
            <div className="h-4 w-28 bg-[#1F1F1F] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#262626] bg-[#141414] h-100 md:h-125 animate-pulse" />
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-[#262626] bg-[#141414] h-24 md:h-32 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Specifications Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#141414] border border-[#262626] p-4 rounded-xl space-y-2 h-20 animate-pulse"
                  >
                    <div className="h-3 w-16 bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-6 w-24 bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl flex flex-col justify-center space-y-3 h-full min-h-25 animate-pulse">
                <div className="h-3 w-20 bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-6 w-32 bg-[#1F1F1F] rounded animate-pulse" />
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-24 bg-[#1F1F1F] rounded animate-pulse" />
              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl space-y-3">
                <div className="h-4 w-full bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[#1F1F1F] rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[#1F1F1F] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Dealer Info Skeleton */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6">
              <div className="h-6 w-44 bg-[#1F1F1F] rounded mx-auto animate-pulse" />
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1F1F1F] shrink-0 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-4 w-32 bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1F1F1F] shrink-0 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-4 w-40 bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-[#1F1F1F] rounded-xl animate-pulse" />
                <div className="h-20 bg-[#1F1F1F] rounded-xl animate-pulse" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="h-12 bg-[#1F1F1F] rounded-xl animate-pulse" />
                <div className="h-12 bg-[#1F1F1F] rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Meta Info Skeleton */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-4">
              <div className="h-3 w-28 bg-[#1F1F1F] rounded animate-pulse" />
              <div className="h-4 w-48 bg-[#1F1F1F] rounded animate-pulse" />
              <div className="h-10 bg-[#1F1F1F] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

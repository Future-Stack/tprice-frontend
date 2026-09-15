import React from "react";

export function OfferDetailSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Navigation Skeleton */}
      <div className="h-5 bg-white/10 rounded-md w-48" />

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-2xl bg-[#111113] border border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 bg-white/10 rounded-lg w-64" />
            <div className="h-7 bg-white/10 rounded-md w-28" />
          </div>
          <div className="h-4 bg-white/5 rounded-md w-48" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-11 bg-white/10 rounded-xl w-32" />
          <div className="h-11 bg-white/10 rounded-xl w-32" />
        </div>
      </div>

      {/* Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#111113] border border-white/5 space-y-3">
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
            <div className="h-8 bg-white/10 rounded-lg w-3/4" />
            <div className="h-3 bg-white/5 rounded-md w-2/3" />
          </div>
        ))}
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
            <div className="h-6 bg-white/10 rounded-md w-1/3" />
            <div className="h-7 bg-white/10 rounded-md w-3/4" />
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
          </div>

          <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-6">
            <div className="h-6 bg-white/10 rounded-md w-1/3" />
            <div className="space-y-4 pt-2">
              {[1, 2].map((j) => (
                <div key={j} className="p-5 rounded-xl bg-white/2 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-white/10 rounded-md w-36" />
                    <div className="h-5 bg-white/10 rounded-md w-24" />
                  </div>
                  <div className="h-6 bg-white/10 rounded-md w-28" />
                  <div className="h-4 bg-white/5 rounded-md w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
            <div className="h-6 bg-white/10 rounded-md w-1/2" />
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-white/10 rounded-md w-3/4" />
                <div className="h-3 bg-white/5 rounded-md w-1/2" />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
            <div className="h-6 bg-white/10 rounded-md w-1/2" />
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-white/5 rounded-md w-full" />
              <div className="h-4 bg-white/5 rounded-md w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

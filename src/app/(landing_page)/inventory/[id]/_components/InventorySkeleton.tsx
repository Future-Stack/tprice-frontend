import React from "react";

export function InventorySkeleton() {
  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden animate-pulse">
      {/* Back Button Bar Skeleton */}
      <div className="container mx-auto px-6 pt-6">
        <div className="w-36 h-4 bg-white/10 rounded-sm" />
      </div>

      {/* Hero Gallery Skeleton */}
      <section className="relative w-full mt-4">
        <div className="h-125 md:h-175 w-full bg-white/5 border-b border-white/5" />
        <div className="container mx-auto px-6 flex justify-center gap-4 -mt-24 relative z-30">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-30 md:min-w-40 h-20 md:h-28 rounded-sm bg-white/10 border border-white/10"
            />
          ))}
        </div>
      </section>

      {/* Main Grid Skeleton */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
              <div className="flex gap-2">
                <div className="w-20 h-5 bg-white/10 rounded-sm" />
                <div className="w-20 h-5 bg-white/10 rounded-sm" />
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="h-8 w-3/4 bg-white/10 rounded-sm" />
                  <div className="h-4 w-1/3 bg-white/10 rounded-sm" />
                  <div className="h-10 w-1/2 bg-white/10 rounded-sm mt-3" />
                </div>
                <div className="h-6 w-24 bg-white/10 rounded-sm" />
              </div>
            </div>

            {/* Quick Specs Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm space-y-3 text-center"
                >
                  <div className="w-6 h-6 bg-white/10 rounded-full mx-auto" />
                  <div className="w-14 h-3 bg-white/10 rounded mx-auto" />
                  <div className="w-20 h-4 bg-white/10 rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
              <div className="h-6 w-32 bg-white/10 rounded-sm pb-4 border-b border-white/5" />
              <div className="h-4 w-full bg-white/10 rounded-sm" />
              <div className="h-4 w-5/6 bg-white/10 rounded-sm" />
              <div className="h-4 w-2/3 bg-white/10 rounded-sm" />
            </div>

            {/* Specifications Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
              <div className="h-6 w-40 bg-white/10 rounded-sm pb-4 border-b border-white/5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <div className="w-24 h-4 bg-white/10 rounded" />
                    <div className="flex-1 border-b border-dotted border-white/10" />
                    <div className="w-28 h-4 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-white/10 rounded-sm" />
                  <div className="h-3 w-20 bg-white/10 rounded-sm" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="h-4 w-36 bg-white/10 rounded-sm" />
                <div className="h-4 w-28 bg-white/10 rounded-sm" />
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="h-12 w-full bg-white/10 rounded-sm" />
                <div className="h-12 w-full bg-white/5 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

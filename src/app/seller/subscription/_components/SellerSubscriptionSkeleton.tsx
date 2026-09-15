import React from "react";

export function SellerSubscriptionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Skeleton Card 1 */}
      <div className="bg-[#18181A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between animate-pulse relative overflow-hidden">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-white/10 rounded-md" />
              <div className="h-4 w-28 bg-white/5 rounded-md" />
            </div>
            <div className="h-7 w-24 bg-white/10 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="h-10 w-28 bg-white/15 rounded-lg" />
              <div className="h-4 w-20 bg-white/10 rounded-md" />
            </div>
            <div className="h-4 w-full bg-white/5 rounded-md" />
            <div className="h-4 w-3/4 bg-white/5 rounded-md" />
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
                <div className="h-4 w-5/6 bg-white/10 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5">
          <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
        </div>
      </div>

      {/* Skeleton Card 2 */}
      <div className="bg-[#18181A] border border-primary/40 rounded-2xl p-8 flex flex-col justify-between animate-pulse relative overflow-hidden">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-primary/20 rounded-md" />
              <div className="h-4 w-32 bg-primary/10 rounded-md" />
            </div>
            <div className="h-7 w-28 bg-primary/20 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="h-10 w-32 bg-white/15 rounded-lg" />
              <div className="h-4 w-24 bg-white/10 rounded-md" />
            </div>
            <div className="h-4 w-full bg-white/5 rounded-md" />
            <div className="h-4 w-4/5 bg-white/5 rounded-md" />
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 shrink-0" />
                <div className="h-4 w-5/6 bg-white/10 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5">
          <div className="h-13 w-full bg-primary/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default SellerSubscriptionSkeleton;

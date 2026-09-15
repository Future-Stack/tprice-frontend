import React from "react";

export function BuyerOfferSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/5 p-5 md:p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-24 h-16 md:w-32 md:h-20 rounded-xl bg-white/10 shrink-0" />
        <div className="grow flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/10 rounded-md" />
            <div className="h-3 w-32 bg-white/5 rounded-md" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <div className="flex gap-8">
              <div className="text-center space-y-1">
                <div className="h-3 w-16 bg-white/5 rounded mx-auto" />
                <div className="h-6 w-24 bg-white/10 rounded mx-auto" />
              </div>
            </div>
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 bg-white/10 rounded-xl" />
              <div className="h-9 w-24 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerOfferSkeleton;

import React from "react";

export function BuyerOfferSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white font-inter animate-pulse p-6">
      <div className="w-full space-y-8">
        <div className="h-8 w-64 bg-white/10 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-8">
              <div className="md:col-span-5 space-y-6">
                <div className="h-9 w-64 bg-white/10 rounded-md" />
                <div className="bg-[#111113] rounded-2xl border border-white/5 p-4 h-20 bg-white/5" />
                <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 h-64 bg-white/5" />
                <div className="bg-white/5 rounded-xl p-4 h-16" />
              </div>

              <div className="md:col-span-6 space-y-6">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="aspect-16/10 rounded-[2rem] bg-white/10" />
                <div className="space-y-3 pt-4">
                  <div className="h-12 w-full bg-white/10 rounded-xl" />
                  <div className="h-12 w-full bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="h-8 w-40 bg-white/10 rounded-md" />
            <div className="bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 h-120 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

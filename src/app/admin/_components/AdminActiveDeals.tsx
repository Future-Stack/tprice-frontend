import React from "react";
import { formatStage } from "./helpers";
import { ActiveDealsSkeleton } from "./AdminSkeletons";
import { AdminActiveDealsProps } from "./types";

export function AdminActiveDeals({ activeDeals, isLoading }: AdminActiveDealsProps) {
  return (
    <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col">
      <h2 className="text-2xl font-clash font-medium text-white mb-10">Active Deals</h2>

      {isLoading ? (
        <ActiveDealsSkeleton />
      ) : !activeDeals || activeDeals.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-4 flex-1">No active deals found.</div>
      ) : (
        <div className="space-y-4 flex-1">
          {activeDeals.map((deal, i) => {
            const dealTitle = deal.listing?.title || "Asset Deal";
            const sellerName = deal.seller
              ? `${deal.seller.firstName} ${deal.seller.lastName}`.trim()
              : deal.buyer
                ? `${deal.buyer.firstName} ${deal.buyer.lastName}`.trim()
                : "Dealer";
            const stageFormatted = formatStage(deal.stage);
            const isNegotiation =
              stageFormatted.toLowerCase().includes("negotiat") ||
              stageFormatted.toLowerCase().includes("pending");

            return (
              <div
                key={deal.id || i}
                className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/4 hover:border-primary/20 transition-all group lg:flex-row flex-col gap-4 text-center lg:text-left"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                    {dealTitle}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{sellerName}</p>
                </div>
                <div
                  className={`shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${
                    isNegotiation
                      ? "text-primary border-primary/20 bg-primary/5"
                      : "text-[#4ADE80] border-[#4ADE80]/20 bg-[#4ADE80]/5"
                  }`}
                >
                  {stageFormatted}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminActiveDeals;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useSavedListingsQuery, useSaveListingMutation } from "@/hooks/useListings";
import { ListingItem } from "@/lib/api/listings";

export default function SavedItems() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, isError, error, refetch } = useSavedListingsQuery({
    page,
    limit,
  });

  const savedListings = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8 py-6">
      {/* ── Page Header ── */}
      <div className="mb-6 lg:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h2 className="text-2xl sm:text-4xl font-clash font-medium tracking-tight text-white">
            Saved Items
          </h2>
        </AnimationWrapper>
        {meta && meta.total > 0 && (
          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            {meta.total} {meta.total === 1 ? "item saved" : "items saved"}
          </span>
        )}
      </div>

      {/* ── Error State ── */}
      {isError && (
        <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-8 text-center my-8">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">Failed to load saved items</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
            {(error as any)?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred while fetching saved items."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-[#E78F23] hover:bg-[#d47f1b] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {isLoading ? (
        <SavedItemsSkeleton />
      ) : savedListings.length > 0 ? (
        <>
          {/* ── Saved Items Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {savedListings.map((item, index) => (
              <AnimationWrapper key={item.id} type="fade-up" duration={0.5} delay={0.05 * index}>
                <SavedItemCard item={item} />
              </AnimationWrapper>
            ))}
          </div>

          {/* ── Pagination Controls ── */}
          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-[#2C2C2E]">
              <p className="text-xs text-gray-400">
                Showing <span className="font-bold text-white">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
                <span className="font-bold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-bold text-white">{meta.total}</span> saved items
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || isFetching}
                  className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-[#E78F23]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      disabled={isFetching}
                      className={`w-9 h-9 rounded-xl border font-bold text-xs transition-all duration-300 cursor-pointer ${
                        pageNum === page
                          ? "bg-[#E78F23] text-black border-[#E78F23] shadow-[0_0_15px_rgba(231,143,35,0.4)]"
                          : "bg-[#121212] border-[#2D2D2D] text-gray-400 hover:text-white hover:border-[#E78F23]/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                  disabled={page >= meta.totalPages || isFetching}
                  className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-[#E78F23]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ── Empty State ── */
        !isError && (
          <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-12 text-center my-8">
            <div className="w-16 h-16 bg-[#2C2C2E]/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E78F23]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-clash font-medium text-white mb-2">No Saved Items Yet</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              You haven't saved any listings to your favorites yet. Explore the marketplace and save items to view them here.
            </p>
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AE4B] hover:bg-[#c4a045] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg"
            >
              Browse Marketplace
            </Link>
          </div>
        )
      )}
    </div>
  );
}

function SavedItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-[#161618] rounded-xl border border-[#2C2C2E] overflow-hidden flex flex-col h-[340px] animate-pulse"
        >
          <div className="h-48 sm:h-52 bg-[#252528]" />
          <div className="p-4 sm:p-5 flex flex-col justify-between grow space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-[#252528] rounded w-3/4" />
              <div className="h-3 bg-[#252528] rounded w-1/2" />
            </div>
            <div className="flex items-end justify-between pt-2">
              <div className="space-y-1">
                <div className="h-3 bg-[#252528] rounded w-16" />
                <div className="h-5 bg-[#252528] rounded w-24" />
                <div className="h-2 bg-[#252528] rounded w-20" />
              </div>
              <div className="h-9 w-28 bg-[#252528] rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SavedItemCard({ item }: { item: ListingItem }) {
  const saveMutation = useSaveListingMutation();
  const isSaved = item.isSaved ?? true;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveMutation.mutate(item.id);
  };

  const imageUrl =
    item.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";

  const isAuction = item.saleType === "AUCTION" || Boolean(item.startingBid);
  const badgeType = isAuction ? "auction" : "buy_now";
  const badgeText = isAuction ? "Auction" : "Buy Now";

  const location =
    [item.locationCity, item.locationCountry].filter(Boolean).join(", ") ||
    "Worldwide";

  const rawPrice = item.askingPrice || item.startingBid;
  const priceVal = rawPrice ? Number(rawPrice) : 0;
  const priceType = isAuction ? "Current Bid" : "Price";
  const priceDisplay = priceVal > 0 ? `$${priceVal.toLocaleString()}` : "Price on Request";

  const feesPriceDisplay =
    priceVal > 0
      ? `$${Math.round(priceVal * 1.015).toLocaleString()} incl. fees`
      : `${item.currency || "USD"}`;

  return (
    <div className="bg-[#161618] rounded-xl border border-[#2C2C2E] overflow-hidden group hover:border-[#E78F23]/40 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col h-full">
      {/* Target image aspect ratio */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-black">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {badgeType === "auction" ? (
            <span className="bg-[#3b3211] text-[#E78F23] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md">
              {badgeText}
            </span>
          ) : (
            <span className="bg-[#1a3b30] text-[#3bd87d] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md">
              {badgeText}
            </span>
          )}
          {item.category && (
            <span className="bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md border border-white/10">
              {item.category}
            </span>
          )}
        </div>

        {/* Heart Icon */}
        <button
          onClick={handleToggleSave}
          disabled={saveMutation.isPending}
          className="absolute top-3 right-3 p-1.5 sm:p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-50"
          title={isSaved ? "Remove from saved" : "Save listing"}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isSaved ? "fill-[#E78F23] text-[#E78F23]" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col grow">
        {/* Title and Location */}
        <h4 className="font-semibold font-inter text-[15px] sm:text-base text-white mb-1.5 line-clamp-1">
          {item.title}
        </h4>
        <div className="flex items-center text-[11px] sm:text-xs text-gray-400 mb-6">
          <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" /> <span className="truncate">{location}</span>
        </div>

        {/* Price and Button section at bottom */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] text-gray-500 mb-0.5">{priceType}</div>
            <div className="font-semibold text-[17px] text-white mb-1">{priceDisplay}</div>
            <div className="text-[10px] text-gray-500">{feesPriceDisplay}</div>
          </div>

          <Link
            href={`/buyer/marketplace/${item.slug || item.id}`}
            className="px-5 py-2.5 bg-[#D4AE4B] hover:bg-[#c4a045] text-white text-xs sm:text-[13px] font-semibold rounded-lg transition-transform active:scale-95 shadow-lg shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}


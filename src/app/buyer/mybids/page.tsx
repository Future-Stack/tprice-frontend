"use client";

import React, { useState } from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useOffersQuery } from "@/hooks/useOffers";
import { OfferItem } from "@/lib/api/offers";
import { toast } from "sonner";
import {
  MyBidsSkeleton,
  BidsEmptyState,
  BidsErrorState,
  BidsTableSection,
  BidsPagination,
  BidDetailPanel,
} from "./_components";

export default function MyBidsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [inclFees, setInclFees] = useState(true);

  const { data, isLoading, isError, error, refetch } = useOffersQuery({
    page,
    limit,
  });

  const bids: OfferItem[] = data?.data || [];
  const meta = data?.meta;

  const selectedBid =
    (selectedBidId && bids.find((bid) => bid.id === selectedBidId)) || bids[0] || null;

  const handleShare = () => {
    if (navigator.share && selectedBid) {
      navigator
        .share({
          title: selectedBid.listing?.title || "My Bid",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="mx-auto relative z-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-clash font-medium text-white">
              My Bids
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 font-medium">
              Manage and track your active auction participations.
            </p>
          </div>
        </AnimationWrapper>

        {meta && meta.total > 0 && (
          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            {meta.total} {meta.total === 1 ? "bid submitted" : "bids submitted"}
          </span>
        )}
      </div>

      {/* ── Error State ── */}
      {isError && (
        <BidsErrorState
          errorMessage={
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            error?.message
          }
          onRetry={() => refetch()}
        />
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <MyBidsSkeleton />
      ) : bids.length > 0 && selectedBid ? (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <BidsTableSection
              bids={bids}
              selectedBidId={selectedBidId}
              onSelectBid={setSelectedBidId}
            />

            {meta && (
              <BidsPagination
                page={page}
                limit={limit}
                total={meta.total}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>

          <BidDetailPanel
            selectedBid={selectedBid}
            inclFees={inclFees}
            onToggleInclFees={() => setInclFees(!inclFees)}
            onShare={handleShare}
          />
        </div>
      ) : (
        !isError && <BidsEmptyState />
      )}
    </div>
  );
}

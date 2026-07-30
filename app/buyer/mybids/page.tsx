"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Info,
  BadgeCheck,
  ArrowUpRight,
  Share2,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Gavel,
  DollarSign,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useOffersQuery } from "@/hooks/useOffers";
import { OfferItem } from "@/lib/api/offers";
import { toast } from "sonner";

/* ─── Helper Functions ─── */
const formatPrice = (priceStr?: string | number | null, currency = "USD") => {
  if (priceStr === undefined || priceStr === null || priceStr === "")
    return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;

  return `$${num.toLocaleString()}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status?: string) => {
  const norm = (status || "").toUpperCase();
  switch (norm) {
    case "ACCEPTED":
    case "WON":
      return {
        label: "Accepted",
        colorClass: "text-[#E78F23]",
      };
    case "LEADING":
      return {
        label: "Leading",
        colorClass: "text-emerald-500",
      };
    case "PENDING":
      return {
        label: "Pending",
        colorClass: "text-blue-400",
      };
    case "COUNTERED":
      return {
        label: "Countered",
        colorClass: "text-amber-400",
      };
    case "REJECTED":
    case "DECLINED":
      return {
        label: "Declined",
        colorClass: "text-red-500",
      };
    case "OUTBID":
      return {
        label: "Outbid",
        colorClass: "text-red-500",
      };
    default:
      return {
        label: status || "Pending",
        colorClass: "text-gray-400",
      };
  }
};

export default function MyBidsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useOffersQuery({
    page,
    limit,
  });

  const bids: OfferItem[] = data?.data || [];
  const meta = data?.meta;

  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [inclFees, setInclFees] = useState(true);

  // Auto-select first bid when data loads or page changes
  useEffect(() => {
    if (bids.length > 0) {
      if (!selectedBidId || !bids.some((b) => b.id === selectedBidId)) {
        setSelectedBidId(bids[0].id);
      }
    } else {
      setSelectedBidId(null);
    }
  }, [bids, selectedBidId]);

  const selectedBid = bids.find((bid) => bid.id === selectedBidId) || bids[0];

  // Price calculations for selected bid
  const currentBidVal = selectedBid
    ? parseFloat(selectedBid.currentAmount || selectedBid.initialAmount || "0")
    : 0;
  const vipFeeVal = currentBidVal * 0.015;
  const totalPayableVal = inclFees ? currentBidVal + vipFeeVal : currentBidVal;
  const currency = selectedBid?.listing?.currency || "USD";

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
        <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-8 text-center my-8">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">
            Failed to load bids
          </h3>
          <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
            {(error as any)?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred while fetching your offers."}
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
        <MyBidsSkeleton />
      ) : bids.length > 0 && selectedBid ? (
        /* Main content – side-by-side on large screens */
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Left: Bids Table (scrollable on small screens) ── */}
          <div className="flex-1 min-w-0">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_repeat(3,100px)_150px] gap-4 mb-6 px-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Item
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Your Bid
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Highest Bid
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Status
              </span>
              <span></span>
            </div>

            {/* Scrollable table container */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="space-y-4 min-w-175 sm:min-w-0">
                {bids.map((bid, index) => {
                  const statusInfo = getStatusBadge(bid.status);
                  const isSelected = selectedBidId === bid.id;
                  const imageUrl =
                    bid.listing?.media?.[0]?.url ||
                    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=100";
                  const itemTitle = bid.listing?.title || "Untitled Item";
                  const bidCurrency = bid.listing?.currency || "USD";

                  return (
                    <AnimationWrapper
                      key={bid.id}
                      type="fade-right"
                      duration={0.4}
                      delay={0.05 * index}
                    >
                      <div
                        onClick={() => setSelectedBidId(bid.id)}
                        className={`grid grid-cols-[1fr_repeat(3,100px)_150px] items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group
                          ${
                            isSelected
                              ? "bg-white/5 border-[#E78F23]/20 shadow-lg shadow-black/20"
                              : "bg-[#161618] border-[#2C2C2E] hover:border-white/10"
                          }`}
                      >
                        {/* Item */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/5">
                            <img
                              src={imageUrl}
                              alt={itemTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=100";
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                            {itemTitle}
                          </span>
                        </div>

                        {/* Your Bid */}
                        <span className="text-sm font-medium text-gray-400">
                          {formatPrice(
                            bid.initialAmount || bid.currentAmount,
                            bidCurrency,
                          )}
                        </span>

                        {/* Highest Bid */}
                        <span className="text-sm font-medium text-gray-400">
                          {formatPrice(bid.currentAmount, bidCurrency)}
                        </span>

                        {/* Status */}
                        <div>
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${statusInfo.colorClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-1 sm:gap-2 pr-2">
                          {(bid.listing?.saleType || "").toUpperCase() ===
                            "AUCTION" &&
                            (bid.status || "").toUpperCase() !== "ACCEPTED" &&
                            (bid.status || "").toUpperCase() !== "WON" &&
                            ((bid.status || "").toUpperCase() === "OUTBID" ||
                              (bid.status || "").toUpperCase() ===
                                "COUNTERED") && (
                              <Link
                                href={`/buyer/marketplace/${
                                  bid.listing?.slug || bid.listingId
                                }`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 sm:p-2.5 bg-[#E78F23]/10 hover:bg-[#E78F23]/20 text-[#E78F23] rounded-lg transition-colors border border-[#E78F23]/20 group/btn"
                                title="Increase Bid"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </Link>
                            )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBidId(bid.id);
                            }}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-[11px] font-bold rounded-lg border border-white/5 transition-all whitespace-nowrap"
                          >
                            View Details{" "}
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </AnimationWrapper>
                  );
                })}
              </div>
            </div>

            {/* ── Pagination Controls ── */}
            {meta && meta.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#2C2C2E]">
                <p className="text-xs text-gray-400">
                  Showing{" "}
                  <span className="font-bold text-white">
                    {(meta.page - 1) * meta.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-white">
                    {Math.min(meta.page * meta.limit, meta.total)}
                  </span>{" "}
                  of <span className="font-bold text-white">{meta.total}</span>{" "}
                  bids
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 bg-[#161618] border border-[#2C2C2E] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-gray-400 font-medium px-2">
                    Page {page} of {meta.totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, meta.totalPages))
                    }
                    disabled={page >= meta.totalPages}
                    className="p-2 bg-[#161618] border border-[#2C2C2E] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Bid Details Panel ── */}
          <div className="w-full lg:w-95 shrink-0">
            <AnimationWrapper type="fade-left" duration={0.6}>
              <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-8">
                {/* Product Info */}
                <div>
                  <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
                    {selectedBid.listing?.saleType?.replace("_", " ") ||
                      "Auction"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-clash font-semibold text-white">
                    {selectedBid.listing?.title || "Listing Details"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Worldwide</span>
                  </div>
                </div>

                {/* Price Summary Card */}
                <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Price Summary
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                        Show total incl. fees
                      </span>
                      <button
                        onClick={() => setInclFees(!inclFees)}
                        className={`w-9 sm:w-10 h-5 sm:h-5.5 rounded-full relative transition-all duration-300 ${
                          inclFees ? "bg-white" : "bg-[#2C2C2E]"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                            inclFees
                              ? "left-5 sm:left-5.5 bg-black"
                              : "left-0.5 sm:left-1 bg-white"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <span className="text-gray-400">Current Bid</span>
                      <span className="text-white font-medium">
                        {formatPrice(currentBidVal, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">VIP Fee (1.5%)</span>
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <span className="text-white font-medium">
                        {formatPrice(vipFeeVal, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 sm:pt-6 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <span className="text-sm font-medium text-gray-400">
                        Total Payable
                      </span>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl sm:text-3xl lg:text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">
                          {formatPrice(totalPayableVal, currency)}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Asking:{" "}
                          {formatPrice(
                            selectedBid.listing?.askingPrice,
                            currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
                    <div className="w-1.5 h-1.5 bg-[#E78F23] rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
                    <span className="text-[9px] text-[#E78F23] font-bold uppercase tracking-widest">
                      VIP reduced fee applied
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                      {getStatusBadge(selectedBid.status).label}
                    </p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Rounds Count
                    </p>
                    <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                      {selectedBid.roundsCount || 1}
                    </p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Initial Offer
                    </p>
                    <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                      {formatPrice(selectedBid.initialAmount, currency)}
                    </p>
                  </div>
                  <div className="bg-[#161618] rounded-xl p-3 sm:p-4 border border-white/5">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                      Submitted Date
                    </p>
                    <p className="text-sm sm:text-[15px] font-medium text-white truncate">
                      {formatDate(selectedBid.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5 shrink-0 uppercase">
                    {selectedBid.seller?.firstName?.[0] ||
                      selectedBid.seller?.lastName?.[0] ||
                      "S"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-none mb-1 truncate">
                      {[
                        selectedBid.seller?.firstName,
                        selectedBid.seller?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "Verified Seller"}
                    </p>
                    <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
                      <BadgeCheck className="w-3 h-3 shrink-0" />
                      <span className="truncate">Verified Dealer</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  {(selectedBid.listing?.saleType || "").toUpperCase() ===
                    "AUCTION" &&
                    (selectedBid.status || "").toUpperCase() !== "ACCEPTED" &&
                    (selectedBid.status || "").toUpperCase() !== "WON" && (
                      <Link
                        href={`/buyer/marketplace/${
                          selectedBid.listing?.slug || selectedBid.listingId
                        }`}
                        className="w-full py-4 sm:py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98] flex items-center justify-center cursor-pointer"
                      >
                        Increase Bid
                      </Link>
                    )}
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-4 sm:py-4.5 bg-transparent border border-white/10 hover:bg-white/5 text-white text-[13px] font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-gray-400" />
                    Share
                  </button>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      ) : (
        /* ── Empty State ── */
        !isError && (
          <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-12 text-center my-8">
            <div className="w-16 h-16 bg-[#2C2C2E]/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E78F23]">
              <Gavel className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-clash font-medium text-white mb-2">
              No Bids Placed Yet
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              You haven't submitted any offers or bids on listings yet. Explore
              the marketplace to place your first bid.
            </p>
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E78F23] hover:bg-[#d47f1b] text-black text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg"
            >
              Browse Marketplace
            </Link>
          </div>
        )
      )}
    </div>
  );
}

/* ─── Smooth Skeleton Loader Component ─── */
function MyBidsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse">
      {/* Left side table skeleton */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Table header skeleton */}
        <div className="hidden sm:grid grid-cols-[1fr_repeat(3,100px)_150px] gap-4 px-4 mb-2">
          <div className="h-3 bg-[#252528] rounded w-16" />
          <div className="h-3 bg-[#252528] rounded w-16" />
          <div className="h-3 bg-[#252528] rounded w-20" />
          <div className="h-3 bg-[#252528] rounded w-14" />
          <div />
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_repeat(3,100px)_150px] items-center gap-4 p-4 rounded-xl border border-[#2C2C2E] bg-[#161618]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg bg-[#252528] shrink-0" />
              <div className="h-4 bg-[#252528] rounded w-36 sm:w-48" />
            </div>
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="h-4 bg-[#252528] rounded w-16" />
            <div className="flex justify-end">
              <div className="h-8 bg-[#252528] rounded-lg w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Right side detail panel skeleton */}
      <div className="w-full lg:w-95 shrink-0">
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-3 bg-[#252528] rounded w-16" />
            <div className="h-7 bg-[#252528] rounded w-3/4" />
            <div className="h-3 bg-[#252528] rounded w-1/3" />
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 space-y-4">
            <div className="flex justify-between">
              <div className="h-3 bg-[#252528] rounded w-24" />
              <div className="h-4 bg-[#252528] rounded-full w-8" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <div className="h-3 bg-[#252528] rounded w-20" />
                <div className="h-3 bg-[#252528] rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-[#252528] rounded w-24" />
                <div className="h-3 bg-[#252528] rounded w-14" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
              <div className="h-3 bg-[#252528] rounded w-24" />
              <div className="h-8 bg-[#252528] rounded w-32" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111111] rounded-xl p-3.5 border border-white/5 space-y-2"
              >
                <div className="h-2.5 bg-[#252528] rounded w-16" />
                <div className="h-4 bg-[#252528] rounded w-20" />
              </div>
            ))}
          </div>

          <div className="h-12 bg-[#252528] rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

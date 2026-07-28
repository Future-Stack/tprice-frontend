"use client";

import React, { useState } from "react";
import Link from "next/link";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  Check,
  X,
  RefreshCcw,
  Eye,
  Clock,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useOffersQuery, useAcceptOfferMutation } from "@/hooks/useOffers";

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status?.toUpperCase() || "";
  switch (normalized) {
    case "ACTION REQUIRED":
    case "PENDING":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#E78F23]/10 text-primary border border-[#E78F23]/20">
          Action Required
        </span>
      );
    case "COUNTERED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Countered
        </span>
      );
    case "ACCEPTED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
          Accepted
        </span>
      );
    case "DECLINED":
    case "REJECTED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
          Declined
        </span>
      );
    default:
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">
          {status}
        </span>
      );
  }
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount?: string | number, currency = "USD") => {
  if (amount === undefined || amount === null || amount === "") return "N/A";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency} ${amount}`;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `$${num.toLocaleString()}`;
  }
};

const OffersSkeleton = () => (
  <div className="divide-y divide-white/5">
    {[1, 2, 3, 4, 5].map((n) => (
      <div key={n} className="p-6 md:p-8 animate-pulse">
        {/* Desktop Skeleton */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
          <div className="col-span-4 space-y-2">
            <div className="h-6 bg-white/10 rounded-md w-3/4" />
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
          </div>
          <div className="col-span-2 space-y-2">
            <div className="h-5 bg-white/10 rounded-md w-2/3" />
            <div className="h-3 bg-white/5 rounded-md w-1/3" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-8 bg-white/10 rounded-md w-28" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-7 bg-white/10 rounded-md w-24" />
          </div>
          <div className="col-span-2 flex justify-end">
            <div className="h-9 bg-white/10 rounded-xl w-32" />
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-6 bg-white/10 rounded-md w-full" />
              <div className="h-4 bg-white/5 rounded-md w-3/4" />
            </div>
            <div className="h-7 bg-white/10 rounded-md w-24" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="space-y-1">
                <div className="h-4 bg-white/10 rounded-md w-20" />
                <div className="h-3 bg-white/5 rounded-md w-12" />
              </div>
            </div>
            <div className="h-6 bg-white/10 rounded-md w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

function OfferReceieved() {
  const [page, setPage] = useState(1);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useOffersQuery({
    page,
    limit,
  });

  const { mutate: acceptOffer } = useAcceptOfferMutation();

  const handleAccept = (offerId: string) => {
    setAcceptingId(offerId);
    acceptOffer(offerId, {
      onSettled: () => {
        setAcceptingId(null);
      },
    });
  };

  const offers = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <AnimationWrapper type="fade-up">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-4xl font-medium font-montserrat tracking-tight mb-3 text-white">
            Offers Received
          </h1>
          <p className="text-gray-400 text-lg">
            Review and manage incoming offers for your active listings.
          </p>
        </div>

        {/* Offers Container */}
        <div className="relative group">
          {/* Subtle glow effect */}
          <div className="absolute -inset-px bg-linear-to-b from-white/10 to-[#E78F23]/20 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none" />

          <div className="relative bg-[#111113] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-white/2">
              <div className="col-span-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Item & Details
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Buyer
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">
                Latest Amount
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">
                Status
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-right">
                Actions
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <OffersSkeleton />}

            {/* Error State */}
            {!isLoading && isError && (
              <div className="p-12 text-center text-gray-400">
                <p className="text-red-400 mb-4 font-medium">
                  Failed to load offers. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-primary transition-all cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && offers.length === 0 && (
              <div className="p-16 text-center text-gray-400">
                <PackageOpen
                  size={48}
                  className="mx-auto mb-4 text-gray-600 stroke-[1.5]"
                />
                <h3 className="text-xl font-medium text-white mb-1">
                  No Offers Received Yet
                </h3>
                <p className="text-sm text-gray-500">
                  When buyers make offers on your listings, they will appear
                  here.
                </p>
              </div>
            )}

            {/* Offers List */}
            {!isLoading && !isError && offers.length > 0 && (
              <div className="divide-y divide-white/5">
                {offers.map((offer) => {
                  const itemTitle =
                    offer.listing?.title ||
                    `Listing #${offer.listingId.slice(0, 8)}`;
                  const detailsText = offer.listing?.askingPrice
                    ? `Asking Price: ${formatCurrency(offer.listing.askingPrice, offer.listing.currency || "USD")}`
                    : `Initial Offer: ${formatCurrency(offer.initialAmount)}`;
                  const buyerName =
                    [offer.buyer?.firstName, offer.buyer?.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim() || "Buyer";
                  const buyerInitial = (
                    offer.buyer?.firstName ||
                    offer.buyer?.lastName ||
                    "B"
                  )
                    .charAt(0)
                    .toUpperCase();
                  const timeAgo = formatTimeAgo(offer.createdAt);
                  const formattedAmount = formatCurrency(
                    offer.currentAmount,
                    offer.listing?.currency || "USD",
                  );
                  const isPending =
                    offer.status?.toUpperCase() === "PENDING" ||
                    offer.status?.toUpperCase() === "ACTION REQUIRED";
                  const isCountered =
                    offer.status?.toUpperCase() === "COUNTERED";

                  return (
                    <div
                      key={offer.id}
                      className="p-6 md:p-8 hover:bg-white/1 transition-all duration-300 group/row"
                    >
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                        {/* Item & Details */}
                        <div className="col-span-4 space-y-1.5">
                          <h3 className="font-bold text-xl text-white group-hover/row:text-primary transition-colors line-clamp-1">
                            {itemTitle}
                          </h3>
                          <p className="text-sm text-gray-500 italic line-clamp-1 pr-4">
                            {detailsText}
                          </p>
                          {offer.roundsCount > 0 && (
                            <div className="flex items-center gap-2 pt-1">
                              <RefreshCcw size={12} className="text-primary" />
                              <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                                {offer.roundsCount} Negotiation{" "}
                                {offer.roundsCount === 1 ? "Round" : "Rounds"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Buyer */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="text-base font-semibold text-white truncate">
                            {buyerName}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {timeAgo}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="col-span-2 text-center">
                          <div className="text-3xl font-black text-primary tracking-tighter">
                            {formattedAmount}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <StatusBadge status={offer.status} />
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex flex-col items-end gap-2">
                          {isPending ? (
                            <div className="flex items-center gap-5">
                              <button
                                onClick={() => handleAccept(offer.id)}
                                disabled={acceptingId === offer.id}
                                className="flex items-center gap-1.5 text-sm font-bold text-green-500 hover:text-green-400 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {acceptingId === offer.id ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin text-green-500"
                                  />
                                ) : (
                                  <Check size={16} strokeWidth={3} />
                                )}
                                <span>
                                  {acceptingId === offer.id
                                    ? "Accepting..."
                                    : "Accept"}
                                </span>
                              </button>
                              <button
                                disabled={acceptingId === offer.id}
                                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <RefreshCcw size={16} strokeWidth={3} /> Counter
                              </button>
                              <button
                                disabled={acceptingId === offer.id}
                                className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <X size={16} strokeWidth={3} /> Reject
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              {isCountered && (
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <Clock size={14} className="animate-pulse" />{" "}
                                  Awaiting Buyer
                                </div>
                              )}
                              <Link
                                href={`/seller/offer-receieved/${offer.id}`}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary/40 text-xs font-black uppercase tracking-widest text-white bg-white/3 hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 active:scale-95 group/btn shadow-[0_0_20px_rgba(231,143,35,0)] hover:shadow-[0_0_20px_rgba(231,143,35,0.2)] cursor-pointer"
                              >
                                <Eye
                                  size={16}
                                  className="text-primary group-hover/btn:text-black transition-colors"
                                />{" "}
                                View Details
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile Layout (Card Like) */}
                      <div className="lg:hidden flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-bold text-xl text-white group-hover/row:text-primary transition-colors">
                              {itemTitle}
                            </h3>
                            <p className="text-sm text-gray-500 italic">
                              {detailsText}
                            </p>
                          </div>
                          <div className="text-2xl font-black text-primary tracking-tighter">
                            {formattedAmount}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary font-bold">
                              {buyerInitial}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-white">
                                {buyerName}
                              </div>
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                {timeAgo}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={offer.status} />
                        </div>

                        <div className="pt-2">
                          {isPending ? (
                            <div className="grid grid-cols-3 gap-3">
                              <button
                                onClick={() => handleAccept(offer.id)}
                                disabled={acceptingId === offer.id}
                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 transition-active active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {acceptingId === offer.id ? (
                                  <Loader2
                                    size={20}
                                    className="animate-spin text-green-500"
                                  />
                                ) : (
                                  <Check size={20} strokeWidth={3} />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  {acceptingId === offer.id
                                    ? "Accepting..."
                                    : "Accept"}
                                </span>
                              </button>
                              <button
                                disabled={acceptingId === offer.id}
                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/20 text-primary transition-active active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <RefreshCcw size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  Counter
                                </span>
                              </button>
                              <button
                                disabled={acceptingId === offer.id}
                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 transition-active active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <X size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  Reject
                                </span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {isCountered && (
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest pb-1">
                                  <Clock size={14} className="animate-pulse" />{" "}
                                  Awaiting Buyer
                                </div>
                              )}
                              <Link
                                href={`/seller/offer-receieved/${offer.id}`}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-[#E78F23]/40 text-xs font-black uppercase tracking-widest text-primary bg-white/3 transition-all active:scale-[0.98] cursor-pointer"
                              >
                                <Eye size={18} /> View Details
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !isError && meta && meta.totalPages > 1 && (
              <div className="px-8 py-5 border-t border-white/5 bg-white/2 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div>
                  Showing{" "}
                  <span className="font-bold text-white">
                    {(meta.page - 1) * meta.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-white">
                    {Math.min(meta.page * meta.limit, meta.total)}
                  </span>{" "}
                  of <span className="font-bold text-white">{meta.total}</span>{" "}
                  offers
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from(
                      { length: meta.totalPages },
                      (_, i) => i + 1,
                    ).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl border font-bold text-xs transition-all duration-300 cursor-pointer ${
                          pageNum === meta.page
                            ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(231,143,35,0.4)]"
                            : "bg-[#121212] border-[#2D2D2D] text-gray-400 hover:text-white hover:border-primary/40"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer gradient glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/40 to-transparent blur-sm" />
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default OfferReceieved;

"use client";

import React, { useState, useEffect, useRef } from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RefreshCcw,
  Flag,
  DollarSign,
  AlertCircle,
  Inbox,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  useOffersQuery,
  useCreateOfferMutation,
  useAcceptOfferMutation,
  useWithdrawOfferMutation,
  useCounterOfferMutation,
} from "@/hooks/useOffers";
import { OfferItem } from "@/lib/api/offers";

/* ─── Helper Functions ─── */
const formatPrice = (priceStr?: string | number | null, currency = "USD") => {
  if (priceStr === undefined || priceStr === null || priceStr === "")
    return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
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

/* ─── Counter Offer Modal ─── */
interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferItem | null;
}

const CounterOfferModal = ({
  isOpen,
  onClose,
  offer,
}: CounterOfferModalProps) => {
  const [counterAmount, setCounterAmount] = useState("");
  const [note, setNote] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const counterOfferMutation = useCounterOfferMutation();

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCounterAmount("");
      setNote("");
      setIsClosing(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250);
  };

  const handleSendCounter = async () => {
    if (!offer) return;
    const amountNum = parseFloat(counterAmount.replace(/,/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid counter offer amount");
      return;
    }

    try {
      await counterOfferMutation.mutateAsync({
        offerId: offer.id,
        payload: {
          amount: amountNum,
          note: note.trim() || undefined,
        },
      });
      handleClose();
    } catch (err) {
      // Error handled by mutation toast
    }
  };

  if (!isOpen || !offer) return null;

  const imageUrl =
    offer.listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=150";

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 ${
        isClosing
          ? "counter-modal-backdrop-exit"
          : "counter-modal-backdrop-enter"
      }`}
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-95 bg-[#18181B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden ${
          isClosing ? "counter-modal-exit" : "counter-modal-enter"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[15px] font-bold text-white tracking-tight">
            Send Counter Offer
          </h2>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-white/5" />

        {/* Item Preview */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <Image
                src={imageUrl}
                alt={offer.listing?.title || "Listing"}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm font-semibold text-white/90 leading-tight">
              {offer.listing?.title || "Untitled Listing"}
            </div>
          </div>

          {/* Price Comparison */}
          <div className="flex gap-8 mt-5">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Your last offer
              </div>
              <div className="text-lg font-black text-white leading-none tracking-tight">
                {formatPrice(
                  offer.currentAmount || offer.initialAmount,
                  offer.listing?.currency,
                )}
              </div>
            </div>
            {offer.listing?.askingPrice && (
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Asking price
                </div>
                <div className="text-lg font-black text-[#D4AF37] leading-none tracking-tight">
                  {formatPrice(
                    offer.listing.askingPrice,
                    offer.listing.currency,
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Counter Input & Note */}
        <div className="px-6 pb-3 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Your counter offer
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Note / Message (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Can meet in the middle for immediate wire transfer."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Negotiation Round */}
        {offer.roundsCount !== undefined && (
          <div className="px-6 pb-4">
            <div className="text-[10px] font-medium text-gray-500 tracking-wider">
              Negotiation round {(offer.roundsCount || 0) + 1}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mx-6 border-t border-white/5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-5">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSendCounter}
            disabled={counterOfferMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.97]"
          >
            <RefreshCcw
              size={14}
              className={counterOfferMutation.isPending ? "animate-spin" : ""}
            />
            {counterOfferMutation.isPending
              ? "Sending..."
              : "Send Counter Offer"}
          </button>
        </div>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes counterModalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes counterModalOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
        }
        @keyframes backdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes backdropOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .counter-modal-enter {
          animation: counterModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .counter-modal-exit {
          animation: counterModalOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .counter-modal-backdrop-enter {
          animation: backdropIn 0.3s ease forwards;
        }
        .counter-modal-backdrop-exit {
          animation: backdropOut 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

/* ─── Status Badge ─── */
const StatusBadge = ({ status }: { status?: string }) => {
  const norm = (status || "").toUpperCase();
  switch (norm) {
    case "PENDING":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20 uppercase tracking-wider">
          Pending
        </span>
      );
    case "ACCEPTED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30 uppercase tracking-wider">
          Accepted
        </span>
      );
    case "REJECTED":
    case "DECLINED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-500/80 border border-red-500/30 uppercase tracking-wider">
          Rejected
        </span>
      );
    case "WITHDRAWN":
    case "CANCELLED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-wider">
          Withdrawn
        </span>
      );
    case "COUNTERED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500/80 border border-orange-500/20 uppercase tracking-wider">
          Countered
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-white/10 uppercase tracking-wider">
          {status || "Unknown"}
        </span>
      );
  }
};

/* ─── Skeleton Loader Component ─── */
const OfferSkeletonCard = () => (
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

function BuyerOffer() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterOffer, setCounterOffer] = useState<OfferItem | null>(null);

  const { data, isLoading, isError, error, refetch } = useOffersQuery({
    page,
    limit,
  });

  const acceptOfferMutation = useAcceptOfferMutation();
  const withdrawOfferMutation = useWithdrawOfferMutation();

  const offers: OfferItem[] = data?.data || [];
  const meta = data?.meta;

  const handleAccept = (offerId: string) => {
    acceptOfferMutation.mutate(offerId);
  };

  const handleWithdraw = (offerId: string) => {
    withdrawOfferMutation.mutate(offerId);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-inter">
      <AnimationWrapper type="fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-4xl font-medium font-montserrat tracking-wide">
              My Offers
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage and track all offers you have submitted on listings
            </p>
          </div>
        </div>

        {/* Offers List */}
        <div className="relative group">
          {/* Main Container border/glow */}
          <div className="absolute -inset-px bg-linear-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none opacity-50" />

          <div className="relative bg-[#0A0A0B] rounded-[2rem] border border-white/5 overflow-hidden p-4 md:p-0 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <OfferSkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="py-16 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  Failed to load offers
                </h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  {(error as any)?.message ||
                    "An unexpected error occurred while fetching your offers."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && offers.length === 0 && (
              <div className="py-16 text-center space-y-4">
                <Inbox className="w-12 h-12 text-gray-500 mx-auto opacity-60" />
                <h3 className="text-xl font-bold text-white">
                  No offers found
                </h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  You haven't submitted any offers yet. Explore active listings
                  to place your first offer.
                </p>
                <Link
                  href="/inventory"
                  className="inline-block px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c4a132] text-black text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Browse Listings
                </Link>
              </div>
            )}

            {/* Offers List */}
            {!isLoading &&
              !isError &&
              offers.map((offer) => {
                const listing = offer.listing;
                const saleType = (listing?.saleType || "").toUpperCase();
                const allowCounterOffers = listing?.allowCounterOffers ?? false;
                const isFixedWithCounter =
                  saleType === "FIXED_PRICE" && allowCounterOffers;
                const statusUpper = (offer.status || "").toUpperCase();
                const isTerminalStatus =
                  statusUpper === "ACCEPTED" ||
                  statusUpper === "REJECTED" ||
                  statusUpper === "DECLINED" ||
                  statusUpper === "WITHDRAWN" ||
                  statusUpper === "CANCELLED" ||
                  statusUpper === "EXPIRED";

                const showCounterButton =
                  (statusUpper === "COUNTERED" || isFixedWithCounter) &&
                  !isTerminalStatus;

                const imageUrl =
                  listing?.media?.[0]?.url ||
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=150";

                return (
                  <div key={offer.id} className="space-y-4">
                    {/* Action Required Header */}
                    {showCounterButton && (
                      <div className="flex items-center gap-2 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest px-1">
                        <Flag size={14} fill="currentColor" />
                        Counter Offer Available — Action Required
                      </div>
                    )}

                    {/* Offer Card */}
                    <div
                      className={`relative bg-white/5 rounded-2xl border ${
                        showCounterButton
                          ? "border-[#D4AF37]/20 bg-[#D4AF37]/2"
                          : "border-white/5"
                      } p-5 md:p-6 hover:bg-white/8 transition-all duration-300`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Thumbnail */}
                        <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <Image
                            src={imageUrl}
                            alt={listing?.title || "Listing image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white/90">
                              {listing?.title || "Untitled Listing"}
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              {offer.roundsCount ? (
                                <span>
                                  {offer.roundsCount} negotiation round
                                  {offer.roundsCount > 1 ? "s" : ""}
                                </span>
                              ) : null}
                              {offer.createdAt && (
                                <span>Date: {formatDate(offer.createdAt)}</span>
                              )}
                            </div>

                            {offer.histories && offer.histories.length > 0 && (
                              <button
                                onClick={() =>
                                  setExpandedOfferId(
                                    expandedOfferId === offer.id
                                      ? null
                                      : offer.id,
                                  )
                                }
                                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-colors mt-2"
                              >
                                {expandedOfferId === offer.id ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                                {expandedOfferId === offer.id ? "Hide" : "Show"}{" "}
                                negotiation history
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                            {/* Offer Details */}
                            <div className="flex gap-8">
                              <div className="text-center">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                  Your Offer
                                </div>
                                <div className="text-2xl font-black text-white leading-none tracking-tight">
                                  {formatPrice(
                                    offer.currentAmount || offer.initialAmount,
                                    listing?.currency,
                                  )}
                                </div>
                              </div>
                              {listing?.askingPrice && (
                                <div className="text-center">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                    Asking Price
                                  </div>
                                  <div className="text-2xl font-black text-gray-300 leading-none tracking-tight">
                                    {formatPrice(
                                      listing.askingPrice,
                                      listing.currency,
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status Badge */}
                            <StatusBadge status={offer.status} />

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {statusUpper === "COUNTERED" && (
                                <button
                                  onClick={() => handleAccept(offer.id)}
                                  disabled={acceptOfferMutation.isPending}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase tracking-widest text-green-500 hover:bg-green-500/20 transition-all disabled:opacity-50"
                                >
                                  <Check size={14} /> Accept
                                </button>
                              )}

                              {(statusUpper === "PENDING" ||
                                statusUpper === "COUNTERED") && (
                                <button
                                  onClick={() => handleWithdraw(offer.id)}
                                  disabled={withdrawOfferMutation.isPending}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50"
                                >
                                  <X
                                    size={14}
                                    className={
                                      withdrawOfferMutation.isPending
                                        ? "animate-spin"
                                        : ""
                                    }
                                  />{" "}
                                  Withdraw
                                </button>
                              )}

                              {showCounterButton && (
                                <button
                                  onClick={() => {
                                    setCounterOffer(offer);
                                    setCounterModalOpen(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                                >
                                  <RefreshCcw size={14} /> Counter
                                </button>
                              )}

                              <Link
                                href={`/buyer/my-offer/${offer.id}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                              >
                                <Eye size={14} /> View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Negotiation History Dropdown */}
                      {expandedOfferId === offer.id &&
                        offer.histories &&
                        offer.histories.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                            {offer.histories.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between group/hist"
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      item.senderId === offer.buyerId
                                        ? "bg-blue-500"
                                        : "bg-[#D4AF37]"
                                    }`}
                                  />
                                  <div className="text-sm">
                                    <span
                                      className={`font-bold ${
                                        item.senderId === offer.buyerId
                                          ? "text-blue-400"
                                          : "text-[#D4AF37]"
                                      }`}
                                    >
                                      {item.senderId === offer.buyerId
                                        ? "You"
                                        : `${item.sender?.firstName || "Seller"} ${
                                            item.sender?.lastName || ""
                                          }`}
                                    </span>
                                    <span className="text-white ml-2">
                                      {formatPrice(
                                        item.amount,
                                        listing?.currency,
                                      )}
                                    </span>
                                    {item.note && (
                                      <span className="text-gray-400 text-xs italic ml-2">
                                        "{item.note}"
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                  {formatDate(item.createdAt)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="text-xs text-gray-400">
                  Showing{" "}
                  <span className="font-bold text-white">
                    {(page - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-white">
                    {Math.min(page * limit, meta.total)}
                  </span>{" "}
                  of <span className="font-bold text-white">{meta.total}</span>{" "}
                  offers
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <div className="text-xs font-semibold px-2 text-white/60">
                    Page {page} of {meta.totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page >= meta.totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Counter Offer Modal */}
        <CounterOfferModal
          isOpen={counterModalOpen}
          onClose={() => setCounterModalOpen(false)}
          offer={counterOffer}
        />
      </AnimationWrapper>
    </div>
  );
}

export default BuyerOffer;

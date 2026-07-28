"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  RefreshCcw,
  Clock,
  User,
  Tag,
  DollarSign,
  Calendar,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  Handshake,
  Loader2,
  ShieldCheck,
  Building,
  Copy,
  CheckCircle2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useOfferDetailQuery, useAcceptOfferMutation } from "@/hooks/useOffers";
import { toast } from "sonner";

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = status?.toUpperCase() || "";
  switch (normalized) {
    case "ACTION REQUIRED":
    case "PENDING":
      return (
        <span className="px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#E78F23]/10 text-[#E78F23] border border-[#E78F23]/25 shadow-[0_0_12px_rgba(231,143,35,0.15)] flex items-center gap-1.5">
          <Clock size={12} className="animate-pulse" />
          Action Required
        </span>
      );
    case "COUNTERED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.15)] flex items-center gap-1.5">
          <RefreshCcw size={12} />
          Countered
        </span>
      );
    case "ACCEPTED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center gap-1.5">
          <CheckCircle2 size={12} />
          Accepted
        </span>
      );
    case "DECLINED":
    case "REJECTED":
      return (
        <span className="px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)] flex items-center gap-1.5">
          <X size={12} />
          Declined
        </span>
      );
    default:
      return (
        <span className="px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/25">
          {status || "UNKNOWN"}
        </span>
      );
  }
};

const ActionBadge = ({ action }: { action?: string }) => {
  const normalized = action?.toUpperCase() || "";
  switch (normalized) {
    case "INITIAL_OFFER":
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E78F23]/15 text-[#E78F23] border border-[#E78F23]/30">
          Initial Offer
        </span>
      );
    case "COUNTER_OFFER":
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Counter Offer
        </span>
      );
    case "ACCEPTANCE":
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Acceptance
        </span>
      );
    case "REJECTION":
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
          Rejection
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-500/15 text-gray-400 border border-gray-500/30">
          {action}
        </span>
      );
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

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
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

const OfferDetailSkeleton = () => (
  <div className="w-full space-y-8 animate-pulse">
    {/* Navigation Skeleton */}
    <div className="h-5 bg-white/10 rounded-md w-48" />

    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-2xl bg-[#111113] border border-white/5">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 bg-white/10 rounded-lg w-64" />
          <div className="h-7 bg-white/10 rounded-md w-28" />
        </div>
        <div className="h-4 bg-white/5 rounded-md w-48" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-11 bg-white/10 rounded-xl w-32" />
        <div className="h-11 bg-white/10 rounded-xl w-32" />
      </div>
    </div>

    {/* Stat Cards Grid Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-[#111113] border border-white/5 space-y-3"
        >
          <div className="h-4 bg-white/5 rounded-md w-1/2" />
          <div className="h-8 bg-white/10 rounded-lg w-3/4" />
          <div className="h-3 bg-white/5 rounded-md w-2/3" />
        </div>
      ))}
    </div>

    {/* Main Content Layout Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-7 space-y-8">
        <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
          <div className="h-6 bg-white/10 rounded-md w-1/3" />
          <div className="h-7 bg-white/10 rounded-md w-3/4" />
          <div className="h-4 bg-white/5 rounded-md w-1/2" />
        </div>

        <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-6">
          <div className="h-6 bg-white/10 rounded-md w-1/3" />
          <div className="space-y-4 pt-2">
            {[1, 2].map((j) => (
              <div
                key={j}
                className="p-5 rounded-xl bg-white/2 border border-white/5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-white/10 rounded-md w-36" />
                  <div className="h-5 bg-white/10 rounded-md w-24" />
                </div>
                <div className="h-6 bg-white/10 rounded-md w-28" />
                <div className="h-4 bg-white/5 rounded-md w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-5 space-y-8">
        <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
          <div className="h-6 bg-white/10 rounded-md w-1/2" />
          <div className="flex items-center gap-4 pt-2">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-white/10 rounded-md w-3/4" />
              <div className="h-3 bg-white/5 rounded-md w-1/2" />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#111113] border border-white/5 space-y-4">
          <div className="h-6 bg-white/10 rounded-md w-1/2" />
          <div className="space-y-3 pt-2">
            <div className="h-4 bg-white/5 rounded-md w-full" />
            <div className="h-4 bg-white/5 rounded-md w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params?.id as string;

  const [accepting, setAccepting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const { data: offer, isLoading, isError, refetch } = useOfferDetailQuery(
    offerId
  );

  const { mutate: acceptOffer } = useAcceptOfferMutation();

  const handleAccept = () => {
    if (!offerId) return;
    setAccepting(true);
    acceptOffer(offerId, {
      onSettled: () => {
        setAccepting(false);
      },
    });
  };

  const handleCopyId = () => {
    if (!offerId) return;
    navigator.clipboard.writeText(offerId);
    setCopiedId(true);
    toast.success("Offer ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8">
        <OfferDetailSkeleton />
      </div>
    );
  }

  if (isError || !offer) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="p-10 rounded-2xl bg-[#111113] border border-white/5 shadow-2xl space-y-5">
          <AlertCircle size={56} className="mx-auto text-rose-500 stroke-[1.5]" />
          <h2 className="text-2xl font-bold text-white">Offer Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            We couldn't load the details for this offer. It may have been deleted or the URL might be invalid.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/seller/offer-receieved"
              className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:border-white/30 transition-all"
            >
              Back to Offers
            </Link>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 rounded-xl bg-[#E78F23] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E78F23]/90 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPending =
    offer.status?.toUpperCase() === "PENDING" ||
    offer.status?.toUpperCase() === "ACTION REQUIRED";
  const isAccepted = offer.status?.toUpperCase() === "ACCEPTED";
  const isCountered = offer.status?.toUpperCase() === "COUNTERED";

  const currency = offer.listing?.currency || "USD";
  const formattedCurrentAmount = formatCurrency(offer.currentAmount, currency);
  const formattedInitialAmount = formatCurrency(offer.initialAmount, currency);
  const formattedAskingPrice = offer.listing?.askingPrice
    ? formatCurrency(offer.listing.askingPrice, currency)
    : "N/A";

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

  const sellerName =
    [offer.seller?.firstName, offer.seller?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Seller";

  // Calculate difference relative to asking price
  let priceDiffPercent: number | null = null;
  if (offer.listing?.askingPrice && offer.currentAmount) {
    const asking = parseFloat(offer.listing.askingPrice);
    const current = parseFloat(offer.currentAmount);
    if (!isNaN(asking) && !isNaN(current) && asking > 0) {
      priceDiffPercent = Math.round(((current - asking) / asking) * 100);
    }
  }

  return (
    <div className="w-full max-w-full mx-auto">
      <AnimationWrapper type="fade-up">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/seller/offer-receieved"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Offers Received</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="relative group mb-8">
          <div className="absolute -inset-px bg-linear-to-r from-white/10 via-[#E78F23]/20 to-white/10 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none" />

          <div className="relative bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold font-montserrat tracking-tight text-white">
                  Offer Details
                </h1>
                <StatusBadge status={offer.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <span>ID: {offer.id}</span>
                <button
                  onClick={handleCopyId}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Copy Offer ID"
                >
                  {copiedId ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Action Header Buttons */}
            {isPending && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {accepting ? (
                    <Loader2 size={16} className="animate-spin text-black" />
                  ) : (
                    <Check size={16} strokeWidth={3} />
                  )}
                  <span>{accepting ? "Accepting..." : "Accept Offer"}</span>
                </button>

                <button
                  disabled={accepting}
                  className="px-5 py-3 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 text-[#E78F23] hover:bg-[#E78F23] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCcw size={16} strokeWidth={2.5} />
                  <span>Counter</span>
                </button>

                <button
                  disabled={accepting}
                  className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} strokeWidth={2.5} />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stat Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Current Offer Card */}
          <div className="relative group bg-[#111113] rounded-2xl border border-[#E78F23]/30 p-6 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={48} className="text-[#E78F23]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Latest Offer Amount
            </p>
            <div className="text-3xl font-black text-[#E78F23] tracking-tight">
              {formattedCurrentAmount}
            </div>
            {priceDiffPercent !== null && (
              <p
                className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${
                  priceDiffPercent >= 0 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                <span>
                  {priceDiffPercent >= 0
                    ? `+${priceDiffPercent}%`
                    : `${priceDiffPercent}%`}
                </span>
                <span className="text-gray-500">vs asking price</span>
              </p>
            )}
          </div>

          {/* Initial Offer Card */}
          <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Initial Offer
            </p>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formattedInitialAmount}
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Starting proposal</p>
          </div>

          {/* Listing Asking Price Card */}
          <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Asking Price
            </p>
            <div className="text-2xl font-bold text-gray-200 tracking-tight">
              {formattedAskingPrice}
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Listed value</p>
          </div>

          {/* Negotiation Rounds Card */}
          <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Negotiation Rounds
            </p>
            <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{offer.roundsCount}</span>
              <span className="text-xs text-gray-500 font-normal">
                {offer.roundsCount === 1 ? "round" : "rounds"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Last update {formatTimeAgo(offer.updatedAt)}
            </p>
          </div>
        </div>

        {/* Main Content Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Primary Details & History Timeline) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Listing Overview Card */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
                  <Tag size={16} />
                  <span>Listing Info</span>
                </div>
                {offer.listing?.slug && (
                  <Link
                    href={`/inventory/${offer.listing.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View Listing</span>
                    <ExternalLink size={13} />
                  </Link>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {offer.listing?.title || `Listing #${offer.listingId}`}
              </h3>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-sm">
                <div>
                  <span className="text-gray-500 text-xs block mb-1">
                    Asking Price
                  </span>
                  <span className="font-bold text-white">
                    {formattedAskingPrice}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block mb-1">
                    Currency
                  </span>
                  <span className="font-bold text-white">{currency}</span>
                </div>
              </div>
            </div>

            {/* Negotiation History & Timeline */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
                  <MessageSquare size={16} />
                  <span>Negotiation History</span>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                  {offer.histories?.length || 0} Events
                </span>
              </div>

              {!offer.histories || offer.histories.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4">
                  No negotiation history recorded yet.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {offer.histories.map((item, index) => {
                    const senderName =
                      [item.sender?.firstName, item.sender?.lastName]
                        .filter(Boolean)
                        .join(" ")
                        .trim() ||
                      (item.senderId === offer.buyerId
                        ? buyerName
                        : item.senderId === offer.sellerId
                        ? sellerName
                        : "User");

                    const isBuyerSender = item.senderId === offer.buyerId;

                    return (
                      <div key={item.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <div
                          className={`absolute -left-[31px] top-1.5 w-5 h-5 rounded-full border-2 bg-[#111113] flex items-center justify-center transition-colors ${
                            index === 0
                              ? "border-[#E78F23] shadow-[0_0_10px_rgba(231,143,35,0.5)]"
                              : "border-white/20"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              index === 0 ? "bg-[#E78F23]" : "bg-white/40"
                            }`}
                          />
                        </div>

                        {/* Event Content Box */}
                        <div className="bg-white/2 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">
                                {senderName}
                              </span>
                              <span className="text-[10px] font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                {isBuyerSender ? "Buyer" : "Seller"}
                              </span>
                            </div>
                            <ActionBadge action={item.action} />
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-400">
                              Proposed Amount:
                            </span>
                            <span className="text-xl font-black text-[#E78F23] tracking-tight">
                              {formatCurrency(item.amount, currency)}
                            </span>
                          </div>

                          {item.note && (
                            <div className="bg-[#18181b] border border-white/5 rounded-lg p-3 text-xs text-gray-300 italic flex items-start gap-2.5">
                              <MessageSquare
                                size={14}
                                className="text-[#E78F23] shrink-0 mt-0.5"
                              />
                              <span>"{item.note}"</span>
                            </div>
                          )}

                          <div className="text-[11px] text-gray-500 pt-1 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>
                              {formatDate(item.createdAt)} (
                              {formatTimeAgo(item.createdAt)})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Deal Information (If Deal Exists) */}
            {offer.deal && (
              <div className="bg-[#111113] rounded-2xl border border-emerald-500/20 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 pb-4 border-b border-white/5">
                  <Handshake size={18} />
                  <span>Initiated Deal</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">
                      Agreed Price
                    </span>
                    <span className="text-2xl font-black text-emerald-400">
                      {formatCurrency(offer.deal.agreedPrice, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">
                      Stage
                    </span>
                    <span className="inline-block px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
                      {offer.deal.stage}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">
                      Deal ID
                    </span>
                    <span className="font-mono text-xs text-gray-300">
                      {offer.deal.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">
                      Created Date
                    </span>
                    <span className="text-xs text-gray-300">
                      {formatDate(offer.deal.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (User Info & Metadata Sidebar) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Buyer Profile Card */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23] mb-6 pb-4 border-b border-white/5">
                <User size={16} />
                <span>Buyer Information</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E78F23]/10 border border-[#E78F23]/20 flex items-center justify-center text-[#E78F23] font-bold text-xl shrink-0">
                  {buyerInitial}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="font-bold text-lg text-white truncate">
                    {buyerName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-xs text-gray-400">
                      Verified Buyer
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-gray-500 truncate">
                    ID: {offer.buyerId}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Profile Card */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 pb-4 border-b border-white/5">
                <Building size={16} />
                <span>Seller Information</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-white">{sellerName}</h4>
                <p className="text-[11px] font-mono text-gray-500">
                  ID: {offer.sellerId}
                </p>
              </div>
            </div>

            {/* Offer Metadata & Timestamps */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pb-4 border-b border-white/5">
                <Calendar size={16} />
                <span>Timestamps & Metadata</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Submitted On</span>
                  <span className="text-gray-300 font-medium">
                    {formatDate(offer.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Last Modified</span>
                  <span className="text-gray-300 font-medium">
                    {formatDate(offer.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Total Rounds</span>
                  <span className="text-gray-300 font-medium">
                    {offer.roundsCount}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Listing ID</span>
                  <span className="font-mono text-gray-400 truncate max-w-[150px]">
                    {offer.listingId}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Action Guidance Box */}
            <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 shadow-2xl">
              {isAccepted ? (
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-white text-base">
                    Offer Accepted
                  </h4>
                  <p className="text-xs text-gray-400">
                    This offer has been accepted and a deal is now in progress. You can track progress in your deals dashboard.
                  </p>
                </div>
              ) : isCountered ? (
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                    <Clock size={24} className="animate-pulse" />
                  </div>
                  <h4 className="font-bold text-white text-base">
                    Awaiting Buyer Response
                  </h4>
                  <p className="text-xs text-gray-400">
                    A counter offer has been submitted. The buyer will review your terms soon.
                  </p>
                </div>
              ) : isPending ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E78F23]">
                    <Clock size={16} />
                    <span>Action Required</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Review the buyer's offer carefully. You can accept to start a deal, send a counter offer, or decline.
                  </p>
                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {accepting ? (
                      <Loader2 size={16} className="animate-spin text-black" />
                    ) : (
                      <Check size={16} strokeWidth={3} />
                    )}
                    <span>{accepting ? "Accepting..." : "Accept Offer"}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <h4 className="font-bold text-gray-300 text-sm">
                    Offer Status: {offer.status}
                  </h4>
                  <p className="text-xs text-gray-500">
                    This offer is no longer pending active negotiation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

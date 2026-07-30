"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  RefreshCcw,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Handshake,
  Loader2,
  ShieldCheck,
  Building,
  Copy,
  CheckCircle2,
  Send,
  XCircle,
  Flag,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import CounterOfferModal from "../CounterOfferModal";
import {
  useOfferDetailQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} from "@/hooks/useOffers";
import {
  useDealsQuery,
  useDealDetailQuery,
  useDealMessagesQuery,
  useSendDealMessageMutation,
  useUpdateDealStageMutation,
} from "@/hooks/useDeals";
import { DealMessage, DealStage } from "@/lib/api/deals";
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
  const rawId = params?.id;
  const offerId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  const [accepting, setAccepting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const chatScrollRef = React.useRef<HTMLDivElement>(null);

  const {
    data: offer,
    isLoading,
    isError,
    refetch,
  } = useOfferDetailQuery(offerId);

  const { data: dealsResponse } = useDealsQuery({ page: 1, limit: 10 });
  const dealsList = dealsResponse?.data || [];
  const matchedDeal = dealsList.find(
    (d) => d.offerId === offerId || d.id === offerId,
  );
  const targetDealId = matchedDeal?.id || offer?.deal?.id || offer?.id || "";

  const { data: dealDetail } = useDealDetailQuery(targetDealId);
  const { data: dealMessages = [] } = useDealMessagesQuery(targetDealId);

  const [rejecting, setRejecting] = useState(false);

  const { mutate: acceptOffer } = useAcceptOfferMutation();
  const { mutate: rejectOffer } = useRejectOfferMutation();
  const sendDealMessageMutation = useSendDealMessageMutation();
  const updateDealStageMutation = useUpdateDealStageMutation();

  const [updatingStage, setUpdatingStage] = useState<DealStage | null>(null);

  const currentStage = (
    dealDetail?.stage ||
    offer?.deal?.stage ||
    matchedDeal?.stage ||
    ""
  ).toUpperCase() as DealStage | "";

  const handleUpdateStage = async (stage: DealStage) => {
    if (!targetDealId) {
      toast.error("No active deal found associated with this offer yet.");
      return;
    }

    setUpdatingStage(stage);
    try {
      const adminNotesMap: Record<DealStage, string> = {
        COMPLETED: "Escrow verification complete. Title transfer confirmed.",
        CANCELLED: "Deal cancelled by seller.",
        FLAGGED: "Deal flagged for review by seller.",
      };

      await updateDealStageMutation.mutateAsync({
        dealId: targetDealId,
        payload: {
          stage,
          adminNotes: adminNotesMap[stage],
          isFlagged: stage === "FLAGGED",
        },
      });
      refetch();
    } catch {
      // Handled in mutation onError toast
    } finally {
      setUpdatingStage(null);
    }
  };

  React.useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [offer?.histories, dealMessages, dealDetail]);

  const handleAccept = () => {
    if (!offerId) return;
    setAccepting(true);
    acceptOffer(offerId, {
      onSettled: () => {
        setAccepting(false);
      },
    });
  };

  const handleReject = () => {
    if (!offerId) return;
    setRejecting(true);
    rejectOffer(offerId, {
      onSettled: () => {
        setRejecting(false);
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
          <AlertCircle
            size={56}
            className="mx-auto text-rose-500 stroke-[1.5]"
          />
          <h2 className="text-2xl font-bold text-white">Offer Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            We couldn't load the details for this offer. It may have been
            deleted or the URL might be invalid.
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
    offer.status?.toUpperCase() === "ACTION REQUIRED" ||
    offer.status?.toUpperCase() === "COUNTERED";
  const isAccepted = offer.status?.toUpperCase() === "ACCEPTED";
  const allowCounterOffers = offer.listing?.allowCounterOffers === true;

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
  const buyerInitial = (offer.buyer?.firstName || offer.buyer?.lastName || "B")
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

  // Combine & format messages for deal conversation section
  const embeddedDealMessages: DealMessage[] = [
    ...((matchedDeal as any)?.messages || []),
    ...((offer?.deal as any)?.messages || []),
    ...((dealDetail as any)?.messages || []),
  ];

  const rawDealMessagesList = [
    ...embeddedDealMessages,
    ...(dealMessages || []),
  ];

  const uniqueMessagesMap = new Map<string, DealMessage>();
  rawDealMessagesList.forEach((m) => {
    if (m && m.id) {
      uniqueMessagesMap.set(m.id, m);
    }
  });
  const combinedDealMessages = Array.from(uniqueMessagesMap.values());

  const formattedDealMessages = combinedDealMessages.map((m) => {
    const isSeller =
      m.senderId === offer.sellerId || m.sender?.role === "SELLER";
    const senderFirstName =
      m.sender?.firstName ||
      (isSeller
        ? offer.seller?.firstName || "Seller"
        : offer.buyer?.firstName || "Buyer");
    const senderLastName =
      m.sender?.lastName ||
      (isSeller ? offer.seller?.lastName || "" : offer.buyer?.lastName || "");
    const senderFullName = `${senderFirstName} ${senderLastName}`.trim();
    const senderRole = m.sender?.role || (isSeller ? "SELLER" : "BUYER");

    return {
      id: `chat-${m.id}`,
      type: "chat" as const,
      senderId: m.senderId,
      senderName: senderFullName,
      senderRole: senderRole,
      senderAvatar:
        m.sender?.avatarUrl ||
        (isSeller ? offer.seller?.avatarUrl : offer.buyer?.avatarUrl),
      text: m.message,
      amount: undefined as string | undefined,
      action: undefined as string | undefined,
      createdAt: m.createdAt,
    };
  });

  const formattedHistories = (offer.histories || []).map((h) => {
    const isBuyer = h.senderId === offer.buyerId;
    return {
      id: `history-${h.id}`,
      type: "history" as const,
      senderId: h.senderId,
      senderName: isBuyer
        ? buyerName
        : `${h.sender?.firstName || sellerName} ${h.sender?.lastName || ""}`.trim(),
      senderRole: isBuyer ? "BUYER" : "SELLER",
      senderAvatar: isBuyer ? offer.buyer?.avatarUrl : offer.seller?.avatarUrl,
      text: h.note || `Offer updated to ${formatCurrency(h.amount, currency)}`,
      amount: h.amount as string | undefined,
      action: h.action as string | undefined,
      createdAt: h.createdAt,
    };
  });

  const combinedTimeline = [
    ...formattedHistories,
    ...formattedDealMessages,
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    const activeDealId = targetDealId || offer.deal?.id || offer.id;
    if (!activeDealId) {
      toast.error("Unable to send message: Deal identifier is missing.");
      return;
    }

    try {
      await sendDealMessageMutation.mutateAsync({
        dealId: activeDealId,
        message: trimmed,
      });
      setMessageInput("");
    } catch {
      // Handled in mutation onError toast
    }
  };

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

                {allowCounterOffers && (
                  <button
                    onClick={() => setCounterModalOpen(true)}
                    disabled={accepting}
                    className="px-5 py-3 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 text-primary hover:bg-[#E78F23] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCcw size={16} strokeWidth={2.5} />
                    <span>Counter</span>
                  </button>
                )}

                <button
                  onClick={handleReject}
                  disabled={accepting || rejecting}
                  className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejecting ? (
                    <Loader2 size={16} className="animate-spin text-rose-400" />
                  ) : (
                    <X size={16} strokeWidth={2.5} />
                  )}
                  <span>{rejecting ? "Rejecting..." : "Reject"}</span>
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
            <div className="text-3xl font-black text-primary tracking-tight">
              {formattedCurrentAmount}
            </div>
            {priceDiffPercent !== null && (
              <p
                className={`text-[11px] font-semibold mt-2 flex items-center gap-1 ${
                  priceDiffPercent >= 0 ? "text-emerald-400" : "text-primary"
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
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-primary">
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
                          className={`absolute -left-7.75 top-1.5 w-5 h-5 rounded-full border-2 bg-[#111113] flex items-center justify-center transition-colors ${
                            index === 0
                              ? "border-primary shadow-[0_0_10px_rgba(231,143,35,0.5)]"
                              : "border-white/20"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              index === 0 ? "bg-primary" : "bg-white/40"
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
                            <span className="text-xl font-black text-primary tracking-tight">
                              {formatCurrency(item.amount, currency)}
                            </span>
                          </div>

                          {item.note && (
                            <div className="bg-[#18181b] border border-white/5 rounded-lg p-3 text-xs text-gray-300 italic flex items-start gap-2.5">
                              <MessageSquare
                                size={14}
                                className="text-primary shrink-0 mt-0.5"
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
                      {currentStage || offer.deal.stage}
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

            {/* Conversation & Live Chat Section (Shown when offer is accepted or deal exists) */}
            {(isAccepted || offer.deal) && (
              <div className="bg-[#111113] rounded-2xl border border-[#E78F23]/20 p-6 md:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
                    <MessageSquare size={16} />
                    <span>Deal Conversation</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium flex items-center gap-1.5 normal-case tracking-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Chat
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                    {combinedTimeline.length} message
                    {combinedTimeline.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Messages Box */}
                <div
                  ref={chatScrollRef}
                  className="space-y-4 max-h-105 overflow-y-auto pr-2 custom-scrollbar"
                >
                  {combinedTimeline.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm flex flex-col items-center gap-2">
                      <MessageSquare
                        size={28}
                        className="text-gray-600 stroke-[1.5]"
                      />
                      <span>
                        No conversation messages recorded yet. Send a message
                        below to communicate with the buyer.
                      </span>
                    </div>
                  ) : (
                    combinedTimeline.map((item) => {
                      const isSelf =
                        item.senderId === offer.sellerId ||
                        item.senderRole === "SELLER";
                      return (
                        <div
                          key={item.id}
                          className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                              item.type === "history"
                                ? isSelf
                                  ? "bg-[#E78F23]/10 border border-[#E78F23]/25 text-white rounded-br-none"
                                  : "bg-white/5 border border-white/10 text-white/90 rounded-bl-none"
                                : isSelf
                                  ? "bg-[#E78F23]/15 border border-[#E78F23]/35 text-white rounded-br-none shadow-[0_0_15px_rgba(231,143,35,0.05)]"
                                  : "bg-white/5 border border-white/15 text-white/90 rounded-bl-none"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 mb-1.5">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-[#E78F23] flex items-center gap-1.5">
                                {isSelf ? "You (Seller)" : item.senderName}
                                {item.senderRole && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-gray-300 font-mono">
                                    {item.senderRole}
                                  </span>
                                )}
                              </div>
                              {item.amount && (
                                <span className="text-[10px] font-bold text-[#E78F23] bg-[#E78F23]/10 px-2 py-0.5 rounded">
                                  {formatCurrency(item.amount, currency)}
                                </span>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap">{item.text}</p>
                            <div className="text-[10px] text-gray-500 mt-2 flex items-center justify-between gap-2">
                              <span>{formatDate(item.createdAt)}</span>
                              {item.type === "history" && (
                                <span className="italic text-[9px] text-[#E78F23]/70">
                                  Offer Event
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <div className="pt-3 border-t border-white/5">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message to the buyer..."
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3.5 px-4 pr-12 text-xs md:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E78F23] transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        sendDealMessageMutation.isPending ||
                        !messageInput.trim()
                      }
                      className="absolute right-2 p-2 rounded-lg bg-[#E78F23] hover:bg-[#E78F23]/90 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {sendDealMessageMutation.isPending ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-black"
                        />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (User Info & Metadata Sidebar) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Deal Stage Action Card (Shown only if offer is accepted or deal exists) */}
            {(isAccepted || Boolean(offer.deal)) && (
              <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
                    <Handshake size={16} />
                    <span>Deal Stage</span>
                  </div>
                  {currentStage && (
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
                        currentStage === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : currentStage === "CANCELLED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                          : currentStage === "FLAGGED"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/25"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentStage === "COMPLETED"
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse"
                            : currentStage === "CANCELLED"
                            ? "bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                            : currentStage === "FLAGGED"
                            ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse"
                            : "bg-gray-400"
                        }`}
                      />
                      {currentStage}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Update the deal progression status below.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  {/* COMPLETED Button */}
                  <button
                    type="button"
                    onClick={() => handleUpdateStage("COMPLETED")}
                    disabled={
                      updateDealStageMutation.isPending ||
                      currentStage === "COMPLETED"
                    }
                    title="Mark deal as COMPLETED"
                    className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                      currentStage === "COMPLETED"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        : "bg-white/5 hover:bg-emerald-500/10 border-white/10 text-gray-300 hover:text-emerald-400 hover:border-emerald-500/30"
                    } disabled:opacity-50 cursor-pointer active:scale-95`}
                  >
                    {updatingStage === "COMPLETED" ? (
                      <Loader2 size={18} className="animate-spin text-emerald-400" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    <span className="text-[10px]">Completed</span>
                  </button>

                  {/* CANCELLED Button */}
                  <button
                    type="button"
                    onClick={() => handleUpdateStage("CANCELLED")}
                    disabled={
                      updateDealStageMutation.isPending ||
                      currentStage === "CANCELLED"
                    }
                    title="Mark deal as CANCELLED"
                    className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                      currentStage === "CANCELLED"
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        : "bg-white/5 hover:bg-rose-500/10 border-white/10 text-gray-300 hover:text-rose-400 hover:border-rose-500/30"
                    } disabled:opacity-50 cursor-pointer active:scale-95`}
                  >
                    {updatingStage === "CANCELLED" ? (
                      <Loader2 size={18} className="animate-spin text-rose-400" />
                    ) : (
                      <XCircle size={18} />
                    )}
                    <span className="text-[10px]">Cancelled</span>
                  </button>

                  {/* FLAGGED Button */}
                  <button
                    type="button"
                    onClick={() => handleUpdateStage("FLAGGED")}
                    disabled={
                      updateDealStageMutation.isPending ||
                      currentStage === "FLAGGED"
                    }
                    title="Mark deal as FLAGGED"
                    className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                      currentStage === "FLAGGED"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        : "bg-white/5 hover:bg-amber-500/10 border-white/10 text-gray-300 hover:text-amber-400 hover:border-amber-500/30"
                    } disabled:opacity-50 cursor-pointer active:scale-95`}
                  >
                    {updatingStage === "FLAGGED" ? (
                      <Loader2 size={18} className="animate-spin text-amber-400" />
                    ) : (
                      <Flag size={18} />
                    )}
                    <span className="text-[10px]">Flagged</span>
                  </button>
                </div>
              </div>
            )}
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
          </div>
        </div>
      </AnimationWrapper>

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        offer={offer}
      />
    </div>
  );
}

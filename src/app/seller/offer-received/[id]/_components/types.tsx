import React from "react";
import {
  Clock,
  RefreshCcw,
  CheckCircle2,
  X,
} from "lucide-react";
import type { OfferDetailItem } from "@/lib/api/offers";
import type { DealStage } from "@/lib/api/deals";

export interface TimelineMessageItem {
  id: string;
  type: "history" | "chat";
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string | null;
  text: string;
  amount?: string;
  action?: string;
  createdAt: string;
}

export function StatusBadge({ status }: { status?: string }) {
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
}

export function ActionBadge({ action }: { action?: string }) {
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
}

export function formatCurrency(amount?: string | number, currency = "USD"): string {
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
}

export function formatDate(dateString?: string): string {
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
}

export function formatTimeAgo(dateString?: string): string {
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
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export interface OfferHeaderCardProps {
  offer: OfferDetailItem;
  isPending: boolean;
  allowCounterOffers: boolean;
  accepting: boolean;
  rejecting: boolean;
  copiedId: boolean;
  onCopyId: () => void;
  onAccept: () => void;
  onOpenCounterModal: () => void;
  onReject: () => void;
}

export interface OfferStatsGridProps {
  formattedCurrentAmount: string;
  formattedInitialAmount: string;
  formattedAskingPrice: string;
  priceDiffPercent: number | null;
  roundsCount?: number;
  updatedAt?: string;
}

export interface OfferTimelineSectionProps {
  offer: OfferDetailItem;
  currency: string;
  formattedAskingPrice: string;
  buyerName: string;
  sellerName: string;
}

export interface OfferConversationSectionProps {
  offer: OfferDetailItem;
  combinedTimeline: TimelineMessageItem[];
  currency: string;
  messageInput: string;
  isSending: boolean;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
  onMessageInputChange: (val: string) => void;
  onSendMessage: () => void;
}

export interface OfferSidebarSectionProps {
  offer: OfferDetailItem;
  isAccepted: boolean;
  currentStage: DealStage | "";
  updatingStage: DealStage | null;
  isUpdatingStage: boolean;
  buyerInitial: string;
  buyerName: string;
  sellerName: string;
  onUpdateStage: (stage: DealStage) => void;
}

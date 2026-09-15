import React from "react";
import { Gauge, TrendingUp, Zap, Fuel, Calendar, Tag, Layers, ShieldCheck } from "lucide-react";
import type { ListingItem } from "@/lib/api/listings";

export type Listing = ListingItem;

export interface ListingGalleryProps {
  listing: Listing;
}

export interface ListingSpecsGridProps {
  listing: Listing;
}

export interface ListingSellerCardProps {
  listing: Listing;
  children?: React.ReactNode;
}

export interface AdminModerationCardProps {
  listing: Listing;
  onOpenRejectModal: () => void;
}

export const formatPrice = (priceStr?: string | number, currency = "USD"): string => {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

export const formatSubmittedDate = (dateString?: string): string => {
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

export const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
};

export const getSpecIcon = (label: string): React.ElementType => {
  const lower = label.toLowerCase();
  if (lower.includes("mileage") || lower.includes("km") || lower.includes("odometer")) return Gauge;
  if (lower.includes("0-100") || lower.includes("speed") || lower.includes("acceleration"))
    return TrendingUp;
  if (
    lower.includes("power") ||
    lower.includes("hp") ||
    lower.includes("bhp") ||
    lower.includes("kw")
  )
    return Zap;
  if (lower.includes("engine") || lower.includes("fuel") || lower.includes("motor")) return Fuel;
  if (lower.includes("year") || lower.includes("build")) return Calendar;
  if (lower.includes("brand") || lower.includes("make") || lower.includes("model")) return Tag;
  if (lower.includes("category") || lower.includes("type")) return Layers;
  return ShieldCheck;
};

export const getStatusBadge = (status?: string): { label: string; className: string } => {
  const norm = (status || "").toUpperCase();
  if (norm === "PENDING_APPROVAL" || norm === "PENDING") {
    return {
      label: "Pending Approval",
      className: "border border-primary bg-primary/10 text-primary",
    };
  }
  if (norm === "LIVE" || norm === "APPROVED") {
    return {
      label: "Approved",
      className: "border border-green-500 bg-green-500/10 text-green-400",
    };
  }
  if (norm === "REJECTED") {
    return {
      label: "Rejected",
      className: "border border-red-500 bg-red-500/10 text-red-400",
    };
  }
  return {
    label: status || "Unknown",
    className: "border border-gray-500 bg-gray-500/10 text-gray-400",
  };
};

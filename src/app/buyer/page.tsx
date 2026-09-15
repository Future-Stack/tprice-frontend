"use client";

import React from "react";
import Link from "next/link";
import {
  Gavel,
  BadgePercent,
  Heart,
  Eye,
  MapPin,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

import AnimationWrapper from "../components/AnimationWrapper";
import { useBuyerDashboardQuery } from "@/hooks/useBuyerDashboard";
import {
  BuyerActiveBid,
  BuyerRecentActivity,
  BuyerSavedItem
} from "@/lib/api/buyerDashboard";

/* ─── Helper Functions ─── */
const formatCurrency = (amount?: number | string, currency = "USD") => {
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
    return `$${num.toLocaleString("en-US")}`;
  }
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateString;
  }
};

const getBidStatusBadge = (status: string) => {
  const normalized = status?.toUpperCase();
  if (normalized === "LEADING") {
    return (
      <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
        Leading
      </span>
    );
  }
  if (normalized === "OUTBID") {
    return (
      <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
        Outbid
      </span>
    );
  }
  return (
    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
      {status || "Pending"}
    </span>
  );
};

export default function Home() {
  const { data, isLoading, isError, error, refetch } = useBuyerDashboardQuery();

  if (isLoading) {
    return <BuyerDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#1C1C1E] border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-clash font-semibold text-white">
            Failed to load Buyer Dashboard
          </h3>
          <p className="text-sm text-gray-400">
            {(error as any)?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred while connecting to the server."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-xl transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = data?.user;
  const stats = data?.stats;
  const activeBids = data?.activeBids || [];
  const recentActivity = data?.recentActivity || [];
  const savedItems = data?.savedItems || [];

  return (
    <div className="space-y-8 relative z-0">
      {/* ── Header ── */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[32px] sm:text-[40px] font-clash font-medium tracking-wide text-white capitalize">
                Welcome back, {user?.name || "Buyer"}
              </h2>
              {user?.vipStatus && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> VIP
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Here is an overview of your active bids, activity, and saved items.
            </p>
          </div>
        </div>
      </AnimationWrapper>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
          <StatCard
            icon={<Gavel className="text-primary w-6 h-6" />}
            count={stats?.activeBidsCount ?? 0}
            label="Active Bids"
            href="/buyer/mybids"
          />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
          <StatCard
            icon={<BadgePercent className="text-primary w-6 h-6" />}
            count={stats?.offersMadeCount ?? 0}
            label="Offers Made"
            href="/buyer/my-offer"
          />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.15}>
          <StatCard
            icon={<Heart className="text-primary w-6 h-6" />}
            count={stats?.savedItemsCount ?? 0}
            label="Saved Items"
            href="/buyer/saved-items"
          />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
          <StatCard
            icon={<Eye className="text-primary w-6 h-6" />}
            count={stats?.recentViewsCount ?? 0}
            label="Recent Views"
            href="/buyer/marketplace"
          />
        </AnimationWrapper>
      </div>

      {/* ── Two Column Layout (Active Bids & Recent Activity) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Bids */}
        <AnimationWrapper type="fade-right" duration={0.6} delay={0.1}>
          <div
            className="bg-foreground p-7 rounded-2xl border border-primary/30 shadow-xl hover:border-[#E78F23]/20 transition-colors h-full flex flex-col justify-between"
            style={{
              boxShadow:
                "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-clash font-medium text-white">Your Active Bids</h3>
                  <span className="bg-[#D98728] text-white text-[11px] font-bold min-w-5.5 h-5.5 px-1.5 flex items-center justify-center rounded">
                    {activeBids.length}
                  </span>
                </div>
                <Link
                  href="/buyer/mybids"
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {activeBids.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No active bids at the moment.
                </div>
              ) : (
                <div className="space-y-6">
                  {activeBids.map((bid: BuyerActiveBid, index: number) => (
                    <div
                      key={bid.id || index}
                      className={`${
                        index !== activeBids.length - 1
                          ? "border-b border-[#2C2C2E]/60 pb-6"
                          : "pt-2"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <Link
                          href={`/buyer/marketplace/${bid.listingId}`}
                          className="font-semibold text-gray-200 hover:text-primary transition-colors line-clamp-1"
                        >
                          {bid.listingTitle}
                        </Link>
                        {getBidStatusBadge(bid.status)}
                      </div>
                      <div className="flex justify-between text-[13px] mt-2">
                        <span className="text-gray-400 font-medium">
                          Your bid:{" "}
                          <strong className="text-white">
                            {formatCurrency(bid.yourBid)}
                          </strong>
                        </span>
                        <span className="text-gray-400 font-medium">
                          Current highest:{" "}
                          <strong className="text-white">
                            {formatCurrency(bid.currentHighest)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimationWrapper>

        {/* Recent Activity */}
        <AnimationWrapper type="fade-left" duration={0.6} delay={0.15}>
          <div
            className="bg-foreground p-7 rounded-2xl border border-primary/30 shadow-xl hover:border-[#E78F23]/20 transition-colors h-full flex flex-col justify-between"
            style={{
              boxShadow:
                "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
            }}
          >
            <div>
              <h3 className="text-xl font-clash font-medium mb-8 text-white">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No recent activity recorded.
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((act: BuyerRecentActivity, index: number) => (
                    <div
                      key={act.id || index}
                      className={`flex justify-between items-center gap-4 ${
                        index !== recentActivity.length - 1
                          ? "border-b border-[#2C2C2E]/60 pb-6"
                          : "pt-2"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-200 m-0 text-[15px] truncate">
                          {act.title}
                        </h4>
                        <p className="text-[13px] text-gray-400 mt-1 line-clamp-2">
                          {act.message}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1.5 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTimeAgo(act.createdAt)}
                        </p>
                      </div>
                      {act.targetUrl && (
                        <Link
                          href={act.targetUrl}
                          className="px-4 py-2 border border-primary/60 rounded-lg text-[13px] font-medium text-white hover:bg-primary hover:border-primary transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                        >
                          View Details <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* ── Saved Items Section ── */}
      <div
        className="pt-6 bg-foreground p-6 sm:p-8 rounded-2xl"
        style={{
          boxShadow:
            "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
        }}
      >
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h3 className="text-[28px] sm:text-[32px] font-clash font-medium text-white">
                Saved Items
              </h3>
              <span className="bg-[#D98728] text-white text-[11px] font-bold min-w-5.5 h-5.5 px-1.5 flex items-center justify-center rounded">
                {savedItems.length}
              </span>
            </div>
            <Link
              href="/buyer/saved-items"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
            >
              View All Saved <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimationWrapper>

        {savedItems.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-base font-medium">You haven&apos;t saved any items yet.</p>
            <p className="text-xs text-gray-500 mt-1">
              Explore the marketplace to bookmark luxury assets.
            </p>
            <Link
              href="/buyer/marketplace"
              className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedItems.map((item: BuyerSavedItem, index: number) => {
              const primaryImage =
                item.media?.[0]?.url ||
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
              const locationText = [item.locationCity, item.locationCountry]
                .filter(Boolean)
                .join(", ") || "Location N/A";

              return (
                <AnimationWrapper
                  type="zoom"
                  duration={0.5}
                  delay={0.05 * index}
                  key={item.id || index}
                >
                  <ListingCard
                    id={item.id}
                    image={primaryImage}
                    title={item.title}
                    location={locationText}
                    price={formatCurrency(item.askingPrice, item.currency)}
                    status={item.status}
                  />
                </AnimationWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-Components ─── */

function StatCard({
  icon,
  count,
  label,
  href,
}: {
  icon: React.ReactNode;
  count: number | string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-foreground border border-primary/30 p-5 rounded-2xl flex items-center gap-5 transition-all hover:border-primary/50 shadow-card h-[120px] group"
      style={{
        boxShadow:
          "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
      }}
    >
      <div className="w-13 h-13 bg-[#111113] rounded-xl flex items-center justify-center border border-[#3C3C3E] group-hover:scale-105 group-hover:border-primary/40 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-[36px] sm:text-[40px] font-medium font-clash leading-tight text-white">
          {count}
        </div>
        <div className="text-[18px] sm:text-[20px] text-[#FFFDFD] font-normal mt-0.5 opacity-90">
          {label}
        </div>
      </div>
    </Link>
  );
}

function ListingCard({
  id,
  image,
  title,
  location,
  price,
  status,
}: {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  status: string;
}) {
  return (
    <div className="bg-foreground rounded-[8px] border border-primary/30 overflow-hidden group hover:border-[#E78F23]/40 transition-all shadow-xl hover:shadow-[#E78F23]/10 flex flex-col justify-between h-full">
      <div>
        <div className="relative h-[200px] overflow-hidden bg-black">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          />
          {status && (
            <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              {status}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-center text-[11px] text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" /> {location}
            </span>
            <span className="tracking-widest uppercase text-gray-500 shrink-0">Price</span>
          </div>
          <div className="flex justify-between items-center mb-5 gap-2">
            <h4 className="font-semibold font-inter text-[15px] truncate text-white" title={title}>
              {title}
            </h4>
            <span className="font-normal font-inter text-[16px] text-primary whitespace-nowrap">
              {price}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={`/buyer/marketplace/${id}`}
          className="w-full py-2.5 bg-foreground border border-primary text-white hover:bg-primary text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" /> View Details
        </Link>
      </div>
    </div>
  );
}

/* ─── Smooth Skeleton Loading Component ─── */
function BuyerDashboardSkeleton() {
  return (
    <div className="space-y-8 relative z-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-72 bg-[#2C2C2E]/60 rounded-xl"></div>
        <div className="h-4 w-96 bg-[#2C2C2E]/40 rounded-lg"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-foreground/80 border border-[#2C2C2E]/60 p-5 rounded-2xl flex items-center gap-5 h-[120px]"
          >
            <div className="w-13 h-13 bg-[#2C2C2E]/60 rounded-xl shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-8 w-16 bg-[#2C2C2E]/80 rounded-md"></div>
              <div className="h-4 w-24 bg-[#2C2C2E]/50 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Bids Skeleton */}
        <div className="bg-foreground/80 p-7 rounded-2xl border border-[#2C2C2E]/60 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-[#2C2C2E]/80 rounded-md"></div>
            <div className="h-5 w-6 bg-[#2C2C2E]/60 rounded"></div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-[#2C2C2E]/40 pb-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-48 bg-[#2C2C2E]/70 rounded-md"></div>
                  <div className="h-5 w-16 bg-[#2C2C2E]/50 rounded-md"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-[#2C2C2E]/40 rounded-md"></div>
                  <div className="h-4 w-36 bg-[#2C2C2E]/40 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-foreground/80 p-7 rounded-2xl border border-[#2C2C2E]/60 space-y-6">
          <div className="h-6 w-36 bg-[#2C2C2E]/80 rounded-md"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#2C2C2E]/40 pb-5">
                <div className="space-y-2 flex-1 pr-4">
                  <div className="h-5 w-3/4 bg-[#2C2C2E]/70 rounded-md"></div>
                  <div className="h-3.5 w-full bg-[#2C2C2E]/40 rounded-md"></div>
                  <div className="h-3 w-20 bg-[#2C2C2E]/30 rounded-md"></div>
                </div>
                <div className="h-9 w-28 bg-[#2C2C2E]/60 rounded-lg shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Items Skeleton */}
      <div className="bg-foreground/80 p-6 sm:p-8 rounded-2xl border border-[#2C2C2E]/60 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 w-36 bg-[#2C2C2E]/80 rounded-md"></div>
          <div className="h-4 w-24 bg-[#2C2C2E]/50 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1C1C1E] border border-[#2C2C2E]/40 rounded-[8px] overflow-hidden space-y-4 pb-5">
              <div className="h-[200px] bg-[#2C2C2E]/60 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-[#2C2C2E]/40 rounded"></div>
                  <div className="h-3 w-12 bg-[#2C2C2E]/40 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-[#2C2C2E]/60 rounded"></div>
                  <div className="h-4 w-16 bg-[#2C2C2E]/60 rounded"></div>
                </div>
                <div className="h-10 w-full bg-[#2C2C2E]/60 rounded-md mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

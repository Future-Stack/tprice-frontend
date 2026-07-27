"use client";

import React from "react";
import Link from "next/link";
import {
  Gavel,
  BadgePercent,
  List as ListIcon,
  Heart,
  Eye,
  MapPin,
  RefreshCw,
  AlertCircle,
  PackageOpen,
} from "lucide-react";

import AnimationWrapper from "../components/AnimationWrapper";
import { useSellerDashboardQuery } from "@/hooks/useSellerDashboard";

function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

function formatPrice(priceStr?: string | number | null, currencyStr = "USD"): string {
  if (priceStr === undefined || priceStr === null || priceStr === "") return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyStr || "USD",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    const symbol = currencyStr === "EUR" ? "€" : currencyStr === "GBP" ? "£" : "$";
    return `${symbol}${num.toLocaleString()}`;
  }
}

function getStatusBadgeStyle(status: string) {
  const norm = (status || "").toUpperCase();
  switch (norm) {
    case "LIVE":
    case "APPROVED":
    case "ACTIVE":
      return "bg-green-500/10 text-green-500 border border-green-500/20";
    case "DRAFT":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case "PENDING":
    case "PENDING_APPROVAL":
      return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    case "REJECTED":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
  }
}

export default function Home() {
  const { data, isLoading, isError, error, refetch } = useSellerDashboardQuery();

  const userName = data?.user?.name || "Mr. Seller";
  const stats = data?.stats;
  const quickViewListings = data?.quickViewListings || [];
  const recentActivity = data?.recentActivity || [];
  const activeListings = data?.activeListings || [];

  return (
    <div className="space-y-8 relative z-0">
      {/* Header */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-[40px] font-clash font-medium tracking-tight">
              Welcome back, {userName}
            </h2>
          </div>
          {isError && (
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-white rounded-lg text-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Retry Loading
            </button>
          )}
        </div>
      </AnimationWrapper>

      {/* Error Alert if request failed */}
      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between text-red-400 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>
              {(error as any)?.response?.data?.message || "Failed to load seller dashboard data."}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="underline font-medium hover:text-white transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12.5">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
              <StatCard
                icon={<Gavel className="text-primary w-6 h-6" />}
                count={String(stats?.totalListingsCount ?? 0)}
                label="Total Listing"
              />
            </AnimationWrapper>
            <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
              <StatCard
                icon={<ListIcon className="text-primary w-6 h-6" />}
                count={String(stats?.activeListingsCount ?? 0)}
                label="Active Listings"
              />
            </AnimationWrapper>
            <AnimationWrapper type="fade-up" duration={0.5} delay={0.15}>
              <StatCard
                icon={<BadgePercent className="text-primary w-6 h-6" />}
                count={String(stats?.pendingApprovalCount ?? 0)}
                label="Pending Approval"
              />
            </AnimationWrapper>
            <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
              <StatCard
                icon={<Heart className="text-primary w-6 h-6" />}
                count={String(stats?.offersReceivedCount ?? 0)}
                label="Offer Receieved"
              />
            </AnimationWrapper>
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick View Listings */}
        <AnimationWrapper type="fade-right" duration={0.6} delay={0.1}>
          <div
            className="bg-foreground p-7 rounded-2xl border border-primary2/30 shadow-xl hover:border-[#E78F23]/20 transition-colors h-full flex flex-col"
            style={{
              boxShadow:
                "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-clash font-medium">
                Quick View Listings
              </h3>
              <span className="bg-[#D98728] text-white text-[11px] font-bold min-w-5.5 h-5.5 px-1.5 flex items-center justify-center rounded">
                {quickViewListings.length}
              </span>
            </div>

            {isLoading ? (
              <QuickViewSkeleton />
            ) : quickViewListings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <PackageOpen className="w-10 h-10 mb-2 opacity-50 text-primary" />
                <p className="text-sm">No quick view listings available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {quickViewListings.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`pb-6 ${
                      index < quickViewListings.length - 1
                        ? "border-b border-[#2C2C2E]/60"
                        : "pt-2"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-200 line-clamp-1 pr-2">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider shrink-0 ${getStatusBadgeStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] mt-2">
                      <span className="text-gray-400 font-medium">
                        Price: {formatPrice(item.askingPrice, item.currency)}
                      </span>
                      <Link
                        href={`/seller/my-listing`}
                        className="text-primary hover:underline text-xs font-medium"
                      >
                        View List
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimationWrapper>

        {/* Recent Activity */}
        <AnimationWrapper type="fade-left" duration={0.6} delay={0.15}>
          <div
            className="bg-foreground p-7 rounded-2xl border border-primary2/30 shadow-xl hover:border-[#E78F23]/20 transition-colors h-full flex flex-col"
            style={{
              boxShadow:
                "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
            }}
          >
            <h3 className="text-xl font-clash font-medium mb-8">
              Recent Activity
            </h3>
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : recentActivity.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <PackageOpen className="w-10 h-10 mb-2 opacity-50 text-primary" />
                <p className="text-sm">No recent activity recorded</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className={`flex justify-between items-center gap-4 ${
                      index < recentActivity.length - 1
                        ? "border-b border-[#2C2C2E]/60 pb-6"
                        : "pt-2"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-200 m-0 text-[16px] mb-1 truncate">
                        {activity.title}
                      </h4>
                      <p className="text-[13px] text-gray-300 line-clamp-2">
                        {activity.message}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-1.5 font-medium">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                    {activity.targetUrl && (
                      <Link
                        href={activity.targetUrl}
                        className="px-4 py-2 border border-primary rounded-lg text-[13px] font-medium text-white hover:bg-[#2C2C2E] transition-colors hover:text-white cursor-pointer shrink-0 inline-block text-center"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimationWrapper>
      </div>

      {/* Active Listing Row */}
      <div
        className="pt-4 bg-foreground p-8 rounded-2xl"
        style={{
          boxShadow:
            "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
        }}
      >
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-[32px] font-clash font-medium">
              Active Listing
            </h3>
            <span className="bg-[#D98728] text-white text-[11px] font-bold min-w-5.5 h-5.5 px-1.5 flex items-center justify-center rounded">
              {activeListings.length}
            </span>
          </div>
        </AnimationWrapper>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
          </div>
        ) : activeListings.length === 0 ? (
          <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <PackageOpen className="w-12 h-12 mb-3 text-primary/50" />
            <p className="text-base font-medium">No active listings available</p>
            <p className="text-xs text-gray-500 mt-1">Your active listings will appear here once approved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeListings.map((item, index) => {
              const locationStr = [item.locationCity, item.locationCountry]
                .filter(Boolean)
                .join(", ");
              const imageUrl =
                item.media?.[0]?.url ||
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";

              return (
                <AnimationWrapper
                  key={item.id || index}
                  type="zoom"
                  duration={0.5}
                  delay={0.1 + index * 0.05}
                >
                  <ListingCard
                    image={imageUrl}
                    title={item.title}
                    location={locationStr || "Location N/A"}
                    price={formatPrice(item.askingPrice, item.currency)}
                    active={item.status === "LIVE"}
                    slug={item.slug}
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

function StatCard({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode;
  count: string;
  label: string;
}) {
  return (
    <div
      className="bg-foreground border border-primary2/30 p-5 rounded-2xl flex items-center gap-5 transition-all cursor-default shadow-card h-50.75"
      style={{
        boxShadow:
          "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
      }}
    >
      <div className="w-13 h-13 bg-[#111113] rounded-xl flex items-center justify-center border border-[#3C3C3E] shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[40px] font-medium font-clash leading-tight truncate">
          {count}
        </div>
        <div className="text-[24px] text-[#FFFDFD] font-normal mt-0.5 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

function ListingCard({
  image,
  title,
  location,
  price,
  active = false,
  slug,
}: {
  image: string;
  title: string;
  location: string;
  price: string;
  active?: boolean;
  slug?: string;
}) {
  return (
    <div className="bg-foreground rounded-[8px] border border-primary2/30 overflow-hidden group hover:border-[#E78F23]/20 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col h-full">
      <div className="relative h-54.25 overflow-hidden bg-black shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />

        {active && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
            Active
          </div>
        )}
      </div>
      <div className="p-5 relative mt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[11px] text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {location}
            </span>
            <span className="tracking-widest uppercase text-gray-500 shrink-0">Price</span>
          </div>
          <div className="flex justify-between items-center mb-5 gap-2">
            <h4 className="font-semibold font-inter text-[15px] truncate text-white">
              {title}
            </h4>
            <span className="font-normal font-inter text-[17px] text-white shrink-0">
              {price}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href={slug ? `/inventory/${slug}` : `/seller/my-listing`}
            className="w-full py-2.5 bg-foreground border border-primary text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors hover:bg-primary/10 hover:text-white"
          >
            <Eye className="w-4 h-4" /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div
      className="bg-foreground border border-primary2/30 p-5 rounded-2xl flex items-center gap-5 shadow-card h-50.75 animate-pulse"
      style={{
        boxShadow:
          "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)",
      }}
    >
      <div className="w-13 h-13 bg-white/10 rounded-xl shrink-0" />
      <div className="space-y-3 flex-1 min-w-0">
        <div className="h-9 w-20 bg-white/10 rounded-md" />
        <div className="h-6 w-32 bg-white/10 rounded-md" />
      </div>
    </div>
  );
}

function QuickViewSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="border-b border-[#2C2C2E]/60 pb-6 animate-pulse">
          <div className="flex justify-between items-start mb-2">
            <div className="h-5 w-40 bg-white/10 rounded" />
            <div className="h-5 w-16 bg-white/10 rounded" />
          </div>
          <div className="flex justify-between text-[13px] mt-3">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b border-[#2C2C2E]/60 pb-6 animate-pulse"
        >
          <div className="space-y-2.5 flex-1 pr-4">
            <div className="h-5 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-9 w-28 bg-white/10 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="bg-foreground rounded-[8px] border border-primary2/30 overflow-hidden shadow-xl animate-pulse flex flex-col h-full">
      <div className="h-54.25 bg-white/10 w-full shrink-0" />
      <div className="p-5 mt-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-24 bg-white/10 rounded" />
            <div className="h-3.5 w-12 bg-white/10 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-white/10 rounded" />
            <div className="h-5 w-20 bg-white/10 rounded" />
          </div>
        </div>
        <div className="pt-2">
          <div className="h-9 w-full bg-white/10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

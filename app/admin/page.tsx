"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Handshake,
  ListOrdered,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useGetAdminDashboardOverviewQuery } from "@/hooks/useAdminDashboard";
import { useAuthStore } from "@/lib/store/useAuthStore";

// Helpers
function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

function formatPrice(priceStr?: string | number | null, currencyStr = "USD"): string {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currencyStr === "EUR" ? "€" : currencyStr === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
}

function formatActivityAction(action: string): string {
  if (!action) return "Activity";
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getActivityDescription(activity: any): string {
  const changes = activity.changes || {};
  if (activity.action === "LISTING_APPROVED") {
    return changes.status
      ? `Listing status: ${changes.status}${changes.approvedBy ? ` (${changes.approvedBy})` : ""}`
      : "Listing approved";
  }
  if (activity.action === "DEALER_APPROVAL") {
    return changes.status
      ? `Dealer profile status: ${changes.status}`
      : "Dealer profile approved";
  }
  if (activity.action === "USER_ROLE_UPDATED") {
    return changes.newRole
      ? `Role updated to ${changes.newRole} (was ${changes.previousRole || "BUYER"})`
      : "User role updated";
  }
  if (activity.action === "VIP_STATUS_GRANTED") {
    return changes.vipStatus !== undefined
      ? `VIP Status: ${changes.vipStatus ? "Granted" : "Revoked"}`
      : "VIP Status updated";
  }
  if (activity.action === "EVENT_CREATED") {
    return changes.title ? `Event: ${changes.title}` : "New event created";
  }
  return `Resource: ${activity.resource || "Item"}`;
}

function getActivityStatusType(action: string, changes?: any): "new" | "approved" | "closed" | "rejected" {
  const upper = (action || "").toUpperCase();
  if (upper.includes("REJECT") || upper.includes("FLAG")) return "rejected";
  if (
    upper.includes("APPROV") ||
    upper.includes("GRANT") ||
    changes?.status === "APPROVED" ||
    changes?.status === "LIVE"
  )
    return "approved";
  if (upper.includes("CLOSE") || upper.includes("UPDATE") || upper.includes("ROLE")) return "closed";
  return "new";
}

function formatStage(stage: string): string {
  if (!stage) return "Active";
  return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
}

// Skeleton Loaders
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[#111113] border border-white/5 rounded-2xl p-6 animate-pulse space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl shrink-0" />
            <div className="h-4 bg-white/10 rounded w-28" />
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-white/10 rounded-lg w-16" />
            <div className="h-3 bg-white/5 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingApprovalsSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#111113] border border-white/5 rounded-2xl animate-pulse"
        >
          <div className="w-full md:w-44 h-28 bg-white/10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 py-1 w-full">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="flex items-center gap-4">
              <div className="h-3.5 bg-white/5 rounded w-24" />
              <div className="h-3.5 bg-white/5 rounded w-20" />
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
            <div className="h-7 bg-white/10 rounded w-24" />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="h-9 bg-white/10 rounded-lg w-24" />
              <div className="h-9 bg-white/5 rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DealersSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/10 rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-28" />
              <div className="h-3 bg-white/5 rounded w-36" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="h-5 bg-white/10 rounded w-8 ml-auto" />
            <div className="h-2.5 bg-white/5 rounded w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start justify-between py-4 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-3 h-3 rounded-full bg-white/10 mt-1.5 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-36" />
              <div className="h-3 bg-white/5 rounded w-52" />
            </div>
          </div>
          <div className="space-y-1 text-right ml-4">
            <div className="h-4 bg-white/10 rounded w-20 ml-auto" />
            <div className="h-3 bg-white/5 rounded w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActiveDealsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between animate-pulse gap-4"
        >
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
          <div className="h-6 bg-white/10 rounded-lg w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, isError, refetch } = useGetAdminDashboardOverviewQuery();

  const userDisplayName =
    user?.firstName || user?.name
      ? `${user.firstName || user.name || ""} ${user.lastName || ""}`.trim()
      : "Admin";

  const stats = [
    {
      title: "Active Dealers",
      value: data?.metrics?.activeDealersCount ?? 0,
      trend: "+2 this week",
      trendColor: "text-[#4ADE80]",
      icon: <Users className="w-5 h-5 text-primary" />,
      glow: "shadow-[0_0_20px_-5px_rgba(231,143,35,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(231,143,35,0.3)]",
    },
    {
      title: "Pending listings",
      value: data?.metrics?.pendingListingsCount ?? 0,
      trend: `${data?.metrics?.pendingListingsCount ?? 0} listings require approval`,
      trendColor: "text-[#EF4444]",
      icon: <FileText className="w-5 h-5 text-primary" />,
      glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
    },
    {
      title: "Active Deals",
      value: data?.metrics?.activeDealsCount ?? 0,
      trend: `${data?.metrics?.activeDealsCount ?? 0} response required`,
      trendColor: "text-[#60A5FA]",
      icon: <Handshake className="w-5 h-5 text-primary" />,
      glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
    },
    {
      title: "Total Listing",
      value: data?.metrics?.totalListingsCount ?? 0,
      trend: `${data?.metrics?.totalListingsCount ?? 0} total listings`,
      trendColor: "text-[#F59E0B]",
      icon: <ListOrdered className="w-5 h-5 text-primary" />,
      glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-clash font-semibold text-white tracking-tight">
          Welcome back, {userDisplayName}
        </h1>
      </motion.div>

      {/* Error state alert */}
      {isError && (
        <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              Failed to load dashboard overview data. Please try again.
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white font-medium text-xs rounded-xl transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative bg-[#111113] border border-white/5 rounded-2xl p-6 transition-all duration-500 ${stat.glow} ${stat.hoverGlow} border-white/5 hover:border-[#E78F23]/40`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#E78F23]/10 rounded-xl border border-[#E78F23]/10 group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-400 font-medium">{stat.title}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-clash font-bold text-white tracking-tighter">
                  {stat.value}
                </span>
                <span className={`text-[11px] font-semibold uppercase tracking-widest ${stat.trendColor}`}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pending Approvals (Left 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-clash font-medium text-white">Pending Approvals</h2>
          </div>
          {isLoading ? (
            <PendingApprovalsSkeleton />
          ) : !data?.pendingApprovals || data.pendingApprovals.length === 0 ? (
            <div className="p-8 bg-[#111113] border border-white/5 rounded-2xl text-center text-gray-400 text-sm">
              No pending approvals at the moment.
            </div>
          ) : (
            <div className="grid gap-4">
              {data.pendingApprovals.map((item, i) => {
                const imageUrl =
                  item.media?.[0]?.url ||
                  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop";
                const ownerName = item.owner
                  ? `${item.owner.firstName} ${item.owner.lastName}`.trim()
                  : "Seller";

                return (
                  <motion.div
                    key={item.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#111113] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/2 transition-all group"
                  >
                    <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="flex-1 space-y-2 py-1">
                      <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          By {ownerName}{" "}
                          {item.owner?.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                      <span className="text-2xl font-clash font-bold text-primary">
                        {formatPrice(item.askingPrice, item.currency)}
                      </span>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary hover:bg-primary/90 text-black font-bold text-xs rounded-lg transition-all active:scale-95 shadow-[0_4px_12px_rgba(231,143,35,0.2)]">
                          Approve
                        </button>
                        <Link
                          href={`/admin/listings?id=${item.id}`}
                          className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-lg border border-white/10 transition-all active:scale-95 text-center"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Dealers (Right 4/12) */}
        <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 h-fit shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-clash font-medium text-white">Dealers</h2>
            <Link
              href="/admin/dealers"
              className="text-[10px] font-bold text-primary flex items-center gap-1.5 group bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-all uppercase tracking-widest"
            >
              Manage <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {isLoading ? (
            <DealersSkeleton />
          ) : !data?.dealersSummary || data.dealersSummary.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">No dealers found.</div>
          ) : (
            <div className="space-y-8">
              {data.dealersSummary.map((dealer, i) => {
                const avatar =
                  dealer.avatarUrl ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";
                const fullName = `${dealer.firstName} ${dealer.lastName}`.trim();

                return (
                  <div
                    key={dealer.id || i}
                    className="flex items-center justify-between group cursor-pointer hover:bg-white/2 -mx-4 px-4 py-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-[#E78F23]/50 transition-all ring-offset-2 ring-offset-[#111113] group-hover:ring-1 ring-[#E78F23]/30">
                        <Image src={avatar} alt={fullName} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                          {fullName}{" "}
                          {dealer.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10 text-xs shrink-0" />
                          )}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate max-w-[140px] font-medium">
                          {dealer.email}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-white group-hover:text-primary transition-colors">
                        {dealer.activeDealsCount}
                      </div>
                      <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">
                        active deals
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity (Left 7/12) */}
        <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E78F23]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          <h2 className="text-2xl font-clash font-medium text-white mb-10">Recent Activity</h2>
          {isLoading ? (
            <RecentActivitySkeleton />
          ) : !data?.recentActivities || data.recentActivities.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">No recent activity.</div>
          ) : (
            <div className="space-y-0">
              {data.recentActivities.map((activity, i) => {
                const statusType = getActivityStatusType(activity.action, activity.changes);
                const userName = activity.user
                  ? `${activity.user.firstName} ${activity.user.lastName}`.trim()
                  : "";

                return (
                  <div
                    key={activity.id || i}
                    className={`flex items-start justify-between py-6 ${
                      i !== data.recentActivities.length - 1 ? "border-b border-white/5" : ""
                    } group relative z-10`}
                  >
                    <div className="flex items-start gap-5">
                      <div className="mt-1.5 shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            statusType === "new"
                              ? "bg-primary shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                              : statusType === "approved"
                              ? "bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.6)]"
                              : statusType === "closed"
                              ? "bg-[#60A5FA] shadow-[0_0_12px_rgba(96,165,250,0.6)]"
                              : "bg-[#F87171] shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors">
                          {formatActivityAction(activity.action)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">
                          {getActivityDescription(activity)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {userName && (
                        <div className="text-base font-bold text-white tracking-tight">
                          By {userName}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">
                        {formatRelativeTime(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Deals (Right 5/12) */}
        <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-clash font-medium text-white mb-10">Active Deals</h2>
          {isLoading ? (
            <ActiveDealsSkeleton />
          ) : !data?.activeDeals || data.activeDeals.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4 flex-1">No active deals found.</div>
          ) : (
            <div className="space-y-4 flex-1">
              {data.activeDeals.map((deal, i) => {
                const dealTitle = deal.listing?.title || "Asset Deal";
                const sellerName = deal.seller
                  ? `${deal.seller.firstName} ${deal.seller.lastName}`.trim()
                  : deal.buyer
                  ? `${deal.buyer.firstName} ${deal.buyer.lastName}`.trim()
                  : "Dealer";
                const stageFormatted = formatStage(deal.stage);
                const isNegotiation =
                  stageFormatted.toLowerCase().includes("negotiat") ||
                  stageFormatted.toLowerCase().includes("pending");

                return (
                  <div
                    key={deal.id || i}
                    className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/4 hover:border-primary/20 transition-all group lg:flex-row flex-col gap-4 text-center lg:text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {dealTitle}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">{sellerName}</p>
                    </div>
                    <div
                      className={`shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${
                        isNegotiation
                          ? "text-primary border-primary/20 bg-primary/5"
                          : "text-[#4ADE80] border-[#4ADE80]/20 bg-[#4ADE80]/5"
                      }`}
                    >
                      {stageFormatted}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

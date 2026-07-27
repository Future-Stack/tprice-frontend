"use client";

import React, { useState } from "react";
import {
  Check,
  AlertTriangle,
  X,
  Plus,
  Tag,
  Briefcase,
  User,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Building2,
  Activity as ActivityIcon,
  ShieldAlert,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useAuditLogsQuery } from "@/hooks/useAuditLogs";
import { useDebounce } from "@/hooks/useDebounce";
import { AuditLogItem } from "@/lib/api/auditLogs";

const RESOURCE_TABS = [
  { label: "All Resources", value: "ALL" },
  { label: "User", value: "User" },
  { label: "Listings", value: "AssetListing" },
  { label: "Dealers", value: "DealerProfile" },
  { label: "Events", value: "Event" },
];

const LIMIT_OPTIONS = [10, 20, 50, 100];

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
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getStatusStyles = (action: string) => {
  const norm = (action || "").toUpperCase();
  if (
    norm.includes("DELETE") ||
    norm.includes("REJECT") ||
    norm.includes("SUSPEND")
  ) {
    return {
      icon: <X className="text-red-500" size={20} />,
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      dot: "bg-red-500",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]",
    };
  }
  if (
    norm.includes("APPROV") ||
    norm.includes("GRANT") ||
    norm.includes("SUCCESS")
  ) {
    return {
      icon: <Check className="text-green-500" size={20} />,
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      dot: "bg-green-500",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.6)]",
    };
  }
  if (norm.includes("CREATE") || norm.includes("SUBMIT")) {
    return {
      icon: <Plus className="text-blue-400" size={20} />,
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      dot: "bg-blue-400",
      glow: "shadow-[0_0_15px_rgba(96,165,250,0.6)]",
    };
  }
  if (
    norm.includes("UPDATE") ||
    norm.includes("EDIT") ||
    norm.includes("FLAG")
  ) {
    return {
      icon: <AlertTriangle className="text-yellow-500" size={20} />,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      dot: "bg-yellow-500",
      glow: "shadow-[0_0_15px_rgba(234,179,8,0.6)]",
    };
  }
  return {
    icon: <Clock className="text-gray-400" size={20} />,
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    dot: "bg-gray-400",
    glow: "shadow-[0_0_15px_rgba(156,163,175,0.6)]",
  };
};

const getTypeIcon = (resource: string) => {
  const norm = (resource || "").toLowerCase();
  if (norm.includes("listing") || norm.includes("asset")) {
    return <Tag size={12} />;
  }
  if (norm.includes("deal")) {
    return <Briefcase size={12} />;
  }
  if (norm.includes("user")) {
    return <User size={12} />;
  }
  if (norm.includes("dealer")) {
    return <Building2 size={12} />;
  }
  if (norm.includes("event")) {
    return <Calendar size={12} />;
  }
  return <Tag size={12} />;
};

const formatActionTitle = (action: string) => {
  if (!action) return "System Activity";
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatActionDescription = (activity: AuditLogItem) => {
  const changes = activity.changes;
  const user = activity.user;
  const actorName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : null;

  let details = "";
  if (changes) {
    if (changes.title) {
      details = `"${changes.title}"`;
    } else if (changes.email && changes.role) {
      details = `User ${changes.email} (${changes.role})`;
    } else if (changes.email) {
      details = `User ${changes.email}`;
    } else if (changes.newRole) {
      details = `Role updated from ${changes.previousRole || "N/A"} to ${changes.newRole}`;
    } else if (changes.status) {
      details = `Status set to ${changes.status}`;
    } else if (changes.vipStatus !== undefined) {
      details = `VIP status set to ${changes.vipStatus ? "Active" : "Inactive"}`;
    } else {
      const keys = Object.keys(changes);
      if (keys.length > 0) {
        details = keys
          .map((k) => `${k}: ${typeof changes[k] === "object" ? JSON.stringify(changes[k]) : changes[k]}`)
          .join(", ");
      }
    }
  }

  if (!details) {
    details = `${activity.resource} (${activity.resourceId || "N/A"})`;
  }

  if (actorName) {
    return `${details} • by ${actorName}`;
  }
  return details;
};

const ActivitySkeleton = () => (
  <div className="space-y-8 relative">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-4 md:gap-8 overflow-hidden flex-1">
          {/* Left Icon Box Skeleton */}
          <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10" />

          {/* Content Skeleton */}
          <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
            <div className="w-44 md:w-60 h-4 bg-white/10 rounded" />
            <div className="w-64 md:w-80 h-3 bg-white/5 rounded" />
            <div className="flex items-center gap-4 mt-1">
              <div className="w-16 h-3 bg-white/5 rounded" />
              <div className="w-20 h-3 bg-white/5 rounded" />
            </div>
          </div>
        </div>

        {/* Right Dot Indicator Skeleton */}
        <div className="shrink-0 ml-4 md:ml-0">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/10" />
        </div>
      </div>
    ))}
  </div>
);

function AdminActivity() {
  const [selectedResource, setSelectedResource] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data: auditLogsResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAuditLogsQuery({
    page,
    limit,
    resource: selectedResource,
    search: debouncedSearch,
  });

  const activities = auditLogsResponse?.data || [];
  const meta = auditLogsResponse?.meta || {
    total: activities.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleResourceChange = (val: string) => {
    setSelectedResource(val);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-20">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            Activity
            {isFetching && !isLoading && (
              <span className="text-xs font-normal text-primary flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm">
            Track all system actions, audit logs, and administrative events
          </p>
        </AnimationWrapper>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer flex items-center gap-2 text-xs font-medium"
            title="Refresh logs"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111111] border border-[#232323] rounded-2xl p-4">
          {/* Resource Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {RESOURCE_TABS.map((tab) => {
              const isActive = selectedResource === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleResourceChange(tab.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-black font-semibold shadow-[0_0_12px_rgba(234,179,8,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search and Limit Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search audit logs..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
              <span className="hidden md:inline">Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#141416] border border-[#262626] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-primary/60 cursor-pointer"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#141416]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </AnimationWrapper>

      {/* Main Container */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
        <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6 md:p-10 max-w-4xl relative overflow-hidden shadow-2xl">
          {/* Vertical Line Container */}
          <div className="absolute right-[43px] md:right-[48px] top-10 bottom-24 w-px bg-[#232323] hidden md:block" />

          {isLoading ? (
            <ActivitySkeleton />
          ) : isError ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-red-500" />
                <p className="text-base font-semibold text-gray-200">
                  Failed to load activity logs
                </p>
                <p className="text-xs text-gray-500 max-w-sm">
                  There was an error communicating with the server. Please check your connection and try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold rounded-xl cursor-pointer mt-2"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <ActivityIcon className="w-12 h-12 text-gray-600" />
                <p className="text-base font-semibold text-gray-300">
                  No activity logs found
                </p>
                <p className="text-xs text-gray-500">
                  {searchQuery
                    ? `No activity matching "${searchQuery}"`
                    : "No audit logs available for the selected filter."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 relative">
              {activities.map((activity, index) => {
                const styles = getStatusStyles(activity.action);
                const title = formatActionTitle(activity.action);
                const description = formatActionDescription(activity);
                const timeAgo = formatTimeAgo(activity.createdAt);

                return (
                  <AnimationWrapper
                    key={activity.id}
                    type="fade-right"
                    duration={0.5}
                    delay={index * 0.05}
                  >
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-4 md:gap-8 overflow-hidden flex-1">
                        {/* Left Icon Box */}
                        <div
                          className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border ${styles.border} ${styles.bg} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}
                        >
                          {styles.icon}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                          <h3 className="font-semibold text-base md:text-lg text-gray-100 truncate group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                          <p className="text-gray-400 text-sm md:text-base line-clamp-1">
                            {description}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs capitalize">
                              {getTypeIcon(activity.resource)}
                              <span>{activity.resource}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs">
                              <Clock size={12} />
                              <span>{timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Dot Indicator */}
                      <div className="shrink-0 ml-4 md:ml-0 relative z-10">
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${styles.dot} ${styles.glow} transition-all duration-500 group-hover:scale-125`}
                        />
                      </div>
                    </div>
                  </AnimationWrapper>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !isError && activities.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#232323] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <div>
                Showing{" "}
                <span className="font-semibold text-white">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-semibold text-white">{meta.total}</span> logs
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  let pageNum = meta.page;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (meta.page <= 3) {
                    pageNum = i + 1;
                  } else if (meta.page >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = meta.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                        pageNum === meta.page
                          ? "bg-primary text-black border-primary font-bold shadow-[0_2px_10px_rgba(234,179,8,0.3)]"
                          : "bg-[#1A1A1C] border-[#262626] text-gray-300 hover:text-white hover:border-primary/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default AdminActivity;

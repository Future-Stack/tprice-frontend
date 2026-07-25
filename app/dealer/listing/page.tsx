"use client";

import React, { useState } from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  Search,
  MapPin,
  Activity,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMyListingsQuery } from "@/hooks/useListings";
import { useDebounce } from "@/hooks/useDebounce";

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${Math.max(1, diffMins)}m ago`;
    }
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
};

const formatPrice = (price?: string | number, currency = "USD") => {
  if (price === undefined || price === null || price === "") return "N/A";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return `${currency} ${price}`;

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

const formatStatusLabel = (status: string) => {
  if (!status) return "Live";
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "PENDING_APPROVAL":
    case "PENDING":
      return "Pending";
    case "APPROVED":
    case "LIVE":
    case "ACTIVE":
      return "Live";
    case "SOLD":
      return "Sold";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
};

const CardSkeleton = () => (
  <div className="bg-[#1C1C1C] rounded-xl overflow-hidden border border-[#2A2A2A] animate-pulse flex flex-col">
    <div className="aspect-16/11 w-full bg-white/10" />
    <div className="p-4 flex flex-col flex-1 gap-4">
      <div className="w-3/4 h-5 bg-white/10 rounded" />
      <div className="flex items-center justify-between">
        <div className="w-24 h-4 bg-white/10 rounded" />
        <div className="w-20 h-4 bg-white/10 rounded" />
      </div>
      <div className="flex items-end justify-between mt-auto pt-2">
        <div className="w-28 h-6 bg-white/10 rounded" />
        <div className="w-20 h-3.5 bg-white/10 rounded" />
      </div>
      <div className="w-full h-9 bg-white/10 rounded-lg mt-2" />
    </div>
  </div>
);

export default function ListingPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE_DEALS" | "NO_ACTIVITY">("ALL");

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading, isFetching, refetch } = useMyListingsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: "NEWEST",
  });

  const rawListings = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  };

  const filteredListings = rawListings.filter((item) => {
    const activeDeals = item.offersCount ?? item._count?.offers ?? 0;
    if (filterTab === "ACTIVE_DEALS") return activeDeals > 0;
    if (filterTab === "NO_ACTIVITY") return activeDeals === 0;
    return true;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <AnimationWrapper>
      <div className="w-full text-white min-h-screen font-sans bg-transparent pb-10">
        <div className="w-full space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-[28px] font-semibold text-gray-100">
                Assigned Listings
              </h1>
              <p className="text-gray-400 text-sm">
                Listings you are currently managing
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg border border-[#333] transition-colors text-xs font-medium self-start md:self-auto cursor-pointer"
              title="Refresh listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 py-2 border-[#1A1A1A]">
            <div className="relative w-full sm:max-w-110">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by listing name, brand, or keyword"
                className="w-full bg-transparent text-sm text-gray-200 border border-[#333] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-[#888]"
                autoComplete="off"
              />
            </div>
            <Link
              href="/dealer/add-listing"
              className="bg-[#EAB308] hover:bg-[#D9A506] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm text-center cursor-pointer"
            >
              Add Listing
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterTab("ALL")}
              className={`text-sm font-medium px-5 py-2 rounded-md transition-colors cursor-pointer ${
                filterTab === "ALL"
                  ? "bg-[#EAB308] text-black"
                  : "bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#B3B3B3] border border-[#333]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab("ACTIVE_DEALS")}
              className={`text-sm font-medium px-5 py-2 rounded-md transition-colors cursor-pointer ${
                filterTab === "ACTIVE_DEALS"
                  ? "bg-[#EAB308] text-black"
                  : "bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#B3B3B3] border border-[#333]"
              }`}
            >
              Active Deals
            </button>
            <button
              onClick={() => setFilterTab("NO_ACTIVITY")}
              className={`text-sm font-medium px-5 py-2 rounded-md transition-colors cursor-pointer ${
                filterTab === "NO_ACTIVITY"
                  ? "bg-[#EAB308] text-black"
                  : "bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#B3B3B3] border border-[#333]"
              }`}
            >
              No Buyer Activity
            </button>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => <CardSkeleton key={idx} />)
            ) : filteredListings.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
                <PackageOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-200">No listings found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery
                    ? `No listings match your search "${searchQuery}"`
                    : "No assigned listings found."}
                </p>
              </div>
            ) : (
              filteredListings.map((item) => {
                const activeDeals = item.offersCount ?? item._count?.offers ?? 0;
                const imageUrl =
                  item.media?.[0]?.url ||
                  "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop";
                const location =
                  [item.locationCity, item.locationCountry].filter(Boolean).join(", ") ||
                  "Monaco";

                return (
                  <div
                    key={item.id}
                    className="bg-[#1C1C1C] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#444] transition-colors flex flex-col group"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-16/11 w-full bg-[#111] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                      />
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>

                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        {activeDeals > 0 && (
                          <div className="bg-[#123314]/90 text-[#4ADE80] text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium border border-[#1b4b1f]">
                            <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full shadow-[0_0_4px_#4ADE80]"></div>
                            New Offer
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <div className="relative flex items-center justify-center">
                          {item.isFeatured && (
                            <div className="absolute opacity-80 scale-[1.7] z-0">
                              <ShieldCheck className="w-5 h-5 text-[#D9A506]/30 fill-[#D9A506]/20" />
                            </div>
                          )}
                          <div className="bg-[#2A230F]/90 text-[#EAB308] text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium z-10 border border-[#EAB308]/20 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 bg-[#EAB308] rounded-full shadow-[0_0_4px_#EAB308]"></div>
                            {formatStatusLabel(item.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-4 flex flex-col flex-1 gap-4">
                      <h3 className="font-medium text-[16px] text-zinc-100 line-clamp-1">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-zinc-500" />
                          {activeDeals > 0 ? (
                            <span className="text-[#4ADE80] font-medium">
                              {activeDeals} active deal{activeDeals > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-zinc-400">No offers yet</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="truncate max-w-22.5">{location}</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-auto pt-2">
                        <div className="text-[#EAB308] font-semibold text-xl sm:text-[22px]">
                          {formatPrice(item.askingPrice, item.currency)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pb-1">
                          <Clock className="w-3.5 h-3.5" />
                          updated {formatTimeAgo(item.updatedAt || item.createdAt)}
                        </div>
                      </div>

                      <Link
                        href={`/dealer/my-offer`}
                        className="w-full mt-2 border border-[#333] hover:border-[#EAB308] hover:bg-[#EAB308]/10 text-zinc-300 hover:text-white transition-all py-2.25 rounded-lg flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <span>{activeDeals > 0 ? "Manage Deals" : "View Details"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl text-sm text-gray-400">
              <div>
                Showing{" "}
                <span className="font-semibold text-white">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-semibold text-white">{meta.total}</span> listings
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="px-3.5 py-2 rounded-lg border border-[#333] bg-[#111] text-gray-300 hover:text-white hover:border-[#EAB308]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-colors cursor-pointer ${
                          pageNum === meta.page
                            ? "bg-[#EAB308] text-black border-[#EAB308] font-bold"
                            : "bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-[#EAB308]/40"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3.5 py-2 rounded-lg border border-[#333] bg-[#111] text-gray-300 hover:text-white hover:border-[#EAB308]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  RefreshCw,
  Edit3,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useMyListingsQuery } from "@/hooks/useListings";
import { useDebounce } from "@/hooks/useDebounce";
import { ListingItem } from "@/lib/api/listings";
import UpdateListingModal from "./UpdateListingModal";

const getStatusStyles = (status: string) => {
  const normalized = status?.toUpperCase();
  switch (normalized) {
    case "LIVE":
    case "APPROVED":
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "PENDING":
    case "PENDING_APPROVAL":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "SOLD":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "REJECTED":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const formatStatusLabel = (status: string) => {
  if (!status) return "Unknown";
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

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
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

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1F1F1F] animate-pulse">
        <td className="px-8 py-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-16 bg-white/10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="w-48 h-5 bg-white/10 rounded" />
              <div className="w-32 h-3.5 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-8 py-6">
          <div className="w-28 h-5 bg-white/10 rounded" />
        </td>
        <td className="px-8 py-6">
          <div className="w-20 h-6 bg-white/10 rounded-full" />
        </td>
        <td className="px-8 py-6">
          <div className="w-16 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-8 py-6 text-right">
          <div className="w-8 h-8 bg-white/10 rounded-full ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

const SellerListing = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingListing, setEditingListing] = useState<ListingItem | null>(
    null,
  );

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading, isFetching, refetch } = useMyListingsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: "NEWEST",
  });

  const listings = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="w-full mx-auto space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AnimationWrapper type="fade-down">
          <h1 className="text-4xl font-medium font-clash tracking-tight text-white">
            My Listings
          </h1>
        </AnimationWrapper>

        <AnimationWrapper type="fade-down" delay={0.1}>
          <Link href="/seller/add-listing">
            <button className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-[#E78F23]/90 transition-all duration-300 text-black font-bold rounded-xl shadow-[0_0_25px_rgba(231,143,35,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Add Listing
            </button>
          </Link>
        </AnimationWrapper>
      </div>

      <div className="space-y-6">
        {/* Filters Section */}
        <AnimationWrapper type="fade-up" delay={0.2}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-100">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search listings..."
                className="w-full bg-[#121212] border border-[#2D2D2D] rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-[#E78F23]/40 transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-6 py-2.5 border border-primary/60 text-primary rounded-xl hover:bg-[#E78F23]/10 transition-all duration-300 font-medium whitespace-nowrap cursor-pointer"
                title="Refresh listings"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <span className="text-gray-400 font-medium text-sm whitespace-nowrap">
                Showing{" "}
                <span className="text-white font-bold text-lg">
                  {meta.total}
                </span>{" "}
                items
              </span>
            </div>
          </div>
        </AnimationWrapper>

        {/* Listings Table Section */}
        <AnimationWrapper type="fade-up" delay={0.3}>
          <div className="relative bg-[#0D0D0D] border border-[#1F1F1F] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Table bottom glow effect */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-primary blur-[2px] opacity-40"></div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-250">
                <thead>
                  <tr className="border-b border-[#1F1F1F]">
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Item
                    </th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Category
                    </th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Price
                    </th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Engagement
                    </th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {isLoading ? (
                    <TableSkeleton />
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <PackageOpen className="w-12 h-12 text-gray-600 mx-auto" />
                          <p className="text-lg font-bold text-gray-300">
                            No listings found
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchQuery
                              ? `No listings match your search "${searchQuery}"`
                              : "You haven't created any listings yet. Click 'Add Listing' to post your first vehicle or asset."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    listings.map((item) => {
                      const imageUrl =
                        item.media?.[0]?.url ||
                        "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=300&h=200";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-white/3 transition-all duration-300 group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A] border border-[#2D2D2D] transition-transform duration-300 group-hover:scale-105">
                                <Image
                                  src={imageUrl}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-base font-bold text-white group-hover:text-[#E78F23] transition-colors duration-300 truncate">
                                  {item.title}
                                </p>
                                <p className="text-[12px] text-gray-500 mt-1 font-medium">
                                  LST-{item.id.slice(0, 6).toUpperCase()}{" "}
                                  <span className="mx-1.5">•</span> Added{" "}
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                            {item.category}
                            {item.subCategory && (
                              <span className="text-xs text-gray-600 block">
                                {item.subCategory}
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-lg font-extrabold text-white">
                            {formatPrice(item.askingPrice, item.currency)}
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-4 py-1.5 text-[11px] font-bold rounded-full border tracking-wide inline-block ${getStatusStyles(
                                item.status,
                              )}`}
                            >
                              {formatStatusLabel(item.status)}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2.5 text-sm text-gray-400 font-bold">
                              <Eye className="w-5 h-5 text-gray-500" />
                              <span>{item.viewsCount ?? 0}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingListing(item)}
                                className="px-3.5 py-2 bg-[#E78F23]/10 hover:bg-[#E78F23] text-[#E78F23] hover:text-black border border-[#E78F23]/30 font-bold text-xs rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
                                title="Edit listing"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!isLoading && meta.totalPages > 1 && (
              <div className="px-8 py-5 border-t border-[#1F1F1F] bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div>
                  Showing{" "}
                  <span className="font-bold text-white">
                    {(meta.page - 1) * meta.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-white">
                    {Math.min(meta.page * meta.limit, meta.total)}
                  </span>{" "}
                  of <span className="font-bold text-white">{meta.total}</span>{" "}
                  items
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-[#E78F23]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from(
                      { length: meta.totalPages },
                      (_, i) => i + 1,
                    ).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl border font-bold text-xs transition-all duration-300 cursor-pointer ${
                          pageNum === meta.page
                            ? "bg-[#E78F23] text-black border-[#E78F23] shadow-[0_0_15px_rgba(231,143,35,0.4)]"
                            : "bg-[#121212] border-[#2D2D2D] text-gray-400 hover:text-white hover:border-[#E78F23]/40"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="px-4 py-2 rounded-xl border border-[#2D2D2D] bg-[#121212] text-gray-300 hover:text-white hover:border-[#E78F23]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 font-medium text-xs cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </AnimationWrapper>
      </div>

      {/* Edit Listing Modal */}
      <UpdateListingModal
        isOpen={Boolean(editingListing)}
        onClose={() => setEditingListing(null)}
        listing={editingListing}
      />
    </div>
  );
};

export default SellerListing;

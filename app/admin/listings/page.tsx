"use client";

import React, { useState } from "react";
import {
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import Image from "next/image";
import {
  useAdminListingsQuery,
  useUpdateAdminListingStatusMutation,
  useDeleteListingMutation,
} from "@/hooks/useListings";
import { ListingItem } from "@/lib/api/listings";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import DeleteListingModal from "./DeleteListingModal";
import RejectListingModal from "./RejectListingModal";

const TABS = ["All listings", "pending", "Approved", "Rejected"];
const LIMIT_OPTIONS = [10, 20, 50, 100];

const formatSubmittedDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatPrice = (priceStr?: string | number, currency = "USD") => {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

const getDealerName = (listing: ListingItem) => {
  if (listing.owner) {
    const fullName = `${listing.owner.firstName || ""} ${listing.owner.lastName || ""}`.trim();
    if (fullName) return fullName;
    if (listing.owner.email) return listing.owner.email;
  }
  return "Unknown Dealer";
};

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toUpperCase();

  if (normalized === "PENDING_APPROVAL" || normalized === "PENDING") {
    return {
      label: "pending",
      className: "bg-yellow-500/10 text-primary border border-primary/20",
    };
  }
  if (normalized === "LIVE" || normalized === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-green-500/10 text-green-500 border border-green-500/20",
    };
  }
  if (normalized === "REJECTED") {
    return {
      label: "Rejected",
      className: "bg-red-500/10 text-red-500 border border-red-500/20",
    };
  }

  return {
    label: status,
    className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  };
};

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-white/10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-40 h-4 bg-white/10 rounded" />
              <div className="w-24 h-3 bg-white/5 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-7 bg-white/10 rounded-lg" />
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 bg-white/10 rounded-lg" />
            <div className="w-16 h-8 bg-white/10 rounded-lg" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState("All listings");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [listingToDelete, setListingToDelete] = useState<ListingItem | null>(null);
  const [listingToReject, setListingToReject] = useState<ListingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Map activeTab to API status parameter
  const getApiStatusParam = (tab: string) => {
    if (tab.toLowerCase() === "pending") return "PENDING_APPROVAL";
    if (tab.toLowerCase() === "approved") return "LIVE";
    if (tab.toLowerCase() === "rejected") return "REJECTED";
    return undefined;
  };

  const {
    data: listingsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useAdminListingsQuery({
    page,
    limit,
    status: getApiStatusParam(activeTab),
    search: debouncedSearch,
  });

  const updateStatusMutation = useUpdateAdminListingStatusMutation();
  const deleteListingMutation = useDeleteListingMutation();

  const rawListings = listingsResponse?.data || [];
  const meta = listingsResponse?.meta || {
    total: rawListings.length,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Filter listings based on active tab if backend doesn't filter by status parameter
  const listings = rawListings.filter((item) => {
    if (activeTab === "All listings") return true;
    const normStatus = (item.status || "").toUpperCase();
    if (activeTab.toLowerCase() === "pending") {
      return normStatus === "PENDING_APPROVAL" || normStatus === "PENDING";
    }
    if (activeTab.toLowerCase() === "approved") {
      return normStatus === "LIVE" || normStatus === "APPROVED";
    }
    if (activeTab.toLowerCase() === "rejected") {
      return normStatus === "REJECTED";
    }
    return true;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleApprove = async (id: string, title: string) => {
    setUpdatingId(id);
    try {
      await updateStatusMutation.mutateAsync({ id, status: "LIVE" });
      toast.success(`Listing "${title}" approved successfully`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to approve listing"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenRejectModal = (listing: ListingItem) => {
    setListingToReject(listing);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!listingToReject) return;
    const target = listingToReject;
    setUpdatingId(target.id);
    try {
      await updateStatusMutation.mutateAsync({
        id: target.id,
        status: "REJECTED",
        rejectionReason: reason,
      });
      toast.success(`Listing "${target.title}" rejected`);
      setListingToReject(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to reject listing"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    const target = listingToDelete;
    setDeletingId(target.id);
    try {
      const res = await deleteListingMutation.mutateAsync(target.id);
      toast.success(res?.message || `Asset listing deleted successfully`);
      setListingToDelete(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete listing"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h1 className="text-3xl font-bold mb-2">
            Manage and review all listings
          </h1>
          <p className="text-gray-400 text-sm">
            Review submitted marketplace assets, approve pending listings, and manage status
          </p>
        </AnimationWrapper>

        <div className="flex items-center gap-3 shrink-0">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
            title="Refresh listings"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Tabs & Search Controls Section */}
      <div className="mb-6 space-y-4">
        <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4 sm:pb-0">
            {/* Tabs */}
            <div className="flex gap-8 overflow-x-auto w-full sm:w-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap px-2 cursor-pointer ${
                    activeTab === tab
                      ? "text-white font-semibold"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Search and Limit Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search listings..."
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
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-[#151515] border-b border-primary/30">
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Listing
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Dealer
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Submitted
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Building2 className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No listings found
                        </p>
                        <p className="text-xs text-gray-500">
                          {searchQuery
                            ? `No listings match "${searchQuery}"`
                            : activeTab !== "All listings"
                            ? `No ${activeTab} listings at the moment.`
                            : "No listings available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => {
                    const badge = getStatusBadge(listing.status);
                    const mainImage =
                      listing.media?.[0]?.url ||
                      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";
                    const isRowDeleting =
                      deletingId === listing.id ||
                      (deleteListingMutation.isPending &&
                        deleteListingMutation.variables === listing.id);

                    return (
                      <tr
                        key={listing.id}
                        className={`group hover:bg-[#151515] transition-all duration-300 ${
                          isRowDeleting ? "opacity-40 pointer-events-none" : ""
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0">
                              <Image
                                src={mainImage}
                                alt={listing.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";
                                }}
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-base text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
                                {listing.title}
                              </span>
                              {listing.brand && (
                                <span className="text-xs text-gray-500">
                                  {listing.brand}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                          {getDealerName(listing)}
                        </td>
                        <td className="px-6 py-5 font-bold text-base text-white">
                          {formatPrice(listing.askingPrice, listing.currency)}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">
                          {listing.category || "Uncategorized"}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">
                          {formatSubmittedDate(listing.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <div
                            className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold capitalize tracking-wide ${badge.className}`}
                          >
                            {badge.label}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const isRowUpdating =
                                updatingId === listing.id ||
                                (updateStatusMutation.isPending &&
                                  updateStatusMutation.variables?.id === listing.id);

                              return (
                                <>
                                  {(badge.label.toLowerCase() === "pending" ||
                                    listing.status === "PENDING_APPROVAL") && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleApprove(listing.id, listing.title)
                                        }
                                        disabled={isRowUpdating || isRowDeleting}
                                        className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                      >
                                        {isRowUpdating &&
                                        updateStatusMutation.variables?.status === "LIVE" ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : null}
                                        <span>Approve</span>
                                      </button>
                                      <button
                                        onClick={() => handleOpenRejectModal(listing)}
                                        disabled={isRowUpdating || isRowDeleting}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                      >
                                        {isRowUpdating &&
                                        updateStatusMutation.variables?.status === "REJECTED" ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                                        ) : null}
                                        <span>Reject</span>
                                      </button>
                                    </>
                                  )}
                                  {(badge.label.toLowerCase() === "rejected" ||
                                    listing.status === "REJECTED") && (
                                    <button
                                      onClick={() =>
                                        handleApprove(listing.id, listing.title)
                                      }
                                      disabled={isRowUpdating || isRowDeleting}
                                      className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-yellow-400 cursor-pointer text-black text-xs font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
                                    >
                                      {isRowUpdating &&
                                      updateStatusMutation.variables?.status === "LIVE" ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : null}
                                      <span>Approve</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setListingToDelete(listing)}
                                    disabled={
                                      deleteListingMutation.isPending ||
                                      isRowDeleting ||
                                      isRowUpdating
                                    }
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                    title="Delete listing"
                                  >
                                    {isRowDeleting ? (
                                      <Loader2 size={18} className="animate-spin text-red-400" />
                                    ) : (
                                      <Trash2 size={18} />
                                    )}
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && listings.length > 0 && (
            <div className="px-6 py-4 bg-[#141416] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <div>
                Showing{" "}
                <span className="font-semibold text-white">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-semibold text-white">{meta.total}</span>{" "}
                listings
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

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
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
                  )
                )}

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

      {/* Delete Listing Confirmation Modal */}
      <DeleteListingModal
        isOpen={!!listingToDelete}
        onClose={() => setListingToDelete(null)}
        onConfirm={handleConfirmDelete}
        listing={listingToDelete}
        isDeleting={deleteListingMutation.isPending}
      />

      {/* Reject Listing Modal */}
      <RejectListingModal
        isOpen={!!listingToReject}
        onClose={() => setListingToReject(null)}
        onConfirm={handleConfirmReject}
        listing={listingToReject}
        isSubmitting={
          updateStatusMutation.isPending && updatingId === listingToReject?.id
        }
      />
    </div>
  );
}

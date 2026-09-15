"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useAdminListingsQuery,
  useUpdateAdminListingStatusMutation,
  useDeleteListingMutation,
} from "@/hooks/useListings";
import { ListingItem } from "@/lib/api/listings";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AdminListingsHeader,
  AdminListingsFilters,
  AdminListingsTable,
  AdminListingsPagination,
} from "./_components";

const DeleteListingModal = dynamic(() => import("./DeleteListingModal"), { ssr: false });
const RejectListingModal = dynamic(() => import("./RejectListingModal"), { ssr: false });
const UpdateListingModal = dynamic(() => import("@/components/shared/modals/UpdateListingModal"), {
  ssr: false,
});

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState("All listings");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [listingToEdit, setListingToEdit] = useState<ListingItem | null>(null);
  const [listingToDelete, setListingToDelete] = useState<ListingItem | null>(null);
  const [listingToReject, setListingToReject] = useState<ListingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

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
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to approve listing"
      );
    } finally {
      setUpdatingId(null);
    }
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
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to reject listing"
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
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to delete listing"
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
      <AdminListingsHeader
        isFetching={isFetching}
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />

      <AdminListingsFilters
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        limit={limit}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />

      <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          <AdminListingsTable
            listings={listings}
            isLoading={isLoading}
            searchQuery={searchQuery}
            activeTab={activeTab}
            deletingId={deletingId}
            updatingId={updatingId}
            isDeletePending={deleteListingMutation.isPending}
            isUpdatePending={updateStatusMutation.isPending}
            updateTargetStatus={updateStatusMutation.variables?.status}
            onApprove={handleApprove}
            onOpenRejectModal={setListingToReject}
            onOpenEditModal={setListingToEdit}
            onOpenDeleteModal={setListingToDelete}
          />

          <AdminListingsPagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </AnimationWrapper>

      {/* Modals with Keyed Mounts */}
      {Boolean(listingToEdit) && (
        <UpdateListingModal
          key={listingToEdit?.id}
          isOpen={Boolean(listingToEdit)}
          onClose={() => setListingToEdit(null)}
          listing={listingToEdit}
        />
      )}

      {Boolean(listingToDelete) && (
        <DeleteListingModal
          key={listingToDelete?.id}
          isOpen={Boolean(listingToDelete)}
          onClose={() => setListingToDelete(null)}
          onConfirm={handleConfirmDelete}
          listing={listingToDelete}
          isDeleting={deleteListingMutation.isPending}
        />
      )}

      {Boolean(listingToReject) && (
        <RejectListingModal
          key={listingToReject?.id}
          isOpen={Boolean(listingToReject)}
          onClose={() => setListingToReject(null)}
          onConfirm={handleConfirmReject}
          listing={listingToReject}
          isSubmitting={updateStatusMutation.isPending && updatingId === listingToReject?.id}
        />
      )}
    </div>
  );
}

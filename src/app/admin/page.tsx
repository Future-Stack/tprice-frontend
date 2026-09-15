"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useGetAdminDashboardOverviewQuery } from "@/hooks/useAdminDashboard";
import { useUpdateAdminListingStatusMutation } from "@/hooks/useListings";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  PendingApproval,
  AdminStatsSection,
  AdminPendingApprovals,
  AdminDealersSummary,
  AdminRecentActivity,
  AdminActiveDeals,
} from "./_components";

const RejectListingModal = dynamic(() => import("@/app/admin/listings/RejectListingModal"), {
  ssr: false,
});

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, isError, refetch } = useGetAdminDashboardOverviewQuery();

  const updateStatusMutation = useUpdateAdminListingStatusMutation();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalListing, setRejectModalListing] = useState<PendingApproval | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: "LIVE",
      });
    } catch {
      // Error toast is handled by mutation hook
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectModalListing) return;
    const id = rejectModalListing.id;
    setProcessingId(id);
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: "REJECTED",
        rejectionReason: reason,
      });
      setRejectModalListing(null);
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to update listing status");
    } finally {
      setProcessingId(null);
    }
  };

  const userDisplayName =
    user?.firstName || user?.name
      ? `${user.firstName || user.name || ""} ${user.lastName || ""}`.trim()
      : "Admin";

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-montserrat font-bold text-white tracking-tight">
          Welcome back, {userDisplayName}
        </h1>
      </motion.div>

      {/* Error state alert with retry */}
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
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white font-medium text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <AdminStatsSection metrics={data?.metrics} isLoading={isLoading} />

      {/* Middle Grid: Pending Approvals & Top Dealers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <AdminPendingApprovals
          pendingApprovals={data?.pendingApprovals}
          isLoading={isLoading}
          processingId={processingId}
          onApprove={handleApprove}
          onReject={setRejectModalListing}
        />
        <AdminDealersSummary dealersSummary={data?.dealersSummary} isLoading={isLoading} />
      </div>

      {/* Bottom Grid: Recent Activity & Active Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminRecentActivity recentActivities={data?.recentActivities} isLoading={isLoading} />
        <AdminActiveDeals activeDeals={data?.activeDeals} isLoading={isLoading} />
      </div>

      {/* Code-split Rejection Modal */}
      {Boolean(rejectModalListing) && (
        <RejectListingModal
          isOpen={Boolean(rejectModalListing)}
          onClose={() => setRejectModalListing(null)}
          onConfirm={handleRejectConfirm}
          listing={rejectModalListing}
          isSubmitting={updateStatusMutation.isPending && processingId === rejectModalListing?.id}
        />
      )}
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useUpdateAdminListingStatusMutation } from "@/hooks/useListings";
import { toast } from "sonner";
import type { AdminModerationCardProps } from "./types";

export function AdminModerationCard({ listing, onOpenRejectModal }: AdminModerationCardProps) {
  const updateStatusMutation = useUpdateAdminListingStatusMutation();
  const isUpdating = updateStatusMutation.isPending;
  const isApproved = listing.status === "LIVE" || listing.status === "APPROVED";
  const isRejected = listing.status === "REJECTED";

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: listing.id,
        status: "LIVE",
      });
      toast.success("Listing approved successfully");
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to approve listing";
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      {/* Approve Button */}
      <button
        type="button"
        onClick={handleApprove}
        disabled={isUpdating || isApproved}
        className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
      >
        {isUpdating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CheckCircle2 className="w-5 h-5" />
        )}
        <span>{isApproved ? "Listing Approved" : "Approve listing"}</span>
      </button>

      {/* Reject Button */}
      <button
        type="button"
        onClick={onOpenRejectModal}
        disabled={isUpdating || isRejected}
        className="w-full bg-[#1A1A1A] border border-[#262626] hover:bg-[#202020] text-gray-400 hover:text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
      >
        <XCircle className="w-5 h-5 text-red-500" />
        <span>{isRejected ? "Listing Rejected" : "Reject listing"}</span>
      </button>
    </div>
  );
}

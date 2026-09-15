"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useListingByIdQuery, useUpdateAdminListingStatusMutation } from "@/hooks/useListings";
import { toast } from "sonner";
import {
  ListingDetailSkeleton,
  ListingHeader,
  ListingGallery,
  ListingSpecsGrid,
  ListingSellerCard,
  AdminModerationCard,
} from "./_components";

const UpdateListingModal = dynamic(() => import("@/components/shared/modals/UpdateListingModal"), {
  ssr: false,
});
const RejectListingModal = dynamic(() => import("@/app/admin/listings/RejectListingModal"), {
  ssr: false,
});

export default function AdminListingDetails() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const { data: listing, isLoading, isError, refetch } = useListingByIdQuery(slug);
  const updateStatusMutation = useUpdateAdminListingStatusMutation();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <ListingDetailSkeleton />;

  if (isError || !listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load listing details</h2>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          The requested listing could not be retrieved or does not exist.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/listings"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-[#262626] hover:bg-[#1f1f1f] text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-primary text-black font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleRejectConfirm = async (reason: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: listing.id,
        status: "REJECTED",
        rejectionReason: reason,
      });
      setIsRejectModalOpen(false);
      toast.success("Listing rejected");
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to reject listing";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans">
      <ListingHeader listing={listing} onOpenEditModal={() => setIsEditModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ListingGallery listing={listing} />
          <ListingSpecsGrid listing={listing} />
        </div>
        <div className="space-y-6">
          <ListingSellerCard listing={listing}>
            <AdminModerationCard
              listing={listing}
              onOpenRejectModal={() => setIsRejectModalOpen(true)}
            />
          </ListingSellerCard>
        </div>
      </div>

      {isEditModalOpen && (
        <UpdateListingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          listing={listing}
        />
      )}

      {isRejectModalOpen && (
        <RejectListingModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleRejectConfirm}
          listing={listing}
          isSubmitting={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
}

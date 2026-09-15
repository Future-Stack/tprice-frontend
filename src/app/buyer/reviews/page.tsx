"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, Crown, MessageSquareQuote } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useGetMeQuery } from "@/hooks/useAuth";
import { useGetReviewsQuery } from "@/hooks/useReviews";
import {
  NonVipRestrictedCard,
  SkeletonReviewCard,
  ReviewCard,
  ReviewForm,
  ReviewItem,
} from "./_components";

const UpdateReviewModal = dynamic(
  () => import("./_components/UpdateReviewModal").then((m) => m.UpdateReviewModal),
  { ssr: false }
);

export default function BuyerReviewsPage() {
  const { user: storeUser } = useAuthStore();
  const { data: apiUser, isLoading: isUserLoading } = useGetMeQuery();
  const user = apiUser || storeUser;
  const isVip = Boolean(user?.isVip ?? user?.vipStatus);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch,
  } = useGetReviewsQuery({ page: 1, limit: 20 });

  if (isUserLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#2C2C2E] rounded w-1/3" />
          <div className="h-4 bg-[#2C2C2E] rounded w-1/2" />
          <div className="h-64 bg-[#1C1C1E] rounded-2xl border border-[#2C2C2E]" />
        </div>
      </div>
    );
  }

  if (!isVip) {
    return <NonVipRestrictedCard />;
  }

  const reviewsList = reviewsResponse?.data || [];
  const userFullName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
  const userAvatarUrl = user?.avatarUrl || "";

  return (
    <div className="mx-auto max-w-full relative z-0 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E78F23]/15 text-primary border border-[#E78F23]/30 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" fill="currentColor" /> VIP Exclusive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold tracking-wide text-white">
              VIP Member Reviews
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Share your prestigious experience and view verified feedback from our VIP global
              network
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E78F23]/20 cursor-pointer active:scale-95"
          >
            {isFormOpen ? (
              <>
                <X className="w-4 h-4" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Submit Review
              </>
            )}
          </button>
        </AnimationWrapper>
      </div>

      {/* Review Submission Form Section */}
      {isFormOpen && (
        <AnimationWrapper type="fade-down" duration={0.4}>
          <ReviewForm
            userFullName={userFullName}
            userAvatarUrl={userAvatarUrl}
            onSuccess={() => {
              setIsFormOpen(false);
              refetch();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </AnimationWrapper>
      )}

      {/* Reviews Feed Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-clash font-semibold text-white flex items-center gap-2">
            Published Member Reviews
          </h3>
          <span className="text-xs text-gray-400">Total {reviewsList.length} verified reviews</span>
        </div>

        {isReviewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonReviewCard key={i} />
            ))}
          </div>
        ) : isReviewsError ? (
          <div className="p-8 text-center bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl">
            <p className="text-red-400 text-sm font-medium">
              Failed to load reviews. Please refresh the page.
            </p>
          </div>
        ) : reviewsList.length === 0 ? (
          <AnimationWrapper type="zoom" duration={0.4}>
            <div className="p-12 text-center bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl">
              <MessageSquareQuote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-white font-medium text-base mb-1">No VIP reviews yet</p>
              <p className="text-gray-400 text-xs max-w-md mx-auto mb-5">
                Be the first VIP member to submit a review for ExoticWorld.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-primary text-black font-semibold text-xs rounded-xl cursor-pointer"
              >
                Submit First Review
              </button>
            </div>
          </AnimationWrapper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList.map((review, index) => (
              <AnimationWrapper
                key={review.id}
                type="fade-up"
                duration={0.4}
                delay={0.05 * (index % 4)}
              >
                <ReviewCard review={review} />
              </AnimationWrapper>
            ))}
          </div>
        )}
      </div>

      <UpdateReviewModal
        review={editingReview}
        isOpen={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
      />
    </div>
  );
}

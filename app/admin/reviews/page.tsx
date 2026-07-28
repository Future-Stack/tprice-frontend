"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Tag,
  CheckCircle,
  Award,
  Calendar,
  Eye,
  MessageSquare,
  Trash2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useAdminReviewsQuery,
  useDeleteAdminReviewMutation,
} from "@/hooks/useReviews";
import { ReviewItem } from "@/lib/api/reviews";
import ReviewDetailModal from "./ReviewDetailModal";
import Image from "next/image";
import { toast } from "sonner";

const LIMIT_OPTIONS = [10, 20, 50, 100];

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

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-24 h-3 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-48 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-36 h-6 bg-white/10 rounded-lg" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-5 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="w-16 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteReviewMutation = useDeleteAdminReviewMutation();

  const {
    data: reviewsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminReviewsQuery({
    page,
    limit,
  });

  const reviews = reviewsResponse?.data || [];
  const meta = reviewsResponse?.meta || {
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

  const handleViewReview = (review: ReviewItem) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (id: string, reviewerName: string) => {
    try {
      await deleteReviewMutation.mutateAsync(id);
      toast.success(`Review by "${reviewerName}" deleted successfully`);
      if (selectedReview?.id === id) {
        setIsModalOpen(false);
        setSelectedReview(null);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete review",
      );
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
              Reviews Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Monitor customer reviews, ratings, and VIP testimonials
            </p>
          </div>
        </AnimationWrapper>
      </div>

      {/* Filter & Controls Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
          <div className="flex items-center gap-3">
            {/* Per Page Limit Selector */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="hidden sm:inline">Per page:</span>
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
        </AnimationWrapper>

        {/* Refresh Action */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
            title="Refresh reviews list"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full">
              <thead>
                <tr className="bg-[#151515] border-b border-primary/20">
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Reviewer
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Rating
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Content
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Highlight Tags
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Created At
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-red-400"
                    >
                      Failed to load reviews. {(error as Error)?.message}
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <MessageSquare className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No reviews found
                        </p>
                        <p className="text-xs text-gray-500">
                          There are currently no reviews submitted.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Reviewer */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#262626] bg-[#1A1A1C] shrink-0 flex items-center justify-center">
                            {review.avatarUrl ? (
                              <Image
                                src={review.avatarUrl}
                                alt={review.reviewerName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {review.reviewerName}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              {review.reviewerTitle && (
                                <span>{review.reviewerTitle}</span>
                              )}
                              {review.reviewerLocation && (
                                <span className="flex items-center gap-0.5 text-gray-500">
                                  <MapPin className="w-3 h-3 text-primary/70" />
                                  {review.reviewerLocation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-gray-300 ml-1">
                            {review.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="px-6 py-5 text-xs text-gray-300 max-w-xs">
                        <p className="line-clamp-2 italic">
                          &quot;{review.content}&quot;
                        </p>
                      </td>

                      {/* Highlight Tags */}
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {review.highlightTags &&
                          review.highlightTags.length > 0 ? (
                            review.highlightTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20"
                              >
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 italic text-xs">
                              None
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 items-start">
                          {review.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/30">
                              <Award className="w-3 h-3" />
                              Featured
                            </span>
                          )}
                          {review.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(review.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewReview(review)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1C] hover:bg-primary hover:text-black text-gray-300 rounded-lg border border-[#262626] transition-all text-xs font-medium cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteReview(review.id, review.reviewerName)
                            }
                            disabled={
                              deleteReviewMutation.isPending &&
                              deleteReviewMutation.variables === review.id
                            }
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            title="Delete review"
                          >
                            <Trash2
                              className={`w-3.5 h-3.5 ${
                                deleteReviewMutation.isPending &&
                                deleteReviewMutation.variables === review.id
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && reviews.length > 0 && (
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
                of{" "}
                <span className="font-semibold text-white">{meta.total}</span>{" "}
                reviews
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
                          ? "bg-primary text-black border-primary font-bold shadow-[0_2px_10px_rgba(231,143,35,0.3)]"
                          : "bg-[#1A1A1C] border-[#262626] text-gray-300 hover:text-white hover:border-primary/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
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

      {/* Review Details Modal */}
      <ReviewDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview}
        onDelete={handleDeleteReview}
        isDeleting={deleteReviewMutation.isPending}
      />
    </div>
  );
}

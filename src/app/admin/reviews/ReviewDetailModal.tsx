"use client";

import React from "react";
import { X, Star, Calendar, MapPin, Tag, User, CheckCircle, Award, Trash2 } from "lucide-react";
import { ReviewItem } from "@/lib/api/reviews";
import Image from "next/image";

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewItem | null;
  onDelete?: (id: string, reviewerName: string) => void;
  isDeleting?: boolean;
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
  onDelete,
  isDeleting = false,
}: ReviewDetailModalProps) {
  if (!isOpen || !review) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/20 via-primary to-primary/20" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#262626] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Reviewer Card */}
        <div className="flex items-start gap-4 pb-6 border-b border-[#262626] pr-10">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 bg-[#1A1A1C] shrink-0 flex items-center justify-center">
            {review.avatarUrl ? (
              <Image
                src={review.avatarUrl}
                alt={review.reviewerName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-white font-clash">
                {review.reviewerName}
              </h3>
              {review.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/30">
                  <Award className="w-3 h-3" />
                  Featured
                </span>
              )}
              {review.isApproved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              )}
            </div>

            {review.reviewerTitle && (
              <p className="text-sm font-medium text-gray-300">
                {review.reviewerTitle}
              </p>
            )}

            {review.reviewerLocation && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {review.reviewerLocation}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Rating */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-bold text-white">
                {review.rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Review Content
            </label>
            <div className="p-4 rounded-xl bg-[#1A1A1C] border border-[#262626] text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              &quot;{review.content}&quot;
            </div>
          </div>

          {/* Highlight Tags */}
          {review.highlightTags && review.highlightTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-primary" />
                Highlight Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {review.highlightTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#262626] text-xs">
            <div>
              <span className="text-gray-500 block mb-1">Created At</span>
              <span className="text-gray-300 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Review ID</span>
              <span className="text-gray-400 font-mono text-[11px] break-all">
                {review.id}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3">
          {onDelete && (
            <button
              onClick={() => onDelete(review.id, review.reviewerName)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Review
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1C] hover:bg-[#222225] border border-[#262626] text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

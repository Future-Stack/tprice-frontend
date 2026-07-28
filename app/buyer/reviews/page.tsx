"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  X,
  Upload,
  Loader2,
  Crown,
  MapPin,
  Quote,
  Lock,
  Sparkles,
  User,
  Tag,
  Building,
  CheckCircle2,
  MessageSquareQuote,
} from "lucide-react";
import { toast } from "sonner";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useGetMeQuery } from "@/hooks/useAuth";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
} from "@/hooks/useReviews";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { ReviewItem } from "@/lib/api/reviews";
import Link from "next/link";
import Image from "next/image";

const RECOMMENDED_TAGS = [
  "BUGATTI CHIRON",
  "MONACO PENTHOUSE",
  "SUPERCAR ACCESS",
  "OFF-MARKET ASSETS",
  "PRIVATE YACHT",
  "VIP SERVICE",
];

export default function BuyerReviewsPage() {
  const { user: storeUser } = useAuthStore();
  const { data: apiUser, isLoading: isUserLoading } = useGetMeQuery();
  const user = apiUser || storeUser;
  const isVip = Boolean(user?.isVip ?? user?.vipStatus);

  // Form states
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerTitle, setReviewerTitle] = useState("");
  const [reviewerLocation, setReviewerLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [highlightTags, setHighlightTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Modal / Form toggle state for mobile & clean UI
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Upload mutation & Review creation mutation
  const uploadMutation = useUploadMediaMutation();
  const createReviewMutation = useCreateReviewMutation();

  // Reviews query
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useGetReviewsQuery({ page: 1, limit: 20 });

  // Auto pre-fill reviewer details when user data is available
  useEffect(() => {
    if (user) {
      if (!reviewerName) {
        const name =
          user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "";
        if (name) setReviewerName(name);
      }
      if (!avatarUrl && user.avatarUrl) {
        setAvatarUrl(user.avatarUrl);
      }
    }
  }, [user]);

  // Handle avatar upload
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      const res = await uploadMutation.mutateAsync({
        file,
        folder: "exoticworld/avatars",
      });
      setAvatarUrl(res.url);
      toast.success("Avatar image uploaded successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to upload avatar image",
      );
    }
  };

  // Add tag chip handler
  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim().toUpperCase();
    if (!tag) return;
    if (highlightTags.includes(tag)) {
      toast.info("Tag already added");
      setTagInput("");
      return;
    }
    if (highlightTags.length >= 5) {
      toast.warning("Maximum 5 highlight tags allowed");
      return;
    }
    setHighlightTags([...highlightTags, tag]);
    setTagInput("");
  };

  // Remove tag chip handler
  const handleRemoveTag = (tagToRemove: string) => {
    setHighlightTags(highlightTags.filter((t) => t !== tagToRemove));
  };

  // Form Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      toast.error("Please enter your reviewer name");
      return;
    }
    if (!reviewerTitle.trim()) {
      toast.error("Please enter your title (e.g. Private Collector)");
      return;
    }
    if (!reviewerLocation.trim()) {
      toast.error("Please enter your location (e.g. Moscow, Monaco)");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write your review content");
      return;
    }
    if (content.trim().length < 10) {
      toast.error("Review content should be at least 10 characters long");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        reviewerName: reviewerName.trim(),
        reviewerTitle: reviewerTitle.trim(),
        reviewerLocation: reviewerLocation.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        rating,
        content: content.trim(),
        highlightTags: highlightTags.length > 0 ? highlightTags : undefined,
      });

      toast.success(
        "Thank you! Your VIP review has been submitted successfully.",
      );

      // Reset form
      setContent("");
      setRating(5);
      setHighlightTags([]);
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    }
  };

  // Loading state check for initial user auth state
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

  // Non-VIP protection state
  if (!isVip) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <AnimationWrapper type="zoom" duration={0.5}>
          <div className="bg-[#1C1C1E] border border-[#E78F23]/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E78F23]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="w-16 h-16 bg-[#E78F23]/10 border border-[#E78F23]/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#E78F23]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E78F23]/10 border border-[#E78F23]/30 rounded-full text-xs font-semibold text-[#E78F23] mb-4">
              <Crown className="w-3.5 h-3.5" fill="currentColor" /> VIP
              Membership Required
            </div>

            <h2 className="text-2xl sm:text-3xl font-clash font-semibold text-white mb-3">
              VIP Review Access Restricted
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              The Reviews section is exclusively reserved for VIP Members of
              ExoticWorld. Upgrade your account to leave official member reviews
              and gain access to luxury off-market deals.
            </p>

            <Link href="/buyer/settings">
              <button className="px-6 py-3 bg-[#E78F23] hover:bg-[#D47D17] text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E78F23]/20 flex items-center gap-2 mx-auto cursor-pointer">
                Upgrade to VIP Membership{" "}
                <Crown className="w-4 h-4" fill="currentColor" />
              </button>
            </Link>
          </div>
        </AnimationWrapper>
      </div>
    );
  }

  const reviewsList = reviewsResponse?.data || [];

  return (
    <div className="mx-auto max-w-full relative z-0 px-4 sm:px-6 lg:px-8 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E78F23]/15 text-[#E78F23] border border-[#E78F23]/30 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" fill="currentColor" /> VIP Exclusive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold tracking-wide text-white">
              VIP Member Reviews
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Share your prestigious experience and view verified feedback from
              our VIP global network
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-[#E78F23] hover:bg-[#D47D17] text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E78F23]/20 cursor-pointer active:scale-95"
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

      {/* ── Review Submission Form Section ── */}
      {isFormOpen && (
        <AnimationWrapper type="fade-down" duration={0.4}>
          <div className="bg-[#1C1C1E] border border-[#E78F23]/30 rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E78F23]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2C2C2E]">
              <div className="w-10 h-10 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 flex items-center justify-center text-[#E78F23]">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-clash font-semibold text-white">
                  Write a VIP Review
                </h3>
                <p className="text-gray-400 text-xs">
                  Your review will be shared with the ExoticWorld community upon
                  approval
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name, Title, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Reviewer Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Reviewer Name <span className="text-[#E78F23]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Alexander Petrov"
                      className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
                      required
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Reviewer Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Reviewer Title <span className="text-[#E78F23]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reviewerTitle}
                      onChange={(e) => setReviewerTitle(e.target.value)}
                      placeholder="e.g. Private Collector"
                      className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
                      required
                    />
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Reviewer Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Location <span className="text-[#E78F23]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reviewerLocation}
                      onChange={(e) => setReviewerLocation(e.target.value)}
                      placeholder="e.g. Moscow / Monaco"
                      className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E78F23] transition-colors"
                      required
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Row 2: Avatar Upload & Star Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar URL & Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Avatar Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full bg-[#18181A] border border-[#2C2C2E] overflow-hidden shrink-0 flex items-center justify-center">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                      {uploadMutation.isPending && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-[#E78F23] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181A] hover:bg-[#2C2C2E] border border-[#2C2C2E] text-white text-xs font-medium rounded-xl cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#E78F23]" />
                        <span>
                          {uploadMutation.isPending
                            ? "Uploading..."
                            : "Upload Avatar"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          disabled={uploadMutation.isPending}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-gray-500">
                        Or enter direct image URL below:
                      </p>
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E78F23]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Overall Rating ({rating}.0 / 5.0)
                  </label>
                  <div className="flex items-center gap-2 bg-[#18181A] border border-[#2C2C2E] rounded-xl p-3.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoveredRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isFilled
                                ? "text-[#E78F23] fill-[#E78F23]"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-3 text-sm font-semibold text-white">
                      {rating === 5
                        ? "Exceptional (5/5)"
                        : rating === 4
                          ? "Very Good (4/5)"
                          : rating === 3
                            ? "Good (3/5)"
                            : rating === 2
                              ? "Fair (2/5)"
                              : "Poor (1/5)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Review Content <span className="text-[#E78F23]">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500">
                    {content.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details about your experience with ExoticWorld off-market deals, concierge service, and VIP membership perks..."
                  className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E78F23] transition-colors leading-relaxed"
                  required
                />
              </div>

              {/* Highlight Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Highlight Tags (e.g. BUGATTI CHIRON, MONACO PENTHOUSE)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {highlightTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E78F23]/15 border border-[#E78F23]/30 rounded-lg text-xs font-semibold text-[#E78F23]"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type custom tag and press Enter or click Add"
                      className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#E78F23]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-4 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3D] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Quick Add Tag Suggestions */}
                <div className="mt-3">
                  <span className="text-[11px] text-gray-500 mr-2">
                    Quick suggestions:
                  </span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {RECOMMENDED_TAGS.map((recTag) => {
                      const isAdded = highlightTags.includes(recTag);
                      return (
                        <button
                          key={recTag}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddTag(recTag)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            isAdded
                              ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                              : "bg-[#18181A] border-[#2C2C2E] text-gray-400 hover:text-white hover:border-[#E78F23]/40"
                          }`}
                        >
                          + {recTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C2C2E]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-gray-400 font-medium text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="px-6 py-2.5 bg-[#E78F23] hover:bg-[#D47D17] text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E78F23]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Submit VIP Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </AnimationWrapper>
      )}

      {/* ── Reviews Feed Section ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-clash font-semibold text-white flex items-center gap-2">
            Published Member Reviews
          </h3>
          <span className="text-xs text-gray-400">
            Total {reviewsList.length} verified reviews
          </span>
        </div>

        {/* Loading Skeleton */}
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
              <p className="text-white font-medium text-base mb-1">
                No VIP reviews yet
              </p>
              <p className="text-gray-400 text-xs max-w-md mx-auto mb-5">
                Be the first VIP member to submit a review for ExoticWorld.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-[#E78F23] text-black font-semibold text-xs rounded-xl cursor-pointer"
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
    </div>
  );
}

/* ─── Review Card Component ─── */
function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#E78F23]/30 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group">
      <div>
        {/* Header: Rating & VIP badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (review.rating || 5)
                    ? "text-[#E78F23] fill-[#E78F23]"
                    : "text-gray-600"
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-semibold text-white">
              {review.rating}.0
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E78F23]/10 text-[#E78F23] border border-[#E78F23]/25 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VIP Verified
          </span>
        </div>

        {/* Content */}
        <div className="relative mb-6">
          <Quote className="w-8 h-8 text-[#E78F23]/15 absolute -top-2 -left-2 pointer-events-none" />
          <p className="text-gray-300 text-sm leading-relaxed relative z-10 pl-2">
            "{review.content}"
          </p>
        </div>

        {/* Highlight Tags */}
        {review.highlightTags && review.highlightTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {review.highlightTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-[#18181A] border border-[#2C2C2E] rounded-md text-[10px] font-bold text-[#E78F23] tracking-wider uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reviewer Profile Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#2C2C2E]/60 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#2C2C2E] overflow-hidden shrink-0 border border-[#E78F23]/20 flex items-center justify-center">
          {review.avatarUrl ? (
            <Image
              src={review.avatarUrl}
              alt={review.reviewerName}
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {review.reviewerName}
          </h4>
          <p className="text-xs text-gray-400 truncate">
            {review.reviewerTitle}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#18181A] px-2.5 py-1 rounded-lg border border-[#2C2C2E]">
          <MapPin className="w-3 h-3 text-[#E78F23]" />
          <span>{review.reviewerLocation}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Loading Card ─── */
function SkeletonReviewCard() {
  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-[#2C2C2E] rounded w-24" />
        <div className="h-4 bg-[#2C2C2E] rounded w-20" />
      </div>
      <div className="space-y-2 py-2">
        <div className="h-3 bg-[#2C2C2E] rounded w-full" />
        <div className="h-3 bg-[#2C2C2E] rounded w-5/6" />
        <div className="h-3 bg-[#2C2C2E] rounded w-4/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-[#2C2C2E] rounded w-20" />
        <div className="h-5 bg-[#2C2C2E] rounded w-24" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-[#2C2C2E]">
        <div className="w-10 h-10 bg-[#2C2C2E] rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-[#2C2C2E] rounded w-32" />
          <div className="h-2 bg-[#2C2C2E] rounded w-24" />
        </div>
      </div>
    </div>
  );
}

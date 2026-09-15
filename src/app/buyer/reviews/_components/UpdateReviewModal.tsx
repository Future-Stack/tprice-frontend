import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Edit3,
  User,
  Building,
  MapPin,
  Upload,
  Loader2,
  Star,
  Tag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useUpdateReviewMutation } from "@/hooks/useReviews";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { RECOMMENDED_TAGS } from "./types";
import type { UpdateReviewModalProps, ReviewItem } from "./types";

export function UpdateReviewModal({ review, isOpen, onClose }: UpdateReviewModalProps) {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <UpdateReviewForm key={review.id} review={review} onClose={onClose} />
    </div>
  );
}

function UpdateReviewForm({ review, onClose }: { review: ReviewItem; onClose: () => void }) {
  const [reviewerName, setReviewerName] = useState(review.reviewerName || "");
  const [reviewerTitle, setReviewerTitle] = useState(review.reviewerTitle || "");
  const [reviewerLocation, setReviewerLocation] = useState(review.reviewerLocation || "");
  const [avatarUrl, setAvatarUrl] = useState(review.avatarUrl || "");
  const [rating, setRating] = useState(review.rating || 5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState(review.content || "");
  const [highlightTags, setHighlightTags] = useState<string[]>(review.highlightTags || []);
  const [tagInput, setTagInput] = useState("");

  const uploadMutation = useUploadMediaMutation();
  const updateReviewMutation = useUpdateReviewMutation();

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to upload avatar image"
      );
    }
  };

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

  const handleRemoveTag = (tagToRemove: string) => {
    setHighlightTags(highlightTags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      toast.error("Please enter reviewer name");
      return;
    }
    if (!reviewerTitle.trim()) {
      toast.error("Please enter reviewer title");
      return;
    }
    if (!reviewerLocation.trim()) {
      toast.error("Please enter reviewer location");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write review content");
      return;
    }
    if (content.trim().length < 10) {
      toast.error("Review content should be at least 10 characters long");
      return;
    }

    try {
      await updateReviewMutation.mutateAsync({
        id: review.id,
        payload: {
          reviewerName: reviewerName.trim(),
          reviewerTitle: reviewerTitle.trim(),
          reviewerLocation: reviewerLocation.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          rating,
          content: content.trim(),
          highlightTags: highlightTags.length > 0 ? highlightTags : [],
        },
      });

      toast.success("VIP review updated successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update review. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#1C1C1E] border border-[#E78F23]/40 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2C2C2E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 flex items-center justify-center text-primary">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-clash font-semibold text-white">Update VIP Review</h3>
            <p className="text-gray-400 text-xs">
              Modify your review details, rating, or highlight tags
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-[#2C2C2E] hover:bg-[#3A3A3D] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name, Title, Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Reviewer Name <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Alexander Petrov"
                className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Reviewer Title <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={reviewerTitle}
                onChange={(e) => setReviewerTitle(e.target.value)}
                placeholder="e.g. Private Collector"
                className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                required
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Location <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={reviewerLocation}
                onChange={(e) => setReviewerLocation(e.target.value)}
                placeholder="e.g. Moscow"
                className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                required
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Row 2: Avatar Upload & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181A] hover:bg-[#2C2C2E] border border-[#2C2C2E] text-white text-xs font-medium rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>{uploadMutation.isPending ? "Uploading..." : "Upload New Avatar"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    disabled={uploadMutation.isPending}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Rating ({rating}.0 / 5.0)
            </label>
            <div className="flex items-center gap-2 bg-[#18181A] border border-[#2C2C2E] rounded-xl p-3">
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
                      className={`w-6 h-6 transition-colors ${
                        isFilled ? "text-primary fill-primary" : "text-gray-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Review Content <span className="text-primary">*</span>
            </label>
            <span className="text-[11px] text-gray-500">{content.length} characters</span>
          </div>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary transition-colors leading-relaxed"
            required
          />
        </div>

        {/* Highlight Tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Highlight Tags
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {highlightTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 rounded-lg text-xs font-semibold text-primary"
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
              placeholder="Type tag and press Enter"
              className="flex-1 bg-[#18181A] border border-[#2C2C2E] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => handleAddTag()}
              className="px-4 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3D] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Add Tag
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-3">
            <span className="text-[11px] text-gray-500 mr-2">Quick suggestions:</span>
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

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C2C2E]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-gray-400 font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateReviewMutation.isPending}
            className="px-6 py-2.5 bg-primary hover:bg-primary/80 text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {updateReviewMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

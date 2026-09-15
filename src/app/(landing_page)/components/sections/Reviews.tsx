"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star, Crown } from "lucide-react";
import { useGetReviewsQuery } from "@/hooks/useReviews";
import { ReviewItem } from "@/lib/api/reviews";
import Image from "next/image";

const DEFAULT_AVATAR =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: reviewsResponse, isLoading } = useGetReviewsQuery({
    page: 1,
    limit: 10,
  });

  const reviews: ReviewItem[] = reviewsResponse?.data || [];

  const currentActiveIndex = activeIndex >= reviews.length ? 0 : activeIndex;
  const currentReview = reviews[currentActiveIndex];

  const next = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  const getHighlightText = (review: ReviewItem) => {
    if (review.highlightTags && review.highlightTags.length > 0) {
      return review.highlightTags.join(" • ");
    }
    const parts = [review.reviewerTitle, review.reviewerLocation].filter(
      Boolean,
    );
    if (parts.length > 0) {
      return parts.join(" • ").toUpperCase();
    }
    return "VIP MEMBER";
  };

  const getRoleText = (review: ReviewItem) => {
    const parts = [review.reviewerTitle, review.reviewerLocation].filter(
      Boolean,
    );
    return parts.length > 0 ? parts.join(", ") : "VIP Member";
  };

  return (
    <section className="py-24 bg-[#050505] px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-[16px] font-normal font-montserrat uppercase mb-4 block"
          >
            CLIENT VOICES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl font-normal md:text-5xl font-cormorant"
          >
            VIP Member Reviews
          </motion.h2>
        </div>

        {isLoading ? (
          <ReviewsSkeleton />
        ) : reviews.length === 0 ? (
          <div className=" text-center py-12 px-6 bg-[#1A1A1A] rounded-2xl border border-white/10">
            <Quote
              className="w-12 h-12 text-primary/30 mx-auto mb-4"
              strokeWidth={1}
            />
            <h3 className="text-white text-lg font-serif mb-2">
              No VIP Reviews Yet
            </h3>
            <p className="text-white/40 text-xs">
              Check back soon for verified reviews from our VIP global network.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto relative group">
            {/* Review Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1A] rounded-2xl p-8 md:p-16 relative overflow-hidden"
            >
              {/* Background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center text-center relative z-10 px-12 md:px-24">
                <Image
                  src="/quote.svg"
                  alt="quote"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                {/* Rating Stars */}
                <div className="flex gap-1 mb-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (currentReview.rating || 5)
                          ? "fill-primary text-primary"
                          : "text-white/20 fill-transparent"
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReview.id || currentActiveIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-xl md:text-2xl text-white/80 font-montserrat mb-12 max-w-258.25">
                      “{currentReview.content}”
                    </p>

                    <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full py-1.5 px-6 mb-10 bg-primary/5">
                      <Crown className="w-4 h-4 text-primary" />
                      <span className="text-[10px] md:text-[16px] font-montserrat font-normal text-white  uppercase">
                        {getHighlightText(currentReview)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <Image
                          src={currentReview.avatarUrl || DEFAULT_AVATAR}
                          alt={currentReview.reviewerName || "Reviewer"}
                          onError={handleImageError}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20  "
                          width={56}
                          height={56}
                        />
                      </div>
                      <div className=" ">
                        <h4 className="text-[24px] text-left font-montserrat text-[#E0E0E0] mb-1">
                          {currentReview.reviewerName || "Anonymous Member"}
                        </h4>
                        <p className="text-[#9C9C9C] text-left text-[16px]  font-montserrat">
                          {getRoleText(currentReview)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Inside the Card) */}
                {reviews.length > 1 && (
                  <>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-6 lg:left-8 z-20">
                      <button
                        onClick={prev}
                        className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Previous review"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-6 lg:right-8 z-20">
                      <button
                        onClick={next}
                        className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Next review"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Bottom Avatar Selectors */}
            {reviews.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pb-12">
                {reviews.map((review, i) => (
                  <button
                    key={review.id || i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative group transition-all duration-300 ${
                      currentActiveIndex === i
                        ? "scale-115"
                        : "scale-90 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-100"
                    }`}
                    aria-label={`Go to review by ${review.reviewerName}`}
                  >
                    <img
                      src={review.avatarUrl || DEFAULT_AVATAR}
                      alt={review.reviewerName || "Reviewer"}
                      onError={handleImageError}
                      className={`w-10 h-10 rounded-full object-cover ${
                        currentActiveIndex === i
                          ? "border-2 border-primary"
                          : "border border-white/10"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="bg-[#1A1A1A] rounded-2xl p-8 md:p-16 relative overflow-hidden animate-pulse">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center relative z-10 px-12 md:px-24">
          {/* Quote Icon Skeleton */}
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-8">
            <Quote className="w-8 h-8 text-white/10" strokeWidth={1} />
          </div>

          {/* Stars Skeleton */}
          <div className="flex gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-white/10" />
            ))}
          </div>

          {/* Content text lines skeleton */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-3 mb-12">
            <div className="h-5 bg-white/10 rounded-md w-full" />
            <div className="h-5 bg-white/10 rounded-md w-5/6" />
            <div className="h-5 bg-white/10 rounded-md w-2/3" />
          </div>

          {/* Tag Skeleton */}
          <div className="h-8 w-56 bg-white/10 rounded-full mb-10" />

          {/* Reviewer Profile Skeleton */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-primary/20 mb-4" />
            <div className="h-5 w-40 bg-white/10 rounded mb-2" />
            <div className="h-3.5 w-32 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Avatar Selectors Skeleton */}
      <div className="flex justify-center items-center gap-4 mt-12 pb-12">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

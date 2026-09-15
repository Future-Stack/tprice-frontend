import React from "react";
import Image from "next/image";
import { Star, CheckCircle2, Quote, User, MapPin } from "lucide-react";
import type { ReviewCardProps } from "./types";

export function ReviewCard({ review }: ReviewCardProps) {
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
                  i < (review.rating || 5) ? "text-primary fill-primary" : "text-gray-600"
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-semibold text-white">{review.rating}.0</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E78F23]/10 text-primary border border-[#E78F23]/25 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> VIP Verified
          </span>
        </div>

        {/* Content */}
        <div className="relative mb-6">
          <Quote className="w-8 h-8 text-[#E78F23]/15 absolute -top-2 -left-2 pointer-events-none" />
          <p className="text-gray-300 text-sm leading-relaxed relative z-10 pl-2">
            &ldquo;{review.content}&rdquo;
          </p>
        </div>

        {/* Highlight Tags */}
        {review.highlightTags && review.highlightTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {review.highlightTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-[#18181A] border border-[#2C2C2E] rounded-md text-[10px] font-bold text-primary tracking-wider uppercase"
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
          <h4 className="text-sm font-semibold text-white truncate">{review.reviewerName}</h4>
          <p className="text-xs text-gray-400 truncate">{review.reviewerTitle}</p>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#18181A] px-2.5 py-1 rounded-lg border border-[#2C2C2E]">
          <MapPin className="w-3 h-3 text-primary" />
          <span>{review.reviewerLocation}</span>
        </div>
      </div>
    </div>
  );
}

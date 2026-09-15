import React from "react";

export function SkeletonReviewCard() {
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

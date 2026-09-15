import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MarketplacePaginationProps } from "./types";

export function MarketplacePagination({
  page,
  totalPages,
  totalItems,
  currentCount,
  isFetching,
  onPageChange,
}: MarketplacePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-[#2C2C2E]">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-white">{currentCount}</span> of{" "}
        <span className="font-semibold text-white">{totalItems}</span> listings
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1 || isFetching}
          className="p-2 rounded-lg bg-[#1C1C1E] border border-[#2C2C2E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#E78F23] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg text-xs font-semibold text-white">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages || isFetching}
          className="p-2 rounded-lg bg-[#1C1C1E] border border-[#2C2C2E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#E78F23] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default MarketplacePagination;

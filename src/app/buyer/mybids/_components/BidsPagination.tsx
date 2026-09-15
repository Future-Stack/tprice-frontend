import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BidsPaginationProps } from "./types";

export function BidsPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: BidsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#2C2C2E]">
      <p className="text-xs text-gray-400">
        Showing <span className="font-bold text-white">{(page - 1) * limit + 1}</span> to{" "}
        <span className="font-bold text-white">{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-bold text-white">{total}</span> bids
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="p-2 bg-[#161618] border border-[#2C2C2E] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs text-gray-400 font-medium px-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
          className="p-2 bg-[#161618] border border-[#2C2C2E] rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BidsPagination;

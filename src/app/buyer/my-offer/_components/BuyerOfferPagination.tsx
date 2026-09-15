import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BuyerOfferPaginationProps } from "./types";

export function BuyerOfferPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: BuyerOfferPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="text-xs text-gray-400">
        Showing <span className="font-bold text-white">{(page - 1) * limit + 1}</span> to{" "}
        <span className="font-bold text-white">{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-bold text-white">{total}</span> offers
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <div className="text-xs font-semibold px-2 text-white/60">
          Page {page} of {totalPages}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default BuyerOfferPagination;

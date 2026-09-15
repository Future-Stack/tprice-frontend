import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VIPDealsPaginationProps } from "./types";

export function VIPDealsPagination({
  currentPage,
  totalPages,
  totalItems,
  currentCount,
  isFetching,
  onPageChange,
}: VIPDealsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-4 sm:px-6">
      <p className="text-xs sm:text-sm text-gray-400">
        Showing <span className="font-semibold text-white">{currentCount}</span> of{" "}
        <span className="font-semibold text-white">{totalItems}</span> VIP deals
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-[#18181A] border border-[#2C2C2E] rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2C2C2E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1)
            .filter((p) => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="text-gray-500 text-xs px-1">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === p
                      ? "bg-primary text-black shadow-md"
                      : "bg-[#18181A] text-gray-400 border border-[#2C2C2E] hover:text-white"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary transition-colors cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default VIPDealsPagination;

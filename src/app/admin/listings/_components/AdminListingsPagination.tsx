import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminListingsPaginationProps } from "./types";

export function AdminListingsPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: AdminListingsPaginationProps) {
  if (total === 0) return null;

  return (
    <div className="px-6 py-4 bg-[#141416] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
      <div>
        Showing <span className="font-semibold text-white">{(page - 1) * limit + 1}</span> to{" "}
        <span className="font-semibold text-white">{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-semibold text-white">{total}</span> listings
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
              pageNum === page
                ? "bg-primary text-black border-primary font-bold shadow-[0_2px_10px_rgba(234,179,8,0.3)]"
                : "bg-[#1A1A1C] border-[#262626] text-gray-300 hover:text-white hover:border-primary/40"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AdminListingsPagination;

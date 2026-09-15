import React from "react";
import Link from "next/link";
import { Gavel } from "lucide-react";

export function BidsEmptyState() {
  return (
    <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-12 text-center my-8">
      <div className="w-16 h-16 bg-[#2C2C2E]/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E78F23]">
        <Gavel className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-clash font-medium text-white mb-2">No Bids Placed Yet</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
        You haven&apos;t submitted any offers or bids on listings yet. Explore the marketplace to
        place your first bid.
      </p>
      <Link
        href="/buyer/marketplace"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E78F23] hover:bg-[#d47f1b] text-black text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg"
      >
        Browse Marketplace
      </Link>
    </div>
  );
}

export default BidsEmptyState;

import React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";

export function BuyerOfferEmptyState() {
  return (
    <div className="py-16 text-center space-y-4">
      <Inbox className="w-12 h-12 text-gray-500 mx-auto opacity-60" />
      <h3 className="text-xl font-bold text-white">No offers found</h3>
      <p className="text-sm text-gray-400 max-w-md mx-auto">
        You haven&apos;t submitted any offers yet. Explore active listings to place your first
        offer.
      </p>
      <Link
        href="/inventory"
        className="inline-block px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c4a132] text-black text-xs font-bold uppercase tracking-widest transition-all"
      >
        Browse Listings
      </Link>
    </div>
  );
}

export default BuyerOfferEmptyState;

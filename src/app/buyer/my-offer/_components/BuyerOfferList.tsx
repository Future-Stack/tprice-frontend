import React from "react";
import { AlertCircle } from "lucide-react";
import { BuyerOfferListProps } from "./types";
import { BuyerOfferSkeleton } from "./BuyerOfferSkeleton";
import { BuyerOfferEmptyState } from "./BuyerOfferEmptyState";
import { BuyerOfferCard } from "./BuyerOfferCard";

export function BuyerOfferList({
  offers,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  expandedOfferId,
  onToggleExpand,
  onAccept,
  onWithdraw,
  onOpenCounter,
  isAcceptPending,
  isWithdrawPending,
}: BuyerOfferListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BuyerOfferSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Failed to load offers</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          {errorMessage || "An unexpected error occurred while fetching your offers."}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (offers.length === 0) {
    return <BuyerOfferEmptyState />;
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <BuyerOfferCard
          key={offer.id}
          offer={offer}
          expandedOfferId={expandedOfferId}
          onToggleExpand={onToggleExpand}
          onAccept={onAccept}
          onWithdraw={onWithdraw}
          onOpenCounter={onOpenCounter}
          isAcceptPending={isAcceptPending}
          isWithdrawPending={isWithdrawPending}
        />
      ))}
    </div>
  );
}

export default BuyerOfferList;

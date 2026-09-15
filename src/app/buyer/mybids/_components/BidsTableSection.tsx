import React from "react";
import { BidsTableSectionProps } from "./types";
import { BidTableRow } from "./BidTableRow";

export function BidsTableSection({ bids, selectedBidId, onSelectBid }: BidsTableSectionProps) {
  return (
    <div className="flex-1 min-w-0">
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_repeat(3,100px)_150px] gap-4 mb-6 px-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Item</span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">Your Bid</span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">Highest Bid</span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">Status</span>
        <span />
      </div>

      {/* Scrollable table container */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="space-y-4 min-w-175 sm:min-w-0">
          {bids.map((bid, index) => (
            <BidTableRow
              key={bid.id}
              bid={bid}
              isSelected={selectedBidId === bid.id}
              onSelect={onSelectBid}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BidsTableSection;

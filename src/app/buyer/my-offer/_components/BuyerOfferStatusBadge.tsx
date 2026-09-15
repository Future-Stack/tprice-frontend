import React from "react";

export function BuyerOfferStatusBadge({ status }: { status?: string }) {
  const norm = (status || "").toUpperCase();
  switch (norm) {
    case "PENDING":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20 uppercase tracking-wider">
          Pending
        </span>
      );
    case "ACCEPTED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30 uppercase tracking-wider">
          Accepted
        </span>
      );
    case "REJECTED":
    case "DECLINED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-500/80 border border-red-500/30 uppercase tracking-wider">
          Rejected
        </span>
      );
    case "WITHDRAWN":
    case "CANCELLED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-wider">
          Withdrawn
        </span>
      );
    case "COUNTERED":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500/80 border border-orange-500/20 uppercase tracking-wider">
          Countered
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-white/10 uppercase tracking-wider">
          {status || "Unknown"}
        </span>
      );
  }
}

export default BuyerOfferStatusBadge;

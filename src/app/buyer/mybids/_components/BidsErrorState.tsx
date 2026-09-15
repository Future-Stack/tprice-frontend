import React from "react";
import { AlertTriangle } from "lucide-react";
import { BidsErrorStateProps } from "./types";

export function BidsErrorState({ errorMessage, onRetry }: BidsErrorStateProps) {
  return (
    <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-8 text-center my-8">
      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-white mb-1">Failed to load bids</h3>
      <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
        {errorMessage || "An unexpected error occurred while fetching your offers."}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-[#E78F23] hover:bg-[#d47f1b] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}

export default BidsErrorState;

import React from "react";
import Link from "next/link";
import { X, Clock, ArrowUpRight } from "lucide-react";
import type { ViewOfferModalProps } from "./types";

export function ViewOfferModal({
  isOpen,
  onClose,
  existingOffer,
}: ViewOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-clash font-bold text-white">Your Submitted Offer</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Details of your offer for this listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Card */}
        <div className="bg-[#111111] border border-[#2C2C2E] rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Offer Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E78F23]/10 text-primary border border-[#E78F23]/20">
              <Clock className="w-3.5 h-3.5" />
              {existingOffer.status || "PENDING"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-gray-400">Offered Amount</span>
            <span className="text-lg font-clash font-bold text-white">
              $
              {Number(
                existingOffer.currentAmount || existingOffer.initialAmount
              ).toLocaleString()}
            </span>
          </div>

          {existingOffer.histories?.[0]?.note && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Buyer Note</span>
              <p className="text-xs text-gray-300 bg-[#161618] p-2.5 rounded-lg border border-white/5 italic">
                &quot;{existingOffer.histories[0].note}&quot;
              </p>
            </div>
          )}

          {existingOffer.createdAt && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-500">
              <span>Submitted On</span>
              <span>{new Date(existingOffer.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <Link
            href="/buyer/mybids"
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg"
          >
            View in My Bids
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

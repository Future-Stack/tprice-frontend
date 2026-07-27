"use client";

import React, { useState, useEffect } from "react";
import { XCircle, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { ListingItem } from "@/lib/api/listings";

interface RejectListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  listing: ListingItem | null;
  isSubmitting: boolean;
}

const PRESET_REASONS = [
  "Missing proof of ownership documents.",
  "Invalid pricing or currency specifications.",
  "Inappropriate or low-quality media upload.",
  "Incomplete asset details or description.",
];

export default function RejectListingModal({
  isOpen,
  onClose,
  onConfirm,
  listing,
  isSubmitting,
}: RejectListingModalProps) {
  const [reason, setReason] = useState("Missing proof of ownership documents.");

  useEffect(() => {
    if (isOpen) {
      setReason("Missing proof of ownership documents.");
    }
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const mainImage =
    listing.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#141416] border border-[#262626] rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Reject Asset Listing</h3>
              <p className="text-xs text-gray-400">Provide a reason for rejection</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Preview Card */}
        <div className="flex items-center gap-4 p-3 bg-[#1A1A1C] border border-[#262626] rounded-xl">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#262626] bg-[#111] shrink-0">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-white line-clamp-1">
              {listing.title}
            </h4>
            <p className="text-xs text-gray-400 capitalize">
              {listing.category} • {listing.brand || "Listing"}
            </p>
          </div>
        </div>

        {/* Reason Input & Quick Presets */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-[#1A1A1C] border border-[#262626] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60 transition-colors resize-none"
              required
            />
          </div>

          <div>
            <p className="text-[11px] font-medium text-gray-400 mb-2">Quick Presets:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    reason === preset
                      ? "bg-red-500/20 border-red-500/40 text-red-400 font-semibold"
                      : "bg-[#1C1C1E] border-[#262626] text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#1C1C1E] border border-[#262626] hover:border-gray-600 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

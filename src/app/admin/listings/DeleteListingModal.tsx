"use client";

import React from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { ListingItem } from "@/lib/api/listings";

interface DeleteListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  listing: ListingItem | null;
  isDeleting: boolean;
}

export default function DeleteListingModal({
  isOpen,
  onClose,
  onConfirm,
  listing,
  isDeleting,
}: DeleteListingModalProps) {
  if (!isOpen || !listing) return null;

  const mainImage =
    listing.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#141416] border border-[#262626] rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Asset Listing</h3>
              <p className="text-xs text-gray-400">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing preview card */}
        <div className="flex items-center gap-4 p-3 bg-[#1A1A1C] border border-[#262626] rounded-xl">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#262626] bg-[#111] shrink-0">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
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

        {/* Warning text */}
        <p className="text-xs text-gray-300 leading-relaxed">
          Are you sure you want to permanently remove <strong className="text-white">&quot;{listing.title}&quot;</strong> from the marketplace? Associated data will be purged.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#1C1C1E] border border-[#262626] hover:border-gray-600 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

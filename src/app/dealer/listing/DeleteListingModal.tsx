"use client";

import React, { useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !listing) return null;

  const mainImage =
    listing.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans text-gray-100">Delete Listing</h3>
              <p className="text-xs text-gray-400">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing preview card */}
        <div className="flex items-center gap-4 p-3 bg-[#111111] border border-[#2A2A2A] rounded-xl">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#2A2A2A] bg-[#1C1C1C] shrink-0">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-gray-100 line-clamp-1">
              {listing.title}
            </h4>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {listing.category || "Listing"} {listing.subCategory ? `• ${listing.subCategory}` : ""}
            </p>
          </div>
        </div>

        {/* Warning message */}
        <p className="text-sm text-gray-300 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-white">&quot;{listing.title}&quot;</strong>? It will be removed from your dashboard and the marketplace.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#2A2A2A] border border-[#333333] hover:border-gray-500 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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

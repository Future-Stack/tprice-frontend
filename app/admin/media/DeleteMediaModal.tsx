"use client";

import React from "react";
import { AlertTriangle, Trash2, X, Loader2, Image as ImageIcon, Film } from "lucide-react";
import Image from "next/image";
import { LandingMediaItem } from "@/lib/api/media";

interface DeleteMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  mediaItem: LandingMediaItem | null;
  isDeleting: boolean;
}

export default function DeleteMediaModal({
  isOpen,
  onClose,
  onConfirm,
  mediaItem,
  isDeleting,
}: DeleteMediaModalProps) {
  if (!isOpen || !mediaItem) return null;

  const displayImage = mediaItem.thumbnailUrl || mediaItem.mediaUrl;
  const isVideo = mediaItem.type?.toUpperCase() === "VIDEO";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
              <h3 className="text-lg font-bold text-white font-clash">Delete Media Asset</h3>
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

        {/* Media Preview Card */}
        <div className="flex items-center gap-4 p-3 bg-[#1A1A1C] border border-[#262626] rounded-xl">
          <div className="relative w-16 h-14 rounded-lg overflow-hidden border border-[#262626] bg-[#111] shrink-0 flex items-center justify-center">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={mediaItem.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : isVideo ? (
              <Film className="w-6 h-6 text-red-400" />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-white line-clamp-1">
              {mediaItem.title}
            </h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {mediaItem.category || "General"} • {mediaItem.type || "IMAGE"}
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <p className="text-xs text-gray-300 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-white">&quot;{mediaItem.title}&quot;</strong>? This media asset will be removed from the landing page.
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262626]">
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

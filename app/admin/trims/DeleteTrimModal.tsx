"use client";

import React, { useEffect } from "react";
import {
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  Layers,
  Car,
  Award,
  Calendar,
} from "lucide-react";
import { TrimItem } from "@/lib/api/trims";

interface DeleteTrimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  trim: TrimItem | null;
  isDeleting: boolean;
}

export default function DeleteTrimModal({
  isOpen,
  onClose,
  onConfirm,
  trim,
  isDeleting,
}: DeleteTrimModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !trim) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
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
              <h3 className="text-lg font-bold text-white font-clash">
                Delete Trim
              </h3>
              <p className="text-xs text-gray-400">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trim Preview Card */}
        <div className="flex items-center gap-4 p-3.5 bg-[#1A1A1C] border border-[#262626] rounded-xl">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary/20 bg-primary/10 shrink-0 flex items-center justify-center text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-white line-clamp-1">
              {trim.name}
            </h4>
            <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-1.5 font-sans">
              {trim.model && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Car className="w-3 h-3 text-primary" />
                  {trim.model.name}
                </span>
              )}
              {trim.model?.brand && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-gray-400">
                    <Award className="w-3 h-3 text-primary" />
                    {trim.model.brand.name}
                  </span>
                </>
              )}
            </div>
            {(trim.yearStart || trim.yearEnd) && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span>
                  {trim.yearStart || "—"} - {trim.yearEnd || "Present"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Warning Message */}
        <p className="text-sm text-gray-300 leading-relaxed">
          Are you sure you want to permanently delete the trim{" "}
          <strong className="text-white">&quot;{trim.name}&quot;</strong>? This
          will remove all associated trim configuration and vehicle listing
          bindings.
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

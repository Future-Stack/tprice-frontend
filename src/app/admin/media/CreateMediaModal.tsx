"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import { CreateMediaModalProps, CreateMediaForm } from "./_components";

export default function CreateMediaModal({ isOpen, onClose }: CreateMediaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">Create Landing Media</h2>
              <p className="text-xs text-gray-400">
                Add a new banner or promotional media item to the landing page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keyed Form to avoid cascading renders */}
        <CreateMediaForm key={isOpen ? "open" : "closed"} onClose={onClose} />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";
import { ContactInquiryItem, UpdateContactInquiryPayload } from "@/lib/api/contact";

interface UpdateInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: ContactInquiryItem | null;
  onUpdate: (id: string, payload: UpdateContactInquiryPayload) => Promise<void>;
  isUpdating: boolean;
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New Inquiry", icon: AlertCircle, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },

  { value: "RESOLVED", label: "Resolved", icon: CheckCircle2, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
];

export default function UpdateInquiryModal({
  isOpen,
  onClose,
  inquiry,
  onUpdate,
  isUpdating,
}: UpdateInquiryModalProps) {
  const [status, setStatus] = useState<string>("NEW");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "NEW");
      setAdminNotes(inquiry.adminNotes || "");
    }
  }, [inquiry]);

  if (!isOpen || !inquiry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(inquiry.id, {
      status,
      adminNotes: adminNotes.trim() ? adminNotes.trim() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#18181A] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-montserrat">
                Update Inquiry Status
              </h2>
              <p className="text-xs text-gray-400">
                Inquiry from {inquiry.fullName || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Inquiry Overview Summary */}
            <div className="p-3.5 bg-[#1B1B1E] border border-[#262626] rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {inquiry.fullName} ({inquiry.email})
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  &quot;{inquiry.message}&quot;
                </p>
              </div>
            </div>

            {/* Select Status */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 tracking-wider mb-2">
                Status <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = status === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isSelected
                        ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(231,143,35,0.2)]"
                        : "bg-[#1B1B1E] border-[#262626] text-gray-400 hover:text-white hover:border-gray-700"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-gray-500"}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Admin Notes
              </label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Contacted client by phone and resolved inquiry."
                className="w-full bg-[#1B1B1E] border border-[#262626] rounded-xl p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none font-sans"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Internal notes for the admin team regarding actions taken for this inquiry.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#18181A] border-t border-[#262626] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 bg-[#222225] border border-[#333336] text-gray-300 font-medium rounded-xl text-xs hover:text-white hover:bg-[#2A2A2E] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-black font-semibold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-[0_2px_10px_rgba(231,143,35,0.3)] disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

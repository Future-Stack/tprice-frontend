"use client";

import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ContactInquiryItem } from "@/lib/api/contact";
import { toast } from "sonner";

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: ContactInquiryItem | null;
  onOpenUpdateModal?: (inquiry: ContactInquiryItem) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const normalized = status?.toUpperCase();
  switch (normalized) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          NEW
        </span>
      );
    case "RESPONDED":
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {normalized}
        </span>
      );
    case "READ":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
          <Clock className="w-3.5 h-3.5" />
          READ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-300 border border-gray-500/30">
          <AlertCircle className="w-3.5 h-3.5" />
          {status || "UNKNOWN"}
        </span>
      );
  }
};

export default function InquiryDetailModal({
  isOpen,
  onClose,
  inquiry,
  onOpenUpdateModal,
}: InquiryDetailModalProps) {
  if (!isOpen || !inquiry) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#18181A] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-montserrat">
                Inquiry Details
              </h2>
              <p className="text-xs text-gray-400">ID: {inquiry.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="bg-[#1B1B1E] border border-[#262626] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-white truncate mt-0.5">
                  {inquiry.fullName || "N/A"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-[#1B1B1E] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                  Status
                </p>
                <div className="mt-1">{getStatusBadge(inquiry.status)}</div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Submitted</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(inquiry.createdAt)}
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="bg-[#1B1B1E] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-sm font-semibold text-primary hover:underline truncate block mt-0.5"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(inquiry.email, "Email")}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2 cursor-pointer"
                title="Copy Email"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Phone Number */}
            <div className="bg-[#1B1B1E] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                    Phone Number
                  </p>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-sm font-semibold text-primary hover:underline truncate block mt-0.5"
                  >
                    {inquiry.phone || "N/A"}
                  </a>
                </div>
              </div>
              {inquiry.phone && (
                <button
                  onClick={() => copyToClipboard(inquiry.phone, "Phone")}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2 cursor-pointer"
                  title="Copy Phone"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Inquiry Message Box */}
          <div className="bg-[#1B1B1E] border border-[#262626] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-300 tracking-wider">
              <FileText className="w-4 h-4 text-primary" />
              Message Body
            </div>
            <div className="p-4 bg-[#141416] border border-[#2A2A2E] rounded-lg text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
              {inquiry.message || "No message content provided."}
            </div>
          </div>

          {/* Admin Notes if available */}
          {inquiry.adminNotes && (
            <div className="bg-[#1B1B1E] border border-primary/20 rounded-xl p-5 space-y-2">
              <p className="text-xs font-bold uppercase text-primary tracking-wider">
                Admin Notes
              </p>
              <p className="text-xs text-gray-300 italic">
                {inquiry.adminNotes}
              </p>
            </div>
          )}

          {/* Dates metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#262626]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(inquiry.createdAt)}</span>
            </div>
            {inquiry.updatedAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Updated: {formatDate(inquiry.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {/* <div className="px-6 py-4 bg-[#18181A] border-t border-[#262626] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {onOpenUpdateModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUpdateModal(inquiry);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#26262A] hover:bg-[#323236] text-white font-semibold rounded-xl text-xs border border-[#3A3A3E] transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-primary" />
                Update Status / Notes
              </button>
            )}
            <a
              href={`mailto:${inquiry.email}?subject=Response to your inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-[0_2px_10px_rgba(231,143,35,0.3)]"
            >
              <Mail className="w-3.5 h-3.5" />
              Reply via Email
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#222225] border border-[#333336] text-gray-300 font-medium rounded-xl text-xs hover:text-white hover:bg-[#2A2A2E] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}

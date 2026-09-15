"use client";

import React from "react";
import { Check, X, RefreshCcw, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { StatusBadge } from "./types";
import type { OfferHeaderCardProps } from "./types";

export function OfferHeaderCard({
  offer,
  isPending,
  allowCounterOffers,
  accepting,
  rejecting,
  copiedId,
  onCopyId,
  onAccept,
  onOpenCounterModal,
  onReject,
}: OfferHeaderCardProps) {
  return (
    <div className="relative group mb-8">
      <div className="absolute -inset-px bg-linear-to-r from-white/10 via-[#E78F23]/20 to-white/10 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none" />

      <div className="relative bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold font-montserrat tracking-tight text-white">
              Offer Details
            </h1>
            <StatusBadge status={offer.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>ID: {offer.id}</span>
            <button
              onClick={onCopyId}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Copy Offer ID"
            >
              {copiedId ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Quick Action Header Buttons */}
        {isPending && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAccept}
              disabled={accepting}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {accepting ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : (
                <Check size={16} strokeWidth={3} />
              )}
              <span>{accepting ? "Accepting..." : "Accept Offer"}</span>
            </button>

            {allowCounterOffers && (
              <button
                onClick={onOpenCounterModal}
                disabled={accepting}
                className="px-5 py-3 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 text-primary hover:bg-[#E78F23] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw size={16} strokeWidth={2.5} />
                <span>Counter</span>
              </button>
            )}

            <button
              onClick={onReject}
              disabled={accepting || rejecting}
              className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejecting ? (
                <Loader2 size={16} className="animate-spin text-rose-400" />
              ) : (
                <X size={16} strokeWidth={2.5} />
              )}
              <span>{rejecting ? "Rejecting..." : "Reject"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

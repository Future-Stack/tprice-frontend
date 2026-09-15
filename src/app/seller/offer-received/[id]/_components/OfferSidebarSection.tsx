"use client";

import React from "react";
import {
  Handshake,
  CheckCircle2,
  XCircle,
  Flag,
  User,
  ShieldCheck,
  Building,
  Loader2,
} from "lucide-react";
import type { OfferSidebarSectionProps } from "./types";

export function OfferSidebarSection({
  offer,
  isAccepted,
  currentStage,
  updatingStage,
  isUpdatingStage,
  buyerInitial,
  buyerName,
  sellerName,
  onUpdateStage,
}: OfferSidebarSectionProps) {
  return (
    <div className="space-y-8">
      {/* Deal Stage Action Card (Shown only if offer is accepted or deal exists) */}
      {(isAccepted || Boolean(offer.deal)) && (
        <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
              <Handshake size={16} />
              <span>Deal Stage</span>
            </div>
            {currentStage && (
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
                  currentStage === "COMPLETED"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : currentStage === "CANCELLED"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                      : currentStage === "FLAGGED"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/25"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentStage === "COMPLETED"
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse"
                      : currentStage === "CANCELLED"
                        ? "bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                        : currentStage === "FLAGGED"
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse"
                          : "bg-gray-400"
                  }`}
                />
                {currentStage}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Update the deal progression status below.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-1">
            {/* COMPLETED Button */}
            <button
              type="button"
              onClick={() => onUpdateStage("COMPLETED")}
              disabled={isUpdatingStage || currentStage === "COMPLETED"}
              title="Mark deal as COMPLETED"
              className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                currentStage === "COMPLETED"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-white/5 hover:bg-emerald-500/10 border-white/10 text-gray-300 hover:text-emerald-400 hover:border-emerald-500/30"
              } disabled:opacity-50 cursor-pointer active:scale-95`}
            >
              {updatingStage === "COMPLETED" ? (
                <Loader2 size={18} className="animate-spin text-emerald-400" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span className="text-[10px]">Completed</span>
            </button>

            {/* CANCELLED Button */}
            <button
              type="button"
              onClick={() => onUpdateStage("CANCELLED")}
              disabled={isUpdatingStage || currentStage === "CANCELLED"}
              title="Mark deal as CANCELLED"
              className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                currentStage === "CANCELLED"
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "bg-white/5 hover:bg-rose-500/10 border-white/10 text-gray-300 hover:text-rose-400 hover:border-rose-500/30"
              } disabled:opacity-50 cursor-pointer active:scale-95`}
            >
              {updatingStage === "CANCELLED" ? (
                <Loader2 size={18} className="animate-spin text-rose-400" />
              ) : (
                <XCircle size={18} />
              )}
              <span className="text-[10px]">Cancelled</span>
            </button>

            {/* FLAGGED Button */}
            <button
              type="button"
              onClick={() => onUpdateStage("FLAGGED")}
              disabled={isUpdatingStage || currentStage === "FLAGGED"}
              title="Mark deal as FLAGGED"
              className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                currentStage === "FLAGGED"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-white/5 hover:bg-amber-500/10 border-white/10 text-gray-300 hover:text-amber-400 hover:border-amber-500/30"
              } disabled:opacity-50 cursor-pointer active:scale-95`}
            >
              {updatingStage === "FLAGGED" ? (
                <Loader2 size={18} className="animate-spin text-amber-400" />
              ) : (
                <Flag size={18} />
              )}
              <span className="text-[10px]">Flagged</span>
            </button>
          </div>
        </div>
      )}

      {/* Buyer Profile Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23] mb-6 pb-4 border-b border-white/5">
          <User size={16} />
          <span>Buyer Information</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E78F23]/10 border border-[#E78F23]/20 flex items-center justify-center text-[#E78F23] font-bold text-xl shrink-0">
            {buyerInitial}
          </div>
          <div className="space-y-1 overflow-hidden">
            <h4 className="font-bold text-lg text-white truncate">{buyerName}</h4>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs text-gray-400">Verified Buyer</span>
            </div>
            <p className="text-[11px] font-mono text-gray-500 truncate">ID: {offer.buyerId}</p>
          </div>
        </div>
      </div>

      {/* Seller Profile Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 pb-4 border-b border-white/5">
          <Building size={16} />
          <span>Seller Information</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-base text-white">{sellerName}</h4>
          <p className="text-[11px] font-mono text-gray-500">ID: {offer.sellerId}</p>
        </div>
      </div>
    </div>
  );
}

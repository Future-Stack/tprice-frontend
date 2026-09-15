"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Flag,
  ChevronDown,
  Circle,
  Loader2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { formatPrice, formatDate } from "./types";
import type { BuyerOfferSidebarProps } from "./types";

export function BuyerOfferSidebar({
  offer,
  isAccepted,
  currentStage,
  updatingStage,
  isUpdatingStage,
  onUpdateStage,
}: BuyerOfferSidebarProps) {
  const histories = offer.histories || [];

  return (
    <div className="lg:col-span-4">
      <AnimationWrapper type="fade-left">
        <div className="space-y-6">
          {/* Deal Stage Card */}
          {(isAccepted || Boolean(offer?.deal)) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold font-clash">Deal Stage</h2>
                {currentStage && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/80">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        currentStage === "COMPLETED"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          : currentStage === "CANCELLED"
                            ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                            : currentStage === "FLAGGED"
                              ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "bg-[#D4AF37]"
                      }`}
                    />
                    {currentStage}
                  </div>
                )}
              </div>

              <div className="bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 md:p-8 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {/* COMPLETED Button */}
                  <button
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
                    onClick={() => onUpdateStage("CANCELLED")}
                    disabled={isUpdatingStage || currentStage === "CANCELLED"}
                    title="Mark deal as CANCELLED"
                    className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                      currentStage === "CANCELLED"
                        ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-white/5 hover:bg-red-500/10 border-white/10 text-gray-300 hover:text-red-400 hover:border-red-500/30"
                    } disabled:opacity-50 cursor-pointer active:scale-95`}
                  >
                    {updatingStage === "CANCELLED" ? (
                      <Loader2 size={18} className="animate-spin text-red-400" />
                    ) : (
                      <XCircle size={18} />
                    )}
                    <span className="text-[10px]">Cancelled</span>
                  </button>

                  {/* FLAGGED Button */}
                  <button
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
            </div>
          )}

          {/* Order History */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold font-clash">Order History</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/60 cursor-pointer hover:text-white transition-colors">
              recent <ChevronDown size={14} />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-px bg-linear-to-b from-[#D4AF37]/10 to-transparent rounded-[2rem] opacity-50 pointer-events-none" />

            <div className="relative bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 md:p-8 space-y-6 h-full min-h-150">
              <div className="space-y-4">
                {histories.map((item, idx) => {
                  const isBuyer = item.senderId === offer.buyerId;
                  const isLatest = idx === histories.length - 1;
                  return (
                    <div
                      key={item.id}
                      className={`relative group p-5 rounded-2xl border transition-all duration-300 ${
                        isLatest
                          ? "bg-white/5 border-[#D4AF37]/30 ring-1 ring-[#D4AF37]/20"
                          : "bg-white/2 border-white/5 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <Circle
                            size={10}
                            fill={isBuyer ? "#3B82F6" : "#D4AF37"}
                            className={isBuyer ? "text-blue-500" : "text-[#D4AF37]"}
                          />
                        </div>

                        <div className="grow flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              {item.action || "Offer"}
                            </div>
                            <div className="font-bold text-sm text-white/90">
                              {isBuyer ? "Buyer Offer" : "Dealer Counter"}
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg md:text-xl font-black tracking-tight ${
                                isLatest ? "text-white" : "text-white/80"
                              }`}
                            >
                              {formatPrice(item.amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

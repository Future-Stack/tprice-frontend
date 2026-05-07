"use client";

import React from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { Check, X, RefreshCcw, Eye, Clock } from "lucide-react";

const offers = [
  {
    id: 1,
    item: "Ferrari 488 Spider",
    details: '"Cash buyer, ready to proceed immediately. Would..."',
    negotiationRounds: 0,
    buyer: "Alexander V.",
    timeAgo: "2 hours ago",
    amount: "$320,000",
    status: "Action Required",
    actions: ["Accept", "Counter", "Reject"],
  },
  {
    id: 2,
    item: "Azimut Grande 27 Metri",
    details: '"Subject to sea trial and survey."',
    negotiationRounds: 2,
    buyer: "M. Holdings LLC",
    timeAgo: "1 day ago",
    amount: "$6,100,000",
    status: "Countered",
    actions: ["View Details"],
    statusText: "Awaiting Buyer",
  },
  {
    id: 3,
    item: "Modern Bel Air Mansion",
    details: '"Revised offer after our previous discussion. Stan"',
    negotiationRounds: 3,
    buyer: "Private Trust",
    timeAgo: "3 days ago",
    amount: "$13,500,000",
    status: "Action Required",
    actions: ["Accept", "Counter", "Reject"],
  },
  {
    id: 4,
    item: "Rolex Daytona 116500LN",
    details: '"Agreed to the asking price."',
    negotiationRounds: 0,
    buyer: "James T.",
    timeAgo: "1 week ago",
    amount: "$31,500",
    status: "Accepted",
    actions: ["View Details"],
  },
  {
    id: 5,
    item: "Bombardier Global 7500",
    details: '"Can pay via wire transfer today."',
    negotiationRounds: 0,
    buyer: "Aviation Partners",
    timeAgo: "2 weeks ago",
    amount: "$65,000,000",
    status: "Declined",
    actions: ["View Details"],
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Action Required":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#E78F23]/10 text-[#E78F23] border border-[#E78F23]/20">
          Action Required
        </span>
      );
    case "Countered":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Countered
        </span>
      );
    case "Accepted":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
          Accepted
        </span>
      );
    case "Declined":
      return (
        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
          Declined
        </span>
      );
    default:
      return null;
  }
};

function OfferReceieved() {
  return (
    <div className="w-full max-w-350 mx-auto">
      <AnimationWrapper type="fade-up">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-4xl font-medium font-clash tracking-tight mb-3 text-white">
            Offers Received
          </h1>
          <p className="text-gray-400 text-lg">
            Review and manage incoming offers for your active listings.
          </p>
        </div>

        {/* Offers Container */}
        <div className="relative group">
          {/* Subtle glow effect */}
          <div className="absolute -inset-px bg-linear-to-b from-white/10 to-[#E78F23]/20 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none" />
          
          <div className="relative bg-[#111113] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-white/2">
              <div className="col-span-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Item & Details
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Buyer
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">
                Latest Amount
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">
                Status
              </div>
              <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-right">
                Actions
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-6 md:p-8 hover:bg-white/1 transition-all duration-300 group/row"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                    {/* Item & Details */}
                    <div className="col-span-4 space-y-1.5">
                      <h3 className="font-bold text-xl text-white group-hover/row:text-[#E78F23] transition-colors">
                        {offer.item}
                      </h3>
                      <p className="text-sm text-gray-500 italic line-clamp-1 pr-4">
                        {offer.details}
                      </p>
                      {offer.negotiationRounds > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <RefreshCcw size={12} className="text-[#E78F23]" />
                          <span className="text-[10px] font-black uppercase text-[#E78F23] tracking-widest">
                            {offer.negotiationRounds} Negotiation Rounds
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Buyer */}
                    <div className="col-span-2 space-y-0.5">
                      <div className="text-base font-semibold text-white">
                        {offer.buyer}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {offer.timeAgo}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-center">
                      <div className="text-3xl font-black text-[#E78F23] tracking-tighter">
                        {offer.amount}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <StatusBadge status={offer.status} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex flex-col items-end gap-2">
                      {offer.actions.includes("Accept") ? (
                        <div className="flex items-center gap-5">
                          <button className="flex items-center gap-1.5 text-sm font-bold text-green-500 hover:text-green-400 transition-all hover:scale-105 active:scale-95">
                            <Check size={16} strokeWidth={3} /> Accept
                          </button>
                          <button className="flex items-center gap-1.5 text-sm font-bold text-[#E78F23] hover:text-[#f0a54d] transition-all hover:scale-105 active:scale-95">
                            <RefreshCcw size={16} strokeWidth={3} /> Counter
                          </button>
                          <button className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-400 transition-all hover:scale-105 active:scale-95">
                            <X size={16} strokeWidth={3} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {offer.statusText && (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                              <Clock size={14} className="animate-pulse" /> {offer.statusText}
                            </div>
                          )}
                          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#E78F23]/40 text-xs font-black uppercase tracking-widest text-white bg-white/3 hover:bg-[#E78F23] hover:border-[#E78F23] hover:text-black transition-all duration-300 active:scale-95 group/btn shadow-[0_0_20px_rgba(231,143,35,0)] hover:shadow-[0_0_20px_rgba(231,143,35,0.2)]">
                            <Eye size={16} className="text-[#E78F23] group-hover/btn:text-black transition-colors" /> View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout (Card Like) */}
                  <div className="lg:hidden flex flex-col gap-6">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl text-white group-hover/row:text-[#E78F23] transition-colors">
                            {offer.item}
                          </h3>
                          <p className="text-sm text-gray-500   italic">
                            {offer.details}
                          </p>
                        </div>
                        <div className="text-2xl font-black text-[#E78F23] tracking-tighter">
                          {offer.amount}
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#E78F23] font-bold">
                              {offer.buyer.charAt(0)}
                           </div>
                           <div className="space-y-0.5">
                              <div className="text-sm font-bold text-white">{offer.buyer}</div>
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{offer.timeAgo}</div>
                           </div>
                        </div>
                        <StatusBadge status={offer.status} />
                     </div>

                     <div className="pt-2">
                        {offer.actions.includes("Accept") ? (
                          <div className="grid grid-cols-3 gap-3">
                             <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 transition-active active:scale-95">
                                <Check size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Accept</span>
                             </button>
                             <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/20 text-[#E78F23] transition-active active:scale-95">
                                <RefreshCcw size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Counter</span>
                             </button>
                             <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 transition-active active:scale-95">
                                <X size={20} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Reject</span>
                             </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {offer.statusText && (
                              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest pb-1">
                                <Clock size={14} className="animate-pulse" /> {offer.statusText}
                              </div>
                            )}
                            <button className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-[#E78F23]/40 text-xs font-black uppercase tracking-widest text-[#E78F23] bg-white/3 transition-all active:scale-[0.98]">
                              <Eye size={18} /> View Details
                            </button>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer gradient glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#E78F23]/40 to-transparent blur-sm" />
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default OfferReceieved;

"use client";

import React, { useState, useEffect, useRef } from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  RefreshCcw,
  Trash2,
  Plus,
  Flag,
  DollarSign
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data
const initialOffers = [
  {
    id: 1,
    title: "Malibu Oceanfront Estate",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200&h=150",
    yourOffer: "$42,000,000",
    status: "Pending",
    category: "Real Estate",
  },
  {
    id: 2,
    title: "Bentley Continental GT",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=200&h=150",
    yourOffer: "$235,000",
    status: "Accepted",
    category: "Cars",
    negotiationRounds: 4,
  },
  {
    id: 3,
    title: "Mediterranean Villa",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=200&h=150",
    yourOffer: "$7,800,000",
    status: "Rejected",
    category: "Real Estate",
  },
  {
    id: 4,
    title: "Porsche 911 GT3 RS",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=150",
    yourOffer: "$265,000",
    sellerCounter: "$278,000",
    status: "Countered",
    category: "Cars",
    negotiationRounds: 2,
    actionRequired: true,
    history: [
      { type: "You", amount: "$265,000", timeAgo: "3 days ago" },
      { type: "Seller", amount: "$278,000", timeAgo: "1 day ago" },
    ],
  },
  {
    id: 5,
    title: "Azimut Grande 35M",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=200&h=150",
    yourOffer: "$11,200,000",
    sellerCounter: "$11,800,000",
    status: "Countered",
    category: "Yachts",
    negotiationRounds: 4,
    actionRequired: true,
  },
];

const categories = ["All", "Cars", "Yachts", "Aviation", "Real Estate", "Watches"];

/* ─── Counter Offer Modal ─── */
interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    id: number;
    title: string;
    imageUrl: string;
    yourOffer: string;
    sellerCounter?: string;
    negotiationRounds?: number;
  } | null;
}

const CounterOfferModal = ({ isOpen, onClose, offer }: CounterOfferModalProps) => {
  const [counterAmount, setCounterAmount] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCounterAmount("");
      setIsClosing(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250);
  };

  if (!isOpen || !offer) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 ${
        isClosing ? "counter-modal-backdrop-exit" : "counter-modal-backdrop-enter"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-95 bg-[#18181B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden ${
          isClosing ? "counter-modal-exit" : "counter-modal-enter"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[15px] font-bold text-white tracking-tight">Send Counter Offer</h2>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-white/5" />

        {/* Item Preview */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
            </div>
            <div className="text-sm font-semibold text-white/90 leading-tight">{offer.title}</div>
          </div>

          {/* Price Comparison */}
          <div className="flex gap-8 mt-5">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your last offer</div>
              <div className="text-lg font-black text-white leading-none tracking-tight">{offer.yourOffer}</div>
            </div>
            {offer.sellerCounter && (
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Seller's counter</div>
                <div className="text-lg font-black text-[#D4AF37] leading-none tracking-tight">{offer.sellerCounter}</div>
              </div>
            )}
          </div>
        </div>

        {/* Counter Input */}
        <div className="px-6 pb-3">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
            Your counter offer
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <DollarSign size={16} />
            </div>
            <input
              type="text"
              placeholder="Enter amount"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
              autoFocus
            />
          </div>
        </div>

        {/* Negotiation Round */}
        {offer.negotiationRounds && (
          <div className="px-6 pb-4">
            <div className="text-[10px] font-medium text-gray-500 tracking-wider">
              Negotiation round {(offer.negotiationRounds || 0) + 1}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mx-6 border-t border-white/5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-5">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: submit counter offer
              handleClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c4a132] text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.97]"
          >
            <RefreshCcw size={14} />
            Send Counter Offer
          </button>
        </div>
      </div>

      {/* Keyframe styles (injected once) */}
      <style jsx>{`
        @keyframes counterModalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes counterModalOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes backdropOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .counter-modal-enter {
          animation: counterModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .counter-modal-exit {
          animation: counterModalOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .counter-modal-backdrop-enter {
          animation: backdropIn 0.3s ease forwards;
        }
        .counter-modal-backdrop-exit {
          animation: backdropOut 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Pending":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20 uppercase tracking-wider">
          Pending
        </span>
      );
    case "Accepted":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30 uppercase tracking-wider">
          Accepted
        </span>
      );
    case "Rejected":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-500/80 border border-red-500/30 uppercase tracking-wider">
          Rejected
        </span>
      );
    case "Countered":
      return (
        <span className="px-3 py-1 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500/80 border border-orange-500/20 uppercase tracking-wider">
          Countered
        </span>
      );
    default:
      return null;
  }
};

function BuyerOffer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedOffer, setExpandedOffer] = useState<number | null>(4); // Default expand id 4 as in image
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterOffer, setCounterOffer] = useState<typeof initialOffers[0] | null>(null);

  const filteredOffers = activeCategory === "All"
    ? initialOffers
    : initialOffers.filter(offer => offer.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white p-6   font-inter">
      <AnimationWrapper type="fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-4xl md:text-[40px] font-medium font-clash tracking-wide">
            My Offers
          </h1>

        
        </div>

        {/* Offers List */}
        <div className="relative group">
          {/* Main Container border/glow */}
          <div className="absolute -inset-px bg-linear-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none opacity-50" />

          <div className="relative bg-[#0A0A0B] rounded-[2rem] border border-white/5 overflow-hidden p-4 md:p-8 space-y-6">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="space-y-4">
                {/* Action Required Label */}
                {offer.actionRequired && (
                  <div className="flex items-center gap-2 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest px-1">
                    <Flag size={14} fill="currentColor" />
                    Seller Counter Offer — Action Required
                  </div>
                )}

                {/* Offer Card */}
                <div className={`relative bg-white/5 rounded-2xl border ${offer.actionRequired ? 'border-[#D4AF37]/20 bg-[#D4AF37]/2' : 'border-white/5'} p-5 md:p-6 hover:bg-white/8 transition-all duration-300`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white/90">
                          {offer.title}
                        </h3>
                        {offer.negotiationRounds && (
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {offer.negotiationRounds} negotiation rounds
                          </div>
                        )}
                        {/* Negotiation Link for non-expanded/others */}
                        {offer.negotiationRounds && (
                          <button
                            onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-colors mt-2"
                          >
                            {expandedOffer === offer.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {expandedOffer === offer.id ? "Hide" : "Show"} negotiation history
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                        {/* Offer Details */}
                        <div className="flex gap-8">
                          <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Offer</div>
                            <div className="text-2xl font-black text-white leading-none tracking-tight">{offer.yourOffer}</div>
                          </div>
                          {offer.sellerCounter && (
                            <div className="text-center">
                              <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Seller's Counter</div>
                              <div className="text-2xl font-black text-[#D4AF37] leading-none tracking-tight">{offer.sellerCounter}</div>
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <StatusBadge status={offer.status} />

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {offer.status === "Pending" && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-[10px] font-bold uppercase tracking-widest text-red-500/80 hover:bg-red-500/10 transition-all">
                              <Trash2 size={14} /> Withdraw
                            </button>
                          )}
                          {offer.status === "Rejected" && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                              <Plus size={14} /> New Offer
                            </button>
                          )}
                          {offer.status === "Countered" && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase tracking-widest text-green-500 hover:bg-green-500/20 transition-all">
                                <Check size={14} /> Accept
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-500/80 hover:bg-red-500/20 transition-all">
                                <X size={14} /> Reject
                              </button>
                              <button
                                onClick={() => {
                                  setCounterOffer(offer);
                                  setCounterModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                              >
                                <RefreshCcw size={14} /> Counter
                              </button>
                            </>
                          )}
                          <Link href={`/buyer/my-offer/${offer.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all">
                            <Eye size={14} /> View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Negotiation History Dropdown */}
                  {expandedOffer === offer.id && offer.history && (
                    <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                      {offer.history.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group/hist">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${item.type === 'You' ? 'bg-blue-500' : 'bg-[#D4AF37]'}`} />
                            <div className="text-sm">
                              <span className={`font-bold ${item.type === 'You' ? 'text-blue-400' : 'text-[#D4AF37]'}`}>{item.type}</span>
                              <span className="text-white ml-2">{item.amount}</span>
                            </div>
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover/hist:opacity-100 transition-opacity">
                            {item.timeAgo}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter Offer Modal */}
        <CounterOfferModal
          isOpen={counterModalOpen}
          onClose={() => setCounterModalOpen(false)}
          offer={counterOffer}
        />
      </AnimationWrapper>
    </div>
  );
}

export default BuyerOffer;

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, RefreshCcw } from "lucide-react";
import { OfferItem, OfferDetailItem } from "@/lib/api/offers";
import { useCounterOfferMutation } from "@/hooks/useOffers";
import { toast } from "sonner";

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferItem | OfferDetailItem | null;
  onSuccess?: () => void;
}

const formatCurrency = (amount?: string | number, currency = "USD") => {
  if (amount === undefined || amount === null || amount === "") return "N/A";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency} ${amount}`;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `$${num.toLocaleString()}`;
  }
};

export default function CounterOfferModal({
  isOpen,
  onClose,
  offer,
  onSuccess,
}: CounterOfferModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const counterMutation = useCounterOfferMutation();

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setNote("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !counterMutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, counterMutation.isPending, onClose]);

  if (!isOpen || !offer) return null;

  const currency = offer.listing?.currency || "USD";
  const listingTitle =
    offer.listing?.title || `Listing #${offer.listingId.slice(0, 8)}`;
  const currentOfferFormatted = formatCurrency(offer.currentAmount, currency);
  const askingPriceFormatted = offer.listing?.askingPrice
    ? formatCurrency(offer.listing.askingPrice, currency)
    : "N/A";

  const mainImage =
    offer.listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=300&h=200";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid counter offer amount.");
      return;
    }

    try {
      await counterMutation.mutateAsync({
        offerId: offer.id,
        payload: {
          amount: numericAmount,
          note: note.trim() || undefined,
        },
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!counterMutation.isPending) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#111113] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-xl text-primary">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-montserrat text-white">
                Send Counter Offer
              </h3>
              <p className="text-xs text-gray-400">
                Propose a new price and note to the buyer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={counterMutation.isPending}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item & Price Summary Card */}
        <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-12 rounded-lg overflow-hidden border border-white/10 bg-[#18181b] shrink-0">
              <Image
                src={mainImage}
                alt={listingTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-white truncate">
                {listingTitle}
              </h4>
              <p className="text-xs text-gray-400">
                Negotiation Round {(offer.roundsCount || 0) + 1}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
            <div className="bg-[#18181b] p-3 rounded-lg border border-white/5">
              <span className="text-gray-400 block mb-1">
                Buyer&apos;s Latest Offer
              </span>
              <span className="text-base font-extrabold text-white">
                {currentOfferFormatted}
              </span>
            </div>
            <div className="bg-[#18181b] p-3 rounded-lg border border-white/5">
              <span className="text-gray-400 block mb-1">
                Your Asking Price
              </span>
              <span className="text-base font-extrabold text-primary">
                {askingPriceFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Counter Amount <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                $
              </div>
              <input
                type="number"
                step="any"
                required
                placeholder="Enter counter offer amount (e.g. 615000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={counterMutation.isPending}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Note / Message{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Can meet in the middle at $615,000 for immediate wire transfer."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={counterMutation.isPending}
              className="w-full bg-[#18181b] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={counterMutation.isPending}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:border-white/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={counterMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(231,143,35,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {counterMutation.isPending ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  <span>Send Counter Offer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

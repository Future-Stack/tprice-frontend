import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, DollarSign, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useCounterOfferMutation } from "@/hooks/useOffers";
import { OfferItem } from "@/lib/api/offers";
import { CounterOfferModalProps, formatPrice } from "./types";

interface CounterOfferFormProps {
  offer: OfferItem;
  onClose: () => void;
}

function CounterOfferForm({ offer, onClose }: CounterOfferFormProps) {
  const [counterAmount, setCounterAmount] = useState("");
  const [note, setNote] = useState("");
  const counterOfferMutation = useCounterOfferMutation();

  const handleSendCounter = async () => {
    const amountNum = parseFloat(counterAmount.replace(/,/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid counter offer amount");
      return;
    }

    try {
      await counterOfferMutation.mutateAsync({
        offerId: offer.id,
        payload: {
          amount: amountNum,
          note: note.trim() || undefined,
        },
      });
      toast.success("Counter offer sent successfully!");
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const imageUrl =
    offer.listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=150";

  return (
    <div className="relative w-full max-w-95 bg-[#18181B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-[15px] font-bold text-white tracking-tight">Send Counter Offer</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
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
            <Image
              src={imageUrl}
              alt={offer.listing?.title || "Listing"}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm font-semibold text-white/90 leading-tight">
            {offer.listing?.title || "Untitled Listing"}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="flex gap-8 mt-5">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Your last offer
            </div>
            <div className="text-lg font-black text-white leading-none tracking-tight">
              {formatPrice(offer.currentAmount || offer.initialAmount, offer.listing?.currency)}
            </div>
          </div>
          {offer.listing?.askingPrice && (
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Asking price
              </div>
              <div className="text-lg font-black text-[#D4AF37] leading-none tracking-tight">
                {formatPrice(offer.listing.askingPrice, offer.listing.currency)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counter Input & Note */}
      <div className="px-6 pb-3 space-y-3">
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
            Your counter offer
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <DollarSign size={16} />
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
              autoFocus
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
            Note / Message (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Can meet in the middle for immediate wire transfer."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Negotiation Round */}
      {offer.roundsCount !== undefined && (
        <div className="px-6 pb-4">
          <div className="text-[10px] font-medium text-gray-500 tracking-wider">
            Negotiation round {(offer.roundsCount || 0) + 1}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-6 border-t border-white/5" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 px-6 py-5">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSendCounter}
          disabled={counterOfferMutation.isPending}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.97] cursor-pointer"
        >
          <RefreshCcw size={14} className={counterOfferMutation.isPending ? "animate-spin" : ""} />
          {counterOfferMutation.isPending ? "Sending..." : "Send Counter Offer"}
        </button>
      </div>
    </div>
  );
}

export function BuyerCounterOfferModal({ isOpen, onClose, offer }: CounterOfferModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !offer) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <CounterOfferForm key={offer.id} offer={offer} onClose={onClose} />
    </div>
  );
}

export default BuyerCounterOfferModal;

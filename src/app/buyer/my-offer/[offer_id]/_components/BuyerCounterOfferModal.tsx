"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCounterOfferMutation } from "@/hooks/useOffers";
import type { BuyerCounterOfferModalProps, OfferDetailItem } from "./types";

interface InnerCounterFormProps {
  offer: OfferDetailItem;
  onClose: () => void;
}

function InnerCounterForm({ offer, onClose }: InnerCounterFormProps) {
  const [counterAmount, setCounterAmount] = useState("");
  const [note, setNote] = useState("");
  const counterOfferMutation = useCounterOfferMutation();

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(counterAmount);
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
      toast.success("Counter offer submitted successfully!");
      onClose();
    } catch {
      // Handled in mutation onError toast
    }
  };

  return (
    <div className="w-full max-w-md bg-[#111113] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-clash text-white">Send Counter Offer</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSendCounter} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Counter Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              $
            </span>
            <input
              type="number"
              min="1"
              step="any"
              required
              disabled={counterOfferMutation.isPending}
              placeholder="Enter amount..."
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-sm text-white focus:outline-hidden focus:border-[#D4AF37] disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Note (Optional)
          </label>
          <textarea
            rows={3}
            disabled={counterOfferMutation.isPending}
            placeholder="Add a note for the seller..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-hidden focus:border-[#D4AF37] resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={counterOfferMutation.isPending}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={counterOfferMutation.isPending}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {counterOfferMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              "Submit Counter"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BuyerCounterOfferModal({
  isOpen,
  onClose,
  offer,
}: BuyerCounterOfferModalProps) {
  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <InnerCounterForm
        key={`${offer.id}-${offer.currentAmount || "initial"}`}
        offer={offer}
        onClose={onClose}
      />
    </div>
  );
}

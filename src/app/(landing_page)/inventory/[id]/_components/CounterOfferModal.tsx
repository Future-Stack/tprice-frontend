import React, { useState } from "react";
import Image from "next/image";
import { RefreshCw, DollarSign, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCounterOfferMutation, useCreateOfferMutation } from "@/hooks/useOffers";
import { getMediaList } from "./types";
import type { CounterOfferModalProps } from "./types";

export function CounterOfferModal({
  isOpen,
  onClose,
  item,
  existingOffer,
  numericPrice,
  formattedPrice,
  currencySymbol,
  onSuccess,
}: CounterOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <CounterOfferForm
        key={`${item.id}-${existingOffer?.id ?? "counter"}`}
        onClose={onClose}
        item={item}
        existingOffer={existingOffer}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        currencySymbol={currencySymbol}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function CounterOfferForm({
  onClose,
  item,
  existingOffer,
  numericPrice,
  formattedPrice,
  currencySymbol,
  onSuccess,
}: Omit<CounterOfferModalProps, "isOpen">) {
  const counterOfferMutation = useCounterOfferMutation();
  const createOfferMutation = useCreateOfferMutation();

  const isPending = counterOfferMutation.isPending || createOfferMutation.isPending;

  const initialPrice = existingOffer
    ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
    : numericPrice > 0
      ? Math.round(numericPrice * 0.95)
      : 0;

  const [counterAmount, setCounterAmount] = useState<string>(
    initialPrice > 0 ? String(initialPrice) : ""
  );
  const [counterNote, setCounterNote] = useState<string>(
    "Counter offer proposed for expedited purchase agreement."
  );

  const mediaList = getMediaList(item.media);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.id) return;
    const numericAmount = parseFloat(counterAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid counter offer amount.");
      return;
    }

    if (existingOffer) {
      counterOfferMutation.mutate(
        {
          offerId: existingOffer.id,
          payload: {
            amount: numericAmount,
            note: counterNote.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            onSuccess();
            onClose();
          },
        }
      );
    } else {
      createOfferMutation.mutate(
        {
          listingId: item.id,
          amount: numericAmount,
          note: counterNote.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Counter offer submitted successfully!");
            onSuccess();
            onClose();
          },
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-[#101216] border border-white/10 rounded-sm shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
            Submit Counter Offer
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Propose revised pricing terms for immediate consideration.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isPending}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Asset Summary */}
      <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/5 p-3.5 rounded-sm">
        {mediaList[0]?.url && (
          <div className="relative w-16 h-12 rounded-sm overflow-hidden border border-white/10 shrink-0">
            <Image
              src={mediaList[0].url}
              alt={item.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-serif font-semibold text-white truncate">
            {item.buildYear ? `${item.buildYear} ` : ""}
            {item.title}
          </h4>
          <p className="text-xs text-white/50 mt-0.5">
            {existingOffer
              ? `Current Offer: ${currencySymbol}${Number(
                  existingOffer.currentAmount || existingOffer.initialAmount
                ).toLocaleString()}`
              : `Asking Price: ${formattedPrice}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Counter Offer Amount ({item.currency || "USD"}){" "}
            <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <input
              type="number"
              min="1"
              step="any"
              required
              disabled={isPending}
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder="e.g. 480000"
              className="w-full pl-9 pr-4 py-3 bg-[#0A0A0A] border border-white/10 focus:border-[#D4AF37] rounded-sm text-white font-medium text-base outline-none transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Counter Terms / Notes{" "}
            <span className="text-white/40 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            disabled={isPending}
            value={counterNote}
            onChange={(e) => setCounterNote(e.target.value)}
            placeholder="Specify custom settlement timeline or delivery terms..."
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 focus:border-[#D4AF37] rounded-sm text-white text-sm outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Counter Offer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

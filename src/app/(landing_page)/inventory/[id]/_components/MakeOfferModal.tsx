import React, { useState } from "react";
import Image from "next/image";
import { Send, DollarSign, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateOfferMutation } from "@/hooks/useOffers";
import { getMediaList } from "./types";
import type { MakeOfferModalProps } from "./types";

export function MakeOfferModal({
  isOpen,
  onClose,
  item,
  numericPrice,
  formattedPrice,
  onSuccess,
}: MakeOfferModalProps) {
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
      <MakeOfferForm
        key={item.id}
        onClose={onClose}
        item={item}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function MakeOfferForm({
  onClose,
  item,
  numericPrice,
  formattedPrice,
  onSuccess,
}: Omit<MakeOfferModalProps, "isOpen">) {
  const createOfferMutation = useCreateOfferMutation();

  const [offerAmount, setOfferAmount] = useState<string>(
    numericPrice > 0 ? String(numericPrice) : ""
  );
  const [offerNote, setOfferNote] = useState<string>(
    "Ready to proceed with immediate concierge escrow acquisition."
  );

  const mediaList = getMediaList(item.media);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.id) return;
    const numericAmount = parseFloat(offerAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: item.id,
        amount: numericAmount,
        note: offerNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Offer submitted successfully!");
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <div className="relative w-full max-w-lg bg-[#101216] border border-white/10 rounded-sm shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#D4AF37]" />
            Make an Offer
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Submit your purchase proposal directly to the verified seller.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={createOfferMutation.isPending}
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
            Asking Price:{" "}
            <span className="text-[#D4AF37] font-semibold">{formattedPrice}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Your Offer Amount ({item.currency || "USD"}){" "}
              <span className="text-red-400">*</span>
            </label>
            {/* Quick percentage shortcuts */}
            {numericPrice > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setOfferAmount(String(numericPrice))}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                >
                  Asking
                </button>
                <button
                  type="button"
                  onClick={() => setOfferAmount(String(Math.round(numericPrice * 0.95)))}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                >
                  -5%
                </button>
                <button
                  type="button"
                  onClick={() => setOfferAmount(String(Math.round(numericPrice * 0.9)))}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                >
                  -10%
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <input
              type="number"
              min="1"
              step="any"
              required
              disabled={createOfferMutation.isPending}
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full pl-9 pr-4 py-3 bg-[#0A0A0A] border border-white/10 focus:border-[#D4AF37] rounded-sm text-white font-medium text-base outline-none transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Offer Terms / Notes{" "}
            <span className="text-white/40 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            disabled={createOfferMutation.isPending}
            value={offerNote}
            onChange={(e) => setOfferNote(e.target.value)}
            placeholder="Add details regarding timeline, logistics, or verification..."
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 focus:border-[#D4AF37] rounded-sm text-white text-sm outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createOfferMutation.isPending}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createOfferMutation.isPending}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {createOfferMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Offer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

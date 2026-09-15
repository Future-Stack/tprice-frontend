import React, { useState } from "react";
import Image from "next/image";
import { Gavel, DollarSign, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateOfferMutation } from "@/hooks/useOffers";
import { getMediaList } from "./types";
import type { PlaceBidModalProps } from "./types";

export function PlaceBidModal({
  isOpen,
  onClose,
  item,
  existingOffer,
  highestBidVal,
  startingBidVal,
  formattedPrice,
  currencySymbol,
  onSuccess,
}: PlaceBidModalProps) {
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
      <PlaceBidForm
        key={`${item.id}-${existingOffer?.id ?? "new-bid"}`}
        onClose={onClose}
        item={item}
        existingOffer={existingOffer}
        highestBidVal={highestBidVal}
        startingBidVal={startingBidVal}
        formattedPrice={formattedPrice}
        currencySymbol={currencySymbol}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function PlaceBidForm({
  onClose,
  item,
  existingOffer,
  highestBidVal,
  startingBidVal,
  formattedPrice,
  currencySymbol,
  onSuccess,
}: Omit<PlaceBidModalProps, "isOpen">) {
  const createOfferMutation = useCreateOfferMutation();

  const numericPrice = item.askingPrice ? Number(item.askingPrice) : 0;
  const currentVal = existingOffer
    ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
    : highestBidVal !== null
      ? highestBidVal
      : startingBidVal !== null
        ? startingBidVal
        : numericPrice > 0
          ? numericPrice
          : 0;

  const suggested = currentVal > 0 ? Math.round(currentVal * 1.05) : 1000;

  const [bidAmount, setBidAmount] = useState<string>(String(suggested));
  const [bidNote, setBidNote] = useState<string>(
    "Escrow verified bidder ready to complete acquisition."
  );

  const mediaList = getMediaList(item.media);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.id) return;
    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const currentMin = highestBidVal ?? startingBidVal ?? 0;
    if (currentMin > 0 && numericAmount < currentMin) {
      toast.error(`Your bid must be at least ${currencySymbol}${currentMin.toLocaleString()}`);
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: item.id,
        amount: numericAmount,
        note: bidNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(existingOffer ? "Bid increased successfully!" : "Bid placed successfully!");
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
            <Gavel className="w-5 h-5 text-[#D4AF37]" />
            {existingOffer ? "Increase Your Bid" : "Place a Bid"}
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Enter your maximum bid for this luxury auction asset.
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
            {highestBidVal
              ? `Current Highest Bid: ${currencySymbol}${highestBidVal.toLocaleString()}`
              : startingBidVal
                ? `Starting Bid: ${currencySymbol}${startingBidVal.toLocaleString()}`
                : `Price: ${formattedPrice}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Your Bid Amount ({item.currency || "USD"}){" "}
              <span className="text-red-400">*</span>
            </label>
            {/* Shortcut pills */}
            <div className="flex items-center gap-1.5">
              {highestBidVal && (
                <>
                  <button
                    type="button"
                    onClick={() => setBidAmount(String(Math.round(highestBidVal * 1.05)))}
                    className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                  >
                    +5%
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidAmount(String(Math.round(highestBidVal * 1.1)))}
                    className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                  >
                    +10%
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidAmount(String(Math.round(highestBidVal * 1.15)))}
                    className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-white/70 transition-colors"
                  >
                    +15%
                  </button>
                </>
              )}
            </div>
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
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="e.g. 250000"
              className="w-full pl-9 pr-4 py-3 bg-[#0A0A0A] border border-white/10 focus:border-[#D4AF37] rounded-sm text-white font-medium text-base outline-none transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Bidder Notes / Terms{" "}
            <span className="text-white/40 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={2}
            disabled={createOfferMutation.isPending}
            value={bidNote}
            onChange={(e) => setBidNote(e.target.value)}
            placeholder="Additional delivery or escrow instructions..."
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
                Submitting...
              </>
            ) : existingOffer ? (
              "Increase Bid"
            ) : (
              "Submit Bid"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

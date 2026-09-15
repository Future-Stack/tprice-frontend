import React, { useState } from "react";
import Image from "next/image";
import { DollarSign, X, Loader2, Gavel } from "lucide-react";
import { toast } from "sonner";
import { useCreateOfferMutation } from "@/hooks/useOffers";
import type { PlaceBidModalProps } from "./types";

export function PlaceBidModal({
  isOpen,
  onClose,
  product,
  productImages,
  existingOffer,
  formattedPrice,
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
        key={`${product.id}-${existingOffer?.id ?? "bid"}`}
        onClose={onClose}
        product={product}
        productImages={productImages}
        existingOffer={existingOffer}
        formattedPrice={formattedPrice}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function PlaceBidForm({
  onClose,
  product,
  productImages,
  existingOffer,
  formattedPrice,
  onSuccess,
}: Omit<PlaceBidModalProps, "isOpen">) {
  const createOfferMutation = useCreateOfferMutation();

  const currentVal = existingOffer
    ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
    : product?.startingBid
      ? Number(product.startingBid)
      : product?.askingPrice
        ? Number(product.askingPrice)
        : 0;

  const suggested = existingOffer
    ? Math.round(currentVal * 1.05)
    : currentVal > 0
      ? currentVal
      : 1000;

  const [bidAmount, setBidAmount] = useState<string>(String(suggested));
  const [bidNote, setBidNote] = useState<string>(
    "Escrow verified bidder ready to complete verification."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const prevBid = existingOffer
      ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
      : 0;

    if (existingOffer && numericAmount <= prevBid) {
      toast.error(
        `Your new bid must be higher than your current bid of $${prevBid.toLocaleString()}`
      );
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: product.id,
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

  const parsedBid = parseFloat(bidAmount);

  return (
    <div className="relative w-full max-w-lg bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-clash font-bold text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-primary" />
            {existingOffer ? "Increase Your Bid" : "Place a Bid"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {existingOffer
              ? "Submit a higher bid for this auction listing."
              : "Enter your bid amount to join the auction."}
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={createOfferMutation.isPending}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Item & Current Bid Summary Card */}
      <div className="flex items-center gap-4 bg-[#1C1C1E] border border-white/5 p-3.5 rounded-xl">
        <Image
          src={productImages[0]}
          alt={product.title}
          width={64}
          height={48}
          unoptimized
          className="w-16 h-12 rounded-lg object-cover border border-white/10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white truncate">{product.title}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="text-gray-400">
              {existingOffer ? "Your Current Bid:" : "Starting / Current Ask:"}
            </span>
            <span className="text-primary font-bold">
              {existingOffer
                ? `$${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()}`
                : formattedPrice}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Bid Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              {existingOffer ? "New Higher Bid Amount (USD)" : "Your Bid Amount (USD)"}{" "}
              <span className="text-red-400">*</span>
            </label>

            {/* Increment Pills */}
            {existingOffer && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const base = Number(
                      existingOffer.currentAmount || existingOffer.initialAmount
                    );
                    setBidAmount(String(Math.round(base * 1.05)));
                  }}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                >
                  +5%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const base = Number(
                      existingOffer.currentAmount || existingOffer.initialAmount
                    );
                    setBidAmount(String(Math.round(base * 1.1)));
                  }}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                >
                  +10%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const base = Number(
                      existingOffer.currentAmount || existingOffer.initialAmount
                    );
                    setBidAmount(String(Math.round(base * 1.15)));
                  }}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                >
                  +15%
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <input
              type="number"
              min="1"
              step="any"
              required
              disabled={createOfferMutation.isPending}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="e.g. 950000"
              className="w-full pl-9 pr-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white font-medium text-base outline-none transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Note / Verification Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
            Bidder Note / Terms{" "}
            <span className="text-gray-500 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={3}
            disabled={createOfferMutation.isPending}
            value={bidNote}
            onChange={(e) => setBidNote(e.target.value)}
            placeholder="Escrow verified bidder ready to proceed..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white text-sm outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        {/* Dynamic Fee & Total Payable Summary */}
        {Boolean(parsedBid) && parsedBid > 0 && (
          <div className="bg-[#111111] border border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between text-gray-400">
              <span>Bid Amount</span>
              <span className="text-white font-medium">
                ${parsedBid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>VIP Fee (1.5%)</span>
              <span className="text-white font-medium">
                ${Math.round(parsedBid * 0.015).toLocaleString()}
              </span>
            </div>
            <div className="pt-1.5 border-t border-white/5 flex justify-between font-semibold">
              <span className="text-gray-300">Total Payable</span>
              <span className="text-primary font-bold">
                ${Math.round(parsedBid * 1.015).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createOfferMutation.isPending}
            className="px-5 py-3 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createOfferMutation.isPending}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_16px_rgba(231,143,35,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {createOfferMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Bid...
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                {existingOffer ? "Increase Bid" : "Place Bid"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { DollarSign, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateOfferMutation } from "@/hooks/useOffers";
import type { VIPOfferModalProps, ListingItem, OfferDetailItem } from "./types";
import { formatPrice } from "./types";

interface VIPOfferFormProps {
  product: ListingItem;
  existingOffer?: OfferDetailItem;
  rawPrice: number;
  onClose: () => void;
  onSuccess?: () => void;
}

function VIPOfferForm({ product, existingOffer, rawPrice, onClose, onSuccess }: VIPOfferFormProps) {
  const [offerAmount, setOfferAmount] = useState<string>(() => {
    if (existingOffer) {
      return String(existingOffer.currentAmount || existingOffer.initialAmount || "");
    }
    return rawPrice > 0 ? String(rawPrice) : "";
  });

  const [offerNote, setOfferNote] = useState<string>(() => existingOffer?.note || "");

  const createOfferMutation = useCreateOfferMutation();

  const formattedAskingPrice = formatPrice(product.askingPrice, product.currency || "USD");

  const parsedAmount = parseFloat(offerAmount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.id) return;
    if (!isValidAmount) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: product.id,
        amount: parsedAmount,
        note: offerNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            existingOffer
              ? "Your offer has been updated successfully!"
              : "Your VIP offer has been submitted! Our concierge team will review it shortly."
          );
          onClose();
          onSuccess?.();
        },
        onError: (err: unknown) => {
          const errObj = err as { response?: { data?: { message?: string } }; message?: string };
          toast.error(
            errObj.response?.data?.message ||
              errObj.message ||
              "Failed to submit offer. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-clash font-semibold text-white">
              {existingOffer ? "Update Your Offer" : "Make an Offer"}
            </h3>
            <p className="text-xs text-gray-400">{product.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Offer Amount (USD)
            </label>
            {rawPrice > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Asking: {formattedAskingPrice}</span>
                <button
                  type="button"
                  onClick={() => setOfferAmount(String(Math.round(rawPrice * 0.95)))}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors cursor-pointer"
                >
                  -5%
                </button>
                <button
                  type="button"
                  onClick={() => setOfferAmount(String(Math.round(rawPrice * 0.9)))}
                  className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors cursor-pointer"
                >
                  -10%
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
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="e.g. 900000"
              className="w-full pl-9 pr-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white font-medium text-base outline-none transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Note / Terms Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
            Note / Special Terms{" "}
            <span className="text-gray-500 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={3}
            disabled={createOfferMutation.isPending}
            value={offerNote}
            onChange={(e) => setOfferNote(e.target.value)}
            placeholder="Add any details about payment timeline, escrow verification, or delivery..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white text-sm outline-none transition-colors resize-none disabled:opacity-50"
          />
        </div>

        {/* Dynamic VIP Fee estimate summary */}
        {isValidAmount && (
          <div className="bg-[#111111] border border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between text-gray-400">
              <span>Offer Amount</span>
              <span className="text-white font-medium">${parsedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Estimated VIP Fee (1.5%)</span>
              <span className="text-white font-medium">
                ${Math.round(parsedAmount * 0.015).toLocaleString()}
              </span>
            </div>
            <div className="pt-1.5 border-t border-white/5 flex justify-between font-semibold">
              <span className="text-gray-300">Total Commitment</span>
              <span className="text-primary">
                ${Math.round(parsedAmount * 1.015).toLocaleString()}
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
            {createOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {createOfferMutation.isPending
              ? "Submitting..."
              : existingOffer
                ? "Update Offer"
                : "Submit Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function VIPOfferModal({
  isOpen,
  onClose,
  product,
  existingOffer,
  rawPrice,
  onSuccess,
}: VIPOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <VIPOfferForm
        key={`${product.id}-${existingOffer?.id ?? "new"}`}
        product={product}
        existingOffer={existingOffer}
        rawPrice={rawPrice}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
}

import React, { useState } from "react";
import Image from "next/image";
import { DollarSign, X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useCreateOfferMutation } from "@/hooks/useOffers";
import type { SendOfferModalProps } from "./types";

export function SendOfferModal({
  isOpen,
  onClose,
  product,
  productImages,
  numericPrice,
  formattedPrice,
  onSuccess,
}: SendOfferModalProps) {
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
      <SendOfferForm
        key={product.id}
        onClose={onClose}
        product={product}
        productImages={productImages}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function SendOfferForm({
  onClose,
  product,
  productImages,
  numericPrice,
  formattedPrice,
  onSuccess,
}: Omit<SendOfferModalProps, "isOpen">) {
  const createOfferMutation = useCreateOfferMutation();
  const [offerAmount, setOfferAmount] = useState<string>(
    numericPrice > 0 ? String(numericPrice) : ""
  );
  const [offerNote, setOfferNote] = useState<string>(
    "Flexible on delivery timeline and ready to complete escrow verification."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    const numericAmount = parseFloat(offerAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: product.id,
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

  const parsedAmount = parseFloat(offerAmount);

  return (
    <div className="relative w-full max-w-lg bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-clash font-bold text-white">Make an Offer</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Submit your offer directly to the seller for review.
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

      {/* Item Summary Card */}
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
          <p className="text-xs text-gray-400 mt-0.5">
            Asking Price: <span className="text-primary font-medium">{formattedPrice}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Offer Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Your Offer Amount (USD) <span className="text-red-400">*</span>
            </label>
            {/* Quick preset percentage pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => numericPrice > 0 && setOfferAmount(String(numericPrice))}
                className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
              >
                Asking
              </button>
              <button
                type="button"
                onClick={() =>
                  numericPrice > 0 && setOfferAmount(String(Math.round(numericPrice * 0.95)))
                }
                className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
              >
                -5%
              </button>
              <button
                type="button"
                onClick={() =>
                  numericPrice > 0 && setOfferAmount(String(Math.round(numericPrice * 0.9)))
                }
                className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
              >
                -10%
              </button>
            </div>
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
        {Boolean(parsedAmount) && parsedAmount > 0 && (
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
            {createOfferMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Offer...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Offer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flag, ChevronDown, ChevronUp, Check, X, RefreshCcw, Eye } from "lucide-react";
import { BuyerOfferCardProps, formatPrice, formatDate } from "./types";
import { BuyerOfferStatusBadge } from "./BuyerOfferStatusBadge";

export function BuyerOfferCard({
  offer,
  expandedOfferId,
  onToggleExpand,
  onAccept,
  onWithdraw,
  onOpenCounter,
  isAcceptPending,
  isWithdrawPending,
}: BuyerOfferCardProps) {
  const listing = offer.listing;
  const saleType = (listing?.saleType || "").toUpperCase();
  const allowCounterOffers = listing?.allowCounterOffers ?? false;
  const isFixedWithCounter = saleType === "FIXED_PRICE" && allowCounterOffers;
  const statusUpper = (offer.status || "").toUpperCase();
  const isTerminalStatus =
    statusUpper === "ACCEPTED" ||
    statusUpper === "REJECTED" ||
    statusUpper === "DECLINED" ||
    statusUpper === "WITHDRAWN" ||
    statusUpper === "CANCELLED" ||
    statusUpper === "EXPIRED";

  const showCounterButton =
    (statusUpper === "COUNTERED" || isFixedWithCounter) && !isTerminalStatus;

  const imageUrl =
    listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=150";

  return (
    <div className="space-y-4">
      {/* Action Required Header */}
      {showCounterButton && (
        <div className="flex items-center gap-2 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest px-1">
          <Flag size={14} fill="currentColor" />
          Counter Offer Available — Action Required
        </div>
      )}

      {/* Offer Card */}
      <div
        className={`relative bg-white/5 rounded-2xl border ${
          showCounterButton ? "border-[#D4AF37]/20 bg-[#D4AF37]/2" : "border-white/5"
        } p-5 md:p-6 hover:bg-white/8 transition-all duration-300`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Thumbnail */}
          <div className="relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <Image
              src={imageUrl}
              alt={listing?.title || "Listing image"}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="grow flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white/90">
                {listing?.title || "Untitled Listing"}
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {offer.roundsCount ? (
                  <span>
                    {offer.roundsCount} negotiation round
                    {offer.roundsCount > 1 ? "s" : ""}
                  </span>
                ) : null}
                {offer.createdAt && <span>Date: {formatDate(offer.createdAt)}</span>}
              </div>

              {offer.histories && offer.histories.length > 0 && (
                <button
                  onClick={() => onToggleExpand(offer.id)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-colors mt-2 cursor-pointer"
                >
                  {expandedOfferId === offer.id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  {expandedOfferId === offer.id ? "Hide" : "Show"} negotiation history
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
              {/* Offer Details */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Your Offer
                  </div>
                  <div className="text-2xl font-black text-white leading-none tracking-tight">
                    {formatPrice(offer.currentAmount || offer.initialAmount, listing?.currency)}
                  </div>
                </div>
                {listing?.askingPrice && (
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Asking Price
                    </div>
                    <div className="text-2xl font-black text-gray-300 leading-none tracking-tight">
                      {formatPrice(listing.askingPrice, listing.currency)}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <BuyerOfferStatusBadge status={offer.status} />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {statusUpper === "COUNTERED" && (
                  <button
                    onClick={() => onAccept(offer.id)}
                    disabled={isAcceptPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase tracking-widest text-green-500 hover:bg-green-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Check size={14} /> Accept
                  </button>
                )}

                {(statusUpper === "PENDING" || statusUpper === "COUNTERED") && (
                  <button
                    onClick={() => onWithdraw(offer.id)}
                    disabled={isWithdrawPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <X size={14} className={isWithdrawPending ? "animate-spin" : ""} />
                    Withdraw
                  </button>
                )}

                {showCounterButton && (
                  <button
                    onClick={() => onOpenCounter(offer)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
                  >
                    <RefreshCcw size={14} /> Counter
                  </button>
                )}

                <Link
                  href={`/buyer/my-offer/${offer.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                >
                  <Eye size={14} /> View
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation History Dropdown */}
        {expandedOfferId === offer.id && offer.histories && offer.histories.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
            {offer.histories.map((item) => (
              <div key={item.id} className="flex items-center justify-between group/hist">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.senderId === offer.buyerId ? "bg-blue-500" : "bg-[#D4AF37]"
                    }`}
                  />
                  <div className="text-sm">
                    <span
                      className={`font-bold ${
                        item.senderId === offer.buyerId ? "text-blue-400" : "text-[#D4AF37]"
                      }`}
                    >
                      {item.senderId === offer.buyerId
                        ? "You"
                        : `${item.sender?.firstName || "Seller"} ${item.sender?.lastName || ""}`}
                    </span>
                    <span className="text-white ml-2">
                      {formatPrice(item.amount, listing?.currency)}
                    </span>
                    {item.note && (
                      <span className="text-gray-400 text-xs italic ml-2">
                        &ldquo;{item.note}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {formatDate(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerOfferCard;

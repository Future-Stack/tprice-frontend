import React from "react";
import { MessageSquare, Clock, Handshake } from "lucide-react";
import { ActionBadge, formatCurrency, formatDate, formatTimeAgo } from "./types";
import type { OfferTimelineSectionProps } from "./types";

export function OfferTimelineSection({
  offer,
  currency,
  formattedAskingPrice,
  buyerName,
  sellerName,
}: OfferTimelineSectionProps) {
  return (
    <div className="space-y-8">
      {/* Listing Overview Card */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">
          {offer.listing?.title || `Listing #${offer.listingId}`}
        </h3>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-sm">
          <div>
            <span className="text-gray-500 text-xs block mb-1">Asking Price</span>
            <span className="font-bold text-white">{formattedAskingPrice}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block mb-1">Currency</span>
            <span className="font-bold text-white">{currency}</span>
          </div>
        </div>
      </div>

      {/* Negotiation History & Timeline */}
      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-primary">
            <MessageSquare size={16} />
            <span>Negotiation History</span>
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {offer.histories?.length || 0} Events
          </span>
        </div>

        {!offer.histories || offer.histories.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-4">No negotiation history recorded yet.</p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {offer.histories.map((item, index) => {
              const senderName =
                [item.sender?.firstName, item.sender?.lastName].filter(Boolean).join(" ").trim() ||
                (item.senderId === offer.buyerId
                  ? buyerName
                  : item.senderId === offer.sellerId
                    ? sellerName
                    : "User");

              const isBuyerSender = item.senderId === offer.buyerId;

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-7.75 top-1.5 w-5 h-5 rounded-full border-2 bg-[#111113] flex items-center justify-center transition-colors ${
                      index === 0
                        ? "border-primary shadow-[0_0_10px_rgba(231,143,35,0.5)]"
                        : "border-white/20"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === 0 ? "bg-primary" : "bg-white/40"
                      }`}
                    />
                  </div>

                  {/* Event Content Box */}
                  <div className="bg-white/2 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{senderName}</span>
                        <span className="text-[10px] font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                          {isBuyerSender ? "Buyer" : "Seller"}
                        </span>
                      </div>
                      <ActionBadge action={item.action} />
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400">Proposed Amount:</span>
                      <span className="text-xl font-black text-primary tracking-tight">
                        {formatCurrency(item.amount, currency)}
                      </span>
                    </div>

                    {item.note && (
                      <div className="bg-[#18181b] border border-white/5 rounded-lg p-3 text-xs text-gray-300 italic flex items-start gap-2.5">
                        <MessageSquare size={14} className="text-primary shrink-0 mt-0.5" />
                        <span>&quot;{item.note}&quot;</span>
                      </div>
                    )}

                    <div className="text-[11px] text-gray-500 pt-1 flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>
                        {formatDate(item.createdAt)} ({formatTimeAgo(item.createdAt)})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deal Information (If Deal Exists) */}
      {offer.deal && (
        <div className="bg-[#111113] rounded-2xl border border-emerald-500/20 p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 pb-4 border-b border-white/5">
            <Handshake size={18} />
            <span>Initiated Deal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-gray-500 text-xs block mb-1">Agreed Price</span>
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrency(offer.deal.agreedPrice, currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block mb-1">Stage</span>
              <span className="inline-block px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
                {offer.deal.stage}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block mb-1">Deal ID</span>
              <span className="font-mono text-xs text-gray-300">{offer.deal.id}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block mb-1">Created Date</span>
              <span className="text-xs text-gray-300">{formatDate(offer.deal.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

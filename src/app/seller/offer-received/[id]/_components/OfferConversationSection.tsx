"use client";

import React from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "./types";
import type { OfferConversationSectionProps } from "./types";

export function OfferConversationSection({
  offer,
  combinedTimeline,
  currency,
  messageInput,
  isSending,
  chatScrollRef,
  onMessageInputChange,
  onSendMessage,
}: OfferConversationSectionProps) {
  return (
    <div className="bg-[#111113] rounded-2xl border border-[#E78F23]/20 p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#E78F23]">
          <MessageSquare size={16} />
          <span>Deal Conversation</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium flex items-center gap-1.5 normal-case tracking-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Chat
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
          {combinedTimeline.length} message
          {combinedTimeline.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Messages Box */}
      <div
        ref={chatScrollRef}
        className="space-y-4 max-h-105 overflow-y-auto pr-2 custom-scrollbar"
      >
        {combinedTimeline.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm flex flex-col items-center gap-2">
            <MessageSquare size={28} className="text-gray-600 stroke-[1.5]" />
            <span>
              No conversation messages recorded yet. Send a message below to communicate with the buyer.
            </span>
          </div>
        ) : (
          combinedTimeline.map((item) => {
            const isSelf =
              item.senderId === offer.sellerId || item.senderRole === "SELLER";
            return (
              <div
                key={item.id}
                className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    item.type === "history"
                      ? isSelf
                        ? "bg-[#E78F23]/10 border border-[#E78F23]/25 text-white rounded-br-none"
                        : "bg-white/5 border border-white/10 text-white/90 rounded-bl-none"
                      : isSelf
                        ? "bg-[#E78F23]/15 border border-[#E78F23]/35 text-white rounded-br-none shadow-[0_0_15px_rgba(231,143,35,0.05)]"
                        : "bg-white/5 border border-white/15 text-white/90 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#E78F23] flex items-center gap-1.5">
                      {isSelf ? "You (Seller)" : item.senderName}
                      {item.senderRole && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-gray-300 font-mono">
                          {item.senderRole}
                        </span>
                      )}
                    </div>
                    {item.amount && (
                      <span className="text-[10px] font-bold text-[#E78F23] bg-[#E78F23]/10 px-2 py-0.5 rounded">
                        {formatCurrency(item.amount, currency)}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{item.text}</p>
                  <div className="text-[10px] text-gray-500 mt-2 flex items-center justify-between gap-2">
                    <span>{formatDate(item.createdAt)}</span>
                    {item.type === "history" && (
                      <span className="italic text-[9px] text-[#E78F23]/70">
                        Offer Event
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-white/5">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Type your message to the buyer..."
            className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3.5 px-4 pr-12 text-xs md:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E78F23] transition-all"
          />
          <button
            onClick={onSendMessage}
            disabled={isSending || !messageInput.trim()}
            className="absolute right-2 p-2 rounded-lg bg-[#E78F23] hover:bg-[#E78F23]/90 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSending ? (
              <Loader2 size={16} className="animate-spin text-black" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

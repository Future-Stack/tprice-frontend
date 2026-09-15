"use client";

import React from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { formatPrice, formatDate } from "./types";
import type { BuyerOfferConversationProps } from "./types";

export function BuyerOfferConversation({
  offer,
  combinedTimeline,
  messageInput,
  isSending,
  chatScrollRef,
  onMessageInputChange,
  onSendMessage,
}: BuyerOfferConversationProps) {
  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold font-clash flex items-center gap-3">
            Conversation
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-sans font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Chat
            </span>
          </h2>
          <span className="text-xs text-gray-400">
            {combinedTimeline.length} message
            {combinedTimeline.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="bg-[#111113] rounded-[2rem] border border-white/5 p-6 md:p-8 space-y-6">
          <div
            ref={chatScrollRef}
            className="space-y-6 max-h-100 overflow-y-auto pr-2 custom-scrollbar"
          >
            {combinedTimeline.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center gap-2">
                <MessageSquare size={24} className="text-gray-600" />
                No conversation messages recorded yet. Start the conversation below.
              </div>
            ) : (
              combinedTimeline.map((item) => {
                const isSelf =
                  item.senderId === offer.buyerId || item.senderRole === "BUYER";
                return (
                  <div
                    key={item.id}
                    className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed ${
                        item.type === "history"
                          ? isSelf
                            ? "bg-[#2D2D20] border border-[#D4AF37]/30 text-white/90 rounded-br-none"
                            : "bg-white/5 border border-white/10 text-white/90 rounded-bl-none"
                          : isSelf
                            ? "bg-[#2D2D20] border border-[#D4AF37]/40 text-white rounded-br-none"
                            : "bg-white/5 border border-white/15 text-white/90 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                          {isSelf ? "You" : item.senderName}
                          {item.senderRole && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-gray-300">
                              {item.senderRole}
                            </span>
                          )}
                        </div>
                        {item.amount && (
                          <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                            {formatPrice(item.amount)}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{item.text}</p>
                      <div className="text-[10px] text-gray-500 mt-2.5 uppercase tracking-tight flex items-center justify-between">
                        <span>{formatDate(item.createdAt)}</span>
                        {item.type === "history" && item.action && (
                          <span className="text-[9px] text-gray-400 font-mono">
                            ({item.action})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <div className="relative group/input mt-8">
            <input
              type="text"
              placeholder="Type a message to seller..."
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSending) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-14 text-sm focus:outline-hidden focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
            />
            <button
              onClick={onSendMessage}
              disabled={isSending || !messageInput.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#c4a132] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

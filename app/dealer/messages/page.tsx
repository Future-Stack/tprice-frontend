"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  Check,
  RefreshCcw,
  X,
  Send,
  TrendingUp
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);

  const chatList = [
    {
      id: 1,
      name: "Marcus Chen",
      time: "2 min ago",
      car: "2024 Porsche 911 Turbo S",
      message: "Can we Finalize at $480,000?",
      isOffer: true,
      tag: "Offer",
      tagClass: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    },
    {
      id: 2,
      name: "Sophia Laurent",
      time: "1h ago",
      car: "2023 Ferrari SF90 Stradale",
      message: "You : Let me think about it",
      isOffer: false,
      tag: "Closed",
      tagClass: "bg-white/5 text-gray-400 border-white/10",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      time: "1h ago",
      car: "2023 Ferrari SF90 Stradale",
      message: "Can you provide the service history ?",
      isOffer: true,
      tag: "Negotiation",
      tagClass: "bg-green-500/10 text-green-500 border-green-500/20",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Marcus Chen",
      text: "I am very interested in this vehicle. Can we discuss the pricing ?",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Absolutely.This is a pristine example with only 2,400 miles.What price point were you considering?",
      isMe: true,
    },
    {
      id: 3,
      sender: "Marcus Chen",
      text: "I have submitted an offer of $ 470,000. I can move quickly on this",
      isMe: false,
    },
    {
      id: 4,
      sender: "Me",
      text: "Thank you for the updated offer. Let me review and get back to you shortly",
      isMe: true,
    },
    {
      id: 5,
      sender: "Marcus Chen",
      text: "Can you meet at $500,000 ?",
      isMe: true,
    },
    {
      id: 6,
      sender: "Marcus Chen",
      text: "Can we finalize at $480,000?",
      isMe: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Main Grid: Left Sidebar, Middle Chat, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-120px)] min-h-[800px]">
          {/* Left Sidebar - Menu List */}
          <div className="lg:col-span-3 flex flex-col h-[500px] lg:h-full border border-white/5 lg:border-y-0 lg:border-l-0 lg:border-r rounded-2xl lg:rounded-none p-4 lg:p-0 lg:pr-4 space-y-6 bg-[#0F0F11] lg:bg-transparent">
            <div className="flex items-center justify-between lg:block">
              <h1 className="text-2xl md:text-[32px] font-medium tracking-tight lg:mb-6">Messages</h1>
              <button className="px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] text-xs lg:text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                Message list
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    activeChat === chat.id
                      ? "bg-white/10"
                      : "bg-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white/90">{chat.name}</span>
                    <span className="text-[10px] text-gray-500">{chat.time}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mb-2 truncate">
                    {chat.car}
                  </div>
                  <div className="flex items-start gap-2 mb-3">
                    {chat.isOffer && (
                      <div className="mt-1 w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full" />
                      </div>
                    )}
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {chat.message}
                    </p>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-[10px] border ${chat.tagClass}`}
                  >
                    {chat.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Chat Area */}
          <div className="lg:col-span-6 flex flex-col h-[600px] lg:h-full relative border border-white/5 rounded-2xl bg-[#0F0F11]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5">
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-semibold mb-1 truncate max-w-[150px] md:max-w-[300px]">Marcus Chen</span>
                <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">2024 Porsche 911 Turbo S</span>
              </div>
              <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
                  <span className="text-xs text-[#D4AF37]">Active now</span>
                </div>
                <button className="relative text-gray-400 hover:text-white transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
                </button>
                <div className="flex items-center gap-2 cursor-pointer border border-white/10 rounded-full py-1.5 px-2 md:px-3 hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 shrink-0">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" />
                  </div>
                  <span className="text-xs font-medium hidden md:inline">Adam</span>
                  <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
              <AnimationWrapper type="fade-up">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isMe ? "justify-end" : "justify-start"} mb-6`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-4 rounded-xl text-xs md:text-sm leading-relaxed ${
                        msg.isMe
                          ? "bg-[#2D2D20] text-white/90 border border-[#D4AF37]/20 rounded-tr-sm"
                          : "bg-white/5 text-white/90 border border-white/10 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </AnimationWrapper>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 pt-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="w-full bg-[#1A1A1C] border border-white/10 rounded-xl py-3.5 md:py-4 px-4 md:px-5 pr-14 md:pr-16 text-xs md:text-sm text-white focus:outline-hidden focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-500"
                />
                <button className="absolute right-2 md:right-3 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#D4AF37] hover:bg-[#c4a132] text-black flex items-center justify-center transition-colors">
                  <Send size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Details */}
          <div className="lg:col-span-3 flex flex-col h-full space-y-6 pl-4">
            <AnimationWrapper type="fade-left">
              {/* Product Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1503376712394-6d99214eb1d3?auto=format&fit=crop&q=80&w=800"
                  alt="2024 Porsche 911 Turbo S"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Title */}
              <h2 className="text-xl font-medium tracking-tight mt-6 mb-8">
                2024 Porsche 911<br />Turbo S
              </h2>

              {/* Offer Info */}
              <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 mb-6">
                <div className="text-[11px] font-bold text-gray-500 mb-1">
                  Current Offer
                </div>
                <div className="text-[40px] font-black text-[#D4AF37] leading-none mb-6">
                  480,000
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                  <div className="text-[11px] font-bold text-gray-500">
                    Deal Stage
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      Negotiation
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                      <TrendingUp size={14} />
                      Buyer has increased offer twice
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button className="w-full py-4 bg-[#D4AF37] hover:bg-[#c4a132] text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <Check size={18} />
                  Accept offer
                </button>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <RefreshCcw size={16} />
                  Send Counter Offer
                </button>
                <button className="w-full py-4 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 text-[#FF4D4D] font-semibold text-sm rounded-xl border border-[#8B0000]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                  <X size={16} />
                  Reject Offer
                </button>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

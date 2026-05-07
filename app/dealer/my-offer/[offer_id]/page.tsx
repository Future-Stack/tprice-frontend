"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  MapPin,
  Handshake,
  Info,
  Send,
  RefreshCcw,
  X,
  Check,
  ChevronDown,
  Clock,
  Circle
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

const OfferDetails = () => {
  // Mock data for the specific offer
  const offer = {
    id: "LBO-2024-0047",
    title: "2024 Lamborghini Revuelto",
    location: "New York, USA",
    imageUrl: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200",
    seller: {
      name: "David Anderson",
      avatar: "https://i.pravatar.cc/150?u=david",
      status: "Verified Dealer",
    },
    summary: {
      currentOffer: "$480,000",
      askingPrice: "$490,000",
      lastUpdated: "10 min ago",
      listedPrice: "$495,000",
    },
    history: [
      { id: 1, type: "Initial Offer", entity: "Buyer Offer", amount: "$450,000", date: "Apr 7, 2:30 pm", color: "blue" },
      { id: 2, type: "Counter Offer", entity: "Dealer Offer", amount: "$495,000", date: "Apr 7, 4:30 pm", color: "yellow" },
      { id: 3, type: "Updated Offer", entity: "Buyer Offer", amount: "$470,000", date: "Apr 8, 1:30 pm", color: "blue" },
      { id: 4, type: "Counter Offer", entity: "Dealer Offer", amount: "$490,000", date: "Apr 8, 5:30 pm", color: "yellow" },
      { id: 5, type: "Updated Offer", entity: "Buyer Offer", amount: "$480,000", date: "Apr 8, 7:30 pm", color: "blue", active: true },
    ],
    messages: [
      { id: 1, sender: "Buyer", text: "I am very interested in this vehicle. Can we discuss the pricing?", time: "Apr 7, 2:15 pm" },
      { id: 2, sender: "Seller", text: "Absolutely, this is a pristine example with only 2,400 miles. What price point were you considering?", time: "Apr 7, 2:45 pm" },
      { id: 3, sender: "Buyer", text: "I have submitted an offer of $480,000. I can move quickly on this", time: "Apr 8, 7:30 pm" },
      { id: 4, sender: "Seller", text: "Thank you for the updated offer. Let me review and get back to you shortly", time: "Apr 8, 8:00 pm" },
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="w-full space-y-8">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-white/60 text-sm md:text-[32px] font-medium font-clash">
          <Link href="/buyer/my-offer" className="hover:text-white transition-colors">My Offers</Link>
          <ChevronRight size={16} />
          <span className="text-white">Negotiation Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left & Middle Container */}
          <div className="lg:col-span-8 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-11 gap-8">
              {/* Left Column (Seller & Summary) */}
              <div className="md:col-span-5 space-y-6">
                <AnimationWrapper type="fade-right">
                  <h1 className="text-3xl md:text-[32px] font-medium font-clash tracking-tight mb-6">
                    {offer.title}
                  </h1>

                  {/* Seller Card */}
                  <div className="bg-[#111113] rounded-2xl border border-white/5 p-4 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <Image src={offer.seller.avatar} alt={offer.seller.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white/90">{offer.seller.name}</div>
                        <div className="text-[10px] text-green-500/80 flex items-center gap-1">
                          <Check size={10} /> {offer.seller.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E78F23] shadow-[0_0_8px_rgba(231,143,35,0.5)]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Negotiation</span>
                    </div>
                  </div>

                  {/* Deal Summary Card */}
                  <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 md:p-8 space-y-8 mb-3">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Deal Summary</div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 mb-1">Current Offer</div>
                        <div className="text-[32px] md:text-[40px] font-black text-[#D4AF37] leading-none tracking-tight">
                          {offer.summary.currentOffer}
                        </div>
                        <div className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                          Asking: {offer.summary.askingPrice}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-gray-500 uppercase tracking-widest">Last Updated</span>
                        <span className="text-white/80">{offer.summary.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-gray-500 uppercase tracking-widest">Deal ID</span>
                        <span className="text-white/80 font-mono tracking-normal">{offer.id}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-gray-500 uppercase tracking-widest">Listed Price</span>
                        <span className="text-white/80">{offer.summary.listedPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Smart Insight */}
                  <div className="bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-xl p-4 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E78F23] flex items-center justify-center shrink-0 mt-0.5">
                      <Info size={12} className="text-black font-bold" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[#E78F23] uppercase tracking-wider">Smart Insight</div>
                      <p className="text-[11px] leading-relaxed text-[#E78F23]/90">
                        Buyer increased offer twice — likely serious. Response time averaging 2 hours
                      </p>
                    </div>
                  </div>
                </AnimationWrapper>
              </div>

              {/* Middle Column (Image & Actions) */}
              <div className="md:col-span-6 space-y-6">
                <AnimationWrapper type="fade-left">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <MapPin size={14} className="text-gray-600" />
                    {offer.location}
                  </div>

                  {/* Main Product Image */}
                  <div className="relative aspect-16/10 rounded-[2rem] overflow-hidden border border-white/5 group">
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    <button className="w-full py-4.5 bg-[#D4AF37] hover:bg-[#c4a132] text-black font-bold text-xs uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      <Handshake size={18} />
                      Accept offer
                    </button>
                    <button className="w-full py-4.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      <RefreshCcw size={16} />
                      Send Counter Offer
                    </button>
                    <button className="w-full py-4.5 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 text-[#FF4D4D] font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-[#8B0000]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      <X size={16} />
                      Reject Offer
                    </button>
                  </div>
                </AnimationWrapper>
              </div>
            </div>

            {/* Conversation Section */}
            <AnimationWrapper type="fade-up">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold font-clash">Conversation</h2>

                <div className="bg-[#111113] rounded-[2rem] border border-white/5 p-6 md:p-8 space-y-6">
                  <div className="space-y-6 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                    {offer.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'Buyer' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] p-5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'Buyer'
                          ? 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                          : 'bg-[#2D2D20] border border-[#D4AF37]/20 text-white/90 rounded-br-none'
                          }`}>
                          {msg.text}
                          <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-tight">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="relative group/input mt-8">
                    <input
                      type="text"
                      placeholder="Type your message"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-14 text-sm focus:outline-hidden focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#c4a132] transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>

          {/* Right Column (Order History) */}
          <div className="lg:col-span-4">
            <AnimationWrapper type="fade-left">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold font-clash">Order History</h2>
                  {/* Recent Dropdown */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/60 cursor-pointer hover:text-white transition-colors">
                    recent <ChevronDown size={14} />
                  </div>
                </div>

                <div className="relative">
                  {/* Glow effect on history container */}
                  <div className="absolute -inset-px bg-linear-to-b from-[#D4AF37]/10 to-transparent rounded-[2rem] opacity-50 pointer-events-none" />

                  <div className="relative bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 md:p-8 space-y-6 h-full min-h-150">
                    <div className="space-y-4">
                      {offer.history.map((item) => (
                        <div
                          key={item.id}
                          className={`relative group p-5 rounded-2xl border transition-all duration-300 ${item.active
                            ? 'bg-white/5 border-[#D4AF37]/30 ring-1 ring-[#D4AF37]/20'
                            : 'bg-white/2 border-white/5 hover:bg-white/5'
                            }`}
                        >
                          <div className="flex items-center gap-5">
                            {/* Dot / Indicator */}
                            <div className="relative">
                              <Circle
                                size={10}
                                fill={item.color === 'blue' ? '#3B82F6' : '#D4AF37'}
                                className={item.color === 'blue' ? 'text-blue-500' : 'text-[#D4AF37]'}
                              />
                            </div>

                            <div className="grow flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.type}</div>
                                <div className="font-bold text-sm text-white/90">{item.entity}</div>
                                <div className="text-[10px] text-gray-500 font-medium">{item.date}</div>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg md:text-xl font-black tracking-tight ${item.active ? 'text-white' : 'text-white/80'}`}>
                                  {item.amount}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline line - purely decorative/implied by vertical spacing but I can add a subtle one if needed */}
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OfferDetails;

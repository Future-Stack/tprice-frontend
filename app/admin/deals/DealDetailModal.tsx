"use client";

import React from "react";
import { X, Flag, FileText } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

interface DealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

const DealDetailModal = ({ isOpen, onClose, deal }: DealDetailModalProps) => {
  if (!isOpen || !deal) return null;

  const timeline = [
    { title: "Deal Created", date: "2025-04-05", time: "10:30 AM" },
    { title: "Initial Offer Submitted", date: "2025-04-05", time: "11:05 AM" },
    { title: "Counter offer from Dealer", date: "2025-04-05", time: "02:15 AM" },
    { title: "Buyer Counter Offer", date: "2025-04-05", time: "09:30 PM" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <AnimationWrapper type="fade-up" duration={0.4}>
        <div className="bg-[#111111] border border-[#262626] rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            <h2 className="text-xl font-bold mb-8">Deal Id : {deal.id.toString().padStart(2, '0')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Current Offer */}
                <div className="bg-[#1A1A14] border border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                  <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">Current Offer</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{deal.offer}</p>
                </div>

                {/* Buyer */}
                <div className="bg-[#161616] border border-[#262626] rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Buyer</p>
                  <p className="text-xl font-medium text-white">{deal.buyer}</p>
                </div>

                {/* Dealer */}
                <div className="bg-[#161616] border border-[#262626] rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Dealer</p>
                  <p className="text-xl font-medium text-white">{deal.dealer}</p>
                </div>

                {/* Stage and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161616] border border-[#262626] rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stage</p>
                    <p className="text-sm font-medium text-white">{deal.stage}</p>
                  </div>
                  <div className="bg-[#161616] border border-[#262626] rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stage</p>
                    <p className="text-sm font-medium text-white">{deal.stage}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Timeline */}
              <div>
                <h3 className="text-lg font-bold mb-6">Deal Timeline</h3>
                <div className="bg-[#161616] border border-[#262626] rounded-2xl p-6 relative">
                  <div className="absolute left-[31px] top-8 bottom-8 w-[1px] bg-[#262626]" />
                  <div className="space-y-8 relative">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex gap-4 items-start translate-x-1">
                        <div className="relative z-10 w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] mt-1.5" />
                        <div>
                          <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            {item.date} <span className="ml-2">{item.time}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Action */}
            <div className="mt-10 pt-6 border-t border-[#262626]">
              <p className="text-sm font-medium text-gray-400 mb-6">Admin Action</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#161616] border border-[#262626] rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:border-gray-600 transition-all group">
                  <Flag className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                  Flag Deal
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#161616] border border-[#262626] rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:border-gray-600 transition-all group">
                  <FileText className="w-4 h-4 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default DealDetailModal;

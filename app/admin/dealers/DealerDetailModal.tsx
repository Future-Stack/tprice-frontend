"use client";

import React from "react";
import { X, Mail, Check, Briefcase, Gavel, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

interface DealerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: any;
}

const DealerDetailModal = ({ isOpen, onClose, dealer }: DealerDetailModalProps) => {
  if (!isOpen || !dealer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <AnimationWrapper type="fade-up" duration={0.4}>
        <div className="bg-[#111111] border border-[#262626] rounded-[32px] w-full max-w-md overflow-hidden relative shadow-2xl">
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Dealer Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-8 pb-8 pt-4">
            {/* Divider */}
            <div className="h-[1px] bg-[#262626] w-full mb-8" />

            {/* Profile Section */}
            <div className="flex items-start gap-4 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#262626]">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop"
                    alt={dealer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{dealer.name}</h3>
                  <div className="bg-gray-500/20 p-0.5 rounded-full">
                    <Check className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{dealer.email}</span>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Dealer</span>
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </div>
                   </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-3 font-medium">last active {dealer.lastActive}</p>
              </div>
            </div>

            {/* Stats Divider */}
            <div className="h-[1px] bg-[#262626] w-full mb-8" />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {/* Active Deals */}
              <div className="bg-[#161616] border border-[#262626] rounded-2xl p-4 text-center">
                <div className="bg-yellow-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 border border-yellow-500/20">
                  <Briefcase className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-tight mb-1">Active Deals</p>
                <p className="text-2xl font-bold text-white leading-none">{dealer.activeDeals}</p>
              </div>

              {/* Total Listings */}
              <div className="bg-[#161616] border border-[#262626] rounded-2xl p-4 text-center">
                <div className="bg-yellow-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 border border-yellow-500/20">
                  <Gavel className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-tight mb-1">Total listings</p>
                <p className="text-2xl font-bold text-white leading-none">{dealer.totalListings}</p>
              </div>

              {/* Completed */}
              <div className="bg-[#161616] border border-[#262626] rounded-2xl p-4 text-center">
                <div className="bg-yellow-500/10 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 border border-yellow-500/20">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-tight mb-1">Completed</p>
                <p className="text-2xl font-bold text-white leading-none">{dealer.completed}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all active:scale-[0.98] text-sm">
                View Full profile
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1111] border border-red-500/20 hover:border-red-500/40 text-red-500 font-bold rounded-xl transition-all active:scale-[0.98] text-sm">
                <AlertCircle className="w-4 h-4" />
                Suspend Dealer
              </button>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default DealerDetailModal;

"use client";

import React, { useState } from "react";
import {
  Settings2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import DealDetailModal from "./DealDetailModal";

const TABS = ["Active Deals", "Negotiation", "Closed", "Flagged"];

const DEALS_DATA = [
  {
    id: 1,
    listing: "Rolls-Royals Phantom 2023",
    buyer: "Marcus Chen",
    dealer: "Elite Motors",
    offer: "$299,00",
    stage: "Negotiation",
    health: {
      status: "critical",
      message: "No response for 48 hours",
      time: "2 days ago"
    },
    lastActivity: "2 days ago"
  },
  {
    id: 2,
    listing: "Ferrari SF90 Stradale",
    buyer: "Sarah Williams",
    dealer: "Maritime luxury",
    offer: "$399,00",
    stage: "Negotiation",
    health: {
      status: "warning",
      message: "Multiple counter offers",
      time: "6h ago"
    },
    lastActivity: "6h ago"
  },
  {
    id: 3,
    listing: "2024 Lamborghini Revuelto",
    buyer: "James Peterson",
    dealer: "Aviation Elite",
    offer: "$499,00",
    stage: "Negotiation",
    health: {
      status: "healthy",
      message: "",
      time: "12 hours ago"
    },
    lastActivity: "12 hours ago"
  },
  {
    id: 4,
    listing: "Rolls-Royals Phantom 2023",
    buyer: "Emma Thompson",
    dealer: "Elite Motors",
    offer: "$350,00",
    stage: "Offer",
    health: {
      status: "healthy",
      message: "",
      time: "1 hours ago"
    },
    lastActivity: "1 hours ago"
  },
  {
    id: 5,
    listing: "Rolls-Royals Phantom 2023",
    buyer: "David Smith",
    dealer: "Elite Motors",
    offer: "$350,00",
    stage: "Offer",
    health: {
      status: "healthy",
      message: "",
      time: "4 days ago"
    },
    lastActivity: "4 days ago"
  },
  {
    id: 6,
    listing: "2024 Lamborghini Revuelto",
    buyer: "Marcus Chen",
    dealer: "Elite Motors",
    offer: "$350,00",
    stage: "Offer",
    health: {
      status: "healthy",
      message: "",
      time: "1 week ago"
    },
    lastActivity: "1 week ago"
  }
];

export default function AdminDeals() {
  const [activeTab, setActiveTab] = useState("Active Deals");
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDeal = (deal: any) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white font-sans ">
      {/* Header Section */}
      <div className="mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h1 className="text-3xl font-bold mb-2">Deals</h1>
          <p className="text-gray-400 text-sm">Monitor all deals from one place</p>
        </AnimationWrapper>
      </div>

      {/* Tabs Section */}
      <div className="mb-6 border-b border-[#262626]">
        <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </AnimationWrapper>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-xs font-medium text-gray-400 hover:bg-[#202020] transition-colors">
            <span>Dealer</span>
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </AnimationWrapper>
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Listing</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Buyer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dealer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Offer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stage</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Health</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Last Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DEALS_DATA.map((deal) => (
                  <tr
                    key={deal.id}
                    className="group hover:bg-[#1A1A1A] transition-colors duration-200"
                  >
                    <td className="px-6 py-6 font-medium text-sm">{deal.listing}</td>
                    <td className="px-6 py-6 text-sm text-gray-400">{deal.buyer}</td>
                    <td className="px-6 py-6 text-sm text-gray-400">{deal.dealer}</td>
                    <td className="px-6 py-6 text-sm font-bold">{deal.offer}</td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-[10px] text-gray-400 font-medium">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {deal.health.status === "critical" && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-gray-400">{deal.health.message}</span>
                            <span className="text-xs font-bold text-white">{deal.health.time}</span>
                          </>
                        )}
                        {deal.health.status === "warning" && (
                          <>
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-gray-400">{deal.health.message}</span>
                            <span className="text-xs font-bold text-white">{deal.health.time}</span>
                          </>
                        )}
                        {deal.health.status === "healthy" && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-white ml-auto">{deal.health.time}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-right text-gray-400">
                      {deal.lastActivity}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={() => handleViewDeal(deal)}
                        className="px-4 py-2 border border-yellow-500/50 rounded-lg text-xs font-medium text-white hover:bg-yellow-500 hover:text-black transition-all active:scale-95 whitespace-nowrap"
                      >
                        view Deal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimationWrapper>

      <DealDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
      />
    </div>
  );
}

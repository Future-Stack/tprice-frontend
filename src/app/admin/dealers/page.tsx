"use client";

import React, { useState } from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import DealerDetailModal from "./DealerDetailModal";

const DEALERS_DATA = [
  {
    id: 1,
    name: "David Johnson",
    email: "davidjohnson@gmail.com",
    status: "Active",
    activeDeals: 8,
    totalListings: 8,
    completed: 156,
    lastActive: "2h ago",
  },
  {
    id: 2,
    name: "Sarah Martinez",
    email: "sarahmartinez@gmail.com",
    status: "Active",
    activeDeals: 12,
    totalListings: 8,
    completed: 200,
    lastActive: "15 minutes ago",
  },
  {
    id: 3,
    name: "Michel Chen",
    email: "michelchen@gmail.com",
    status: "Active",
    activeDeals: 16,
    totalListings: 8,
    completed: 500,
    lastActive: "3d ago",
  },
  {
    id: 4,
    name: "Rolex Daytona 116500LN",
    email: "rolexdaytona@gmail.com",
    status: "Active",
    activeDeals: 10,
    totalListings: 8,
    completed: 600,
    lastActive: "4d ago",
  },
  {
    id: 5,
    name: "Bombardier Global 7500",
    email: "bombardier@gmail.com",
    status: "Suspended",
    activeDeals: 7,
    totalListings: 8,
    completed: 100,
    lastActive: "1d ago",
  },
];

export default function AdminDealers() {
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleManageClick = (dealer: any) => {
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <h1 className="text-3xl font-bold mb-2">Dealer Manage</h1>
        </AnimationWrapper>
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    ITEM & DETAILS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    ACTIVE DEALS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    TOTAL LISTINGS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    COMPLETED
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    LAST ACTIVE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEALERS_DATA.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="group hover:bg-[#1A1A1A] transition-colors duration-200"
                  >
                    <td className="px-6 py-6">
                      <div>
                        <div className="font-medium text-sm text-gray-200">
                          {dealer.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dealer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-l border-[#1A1A1A]/50">
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 ${
                            dealer.status === "Active"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              dealer.status === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          {dealer.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-center font-semibold text-gray-300">
                      {dealer.activeDeals}
                    </td>
                    <td className="px-6 py-6 text-sm text-center font-semibold text-gray-300">
                      {dealer.totalListings}
                    </td>
                    <td className="px-6 py-6 text-sm text-center font-semibold text-gray-300">
                      {dealer.completed}
                    </td>
                    <td className="px-6 py-6 text-sm text-center text-gray-400">
                      {dealer.lastActive}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => handleManageClick(dealer)}
                        className="px-5 py-2 border border-yellow-500/60 rounded-lg text-xs font-semibold text-gray-200 hover:bg-yellow-500 hover:text-black transition-all active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimationWrapper>
      {/* Dealer Detail Modal */}
      <DealerDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealer={selectedDealer}
      />
    </div>
  );
}
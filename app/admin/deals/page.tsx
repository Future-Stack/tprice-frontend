"use client";

import React, { useState } from "react";
import {
  Settings2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import DealDetailModal from "./DealDetailModal";
import { useAdminDealsQuery } from "@/hooks/useDeals";
import { DealItem } from "@/lib/api/deals";

const TABS = ["Active Deals", "Negotiation", "Closed", "Flagged"];

const formatPrice = (priceStr?: string | number) => {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  return `$${num.toLocaleString()}`;
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    if (diffMin > 0) {
      return `${diffMin}m ago`;
    }
    return "Just now";
  } catch {
    return dateString;
  }
};

const getDealHealth = (deal: DealItem) => {
  const stage = (deal.stage || "").toUpperCase();
  if (deal.isFlagged || stage === "FLAGGED") {
    return {
      status: "critical",
      message: "Flagged for review",
      time: formatTimeAgo(deal.updatedAt || deal.createdAt),
    };
  }
  if (stage === "NEGOTIATION") {
    return {
      status: "warning",
      message: "In negotiation",
      time: formatTimeAgo(deal.updatedAt || deal.createdAt),
    };
  }
  if (stage === "VERIFICATION") {
    return {
      status: "warning",
      message: "In verification",
      time: formatTimeAgo(deal.updatedAt || deal.createdAt),
    };
  }
  return {
    status: "healthy",
    message: "",
    time: formatTimeAgo(deal.updatedAt || deal.createdAt),
  };
};

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-6">
          <div className="w-48 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-6">
          <div className="w-32 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-6">
          <div className="w-32 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-6">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-6">
          <div className="w-20 h-6 bg-white/10 rounded-md" />
        </td>
        <td className="px-6 py-6">
          <div className="w-36 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-6">
          <div className="w-24 h-4 bg-white/10 rounded ml-auto" />
        </td>
        <td className="px-6 py-6 text-right">
          <div className="w-20 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminDeals() {
  const [activeTab, setActiveTab] = useState("Active Deals");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useAdminDealsQuery({
    page,
    limit,
  });

  const deals = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const filteredDeals = React.useMemo(() => {
    if (!deals || deals.length === 0) return [];
    switch (activeTab) {
      case "Negotiation":
        return deals.filter(
          (d) => (d.stage || "").toUpperCase() === "NEGOTIATION"
        );
      case "Closed":
        return deals.filter((d) => {
          const stage = (d.stage || "").toUpperCase();
          return stage === "COMPLETED" || stage === "CLOSED";
        });
      case "Flagged":
        return deals.filter(
          (d) => d.isFlagged || (d.stage || "").toUpperCase() === "FLAGGED"
        );
      case "Active Deals":
      default:
        return deals.filter((d) => {
          const stage = (d.stage || "").toUpperCase();
          return stage !== "COMPLETED" && stage !== "CLOSED";
        });
    }
  }, [deals, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleViewDeal = (deal: DealItem) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans">
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
                onClick={() => handleTabChange(tab)}
                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
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
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-xs font-medium text-gray-400 hover:bg-[#202020] transition-colors cursor-pointer">
            <span>Dealer</span>
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </AnimationWrapper>
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Listing
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Dealer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Offer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Health
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                    Last Activity
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-red-400">
                      Failed to load deals. {(error as Error)?.message}
                    </td>
                  </tr>
                ) : filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No deals found for this view.
                    </td>
                  </tr>
                ) : (
                  filteredDeals.map((deal) => {
                    const health = getDealHealth(deal);
                    const buyerName = deal.buyer
                      ? `${deal.buyer.firstName || ""} ${deal.buyer.lastName || ""}`.trim() ||
                        deal.buyer.email ||
                        "Unknown Buyer"
                      : "Unknown Buyer";
                    const dealerName = deal.seller
                      ? `${deal.seller.firstName || ""} ${deal.seller.lastName || ""}`.trim() ||
                        deal.seller.email ||
                        "Unknown Dealer"
                      : "Unknown Dealer";

                    return (
                      <tr
                        key={deal.id}
                        className="group hover:bg-[#1A1A1A] transition-colors duration-200"
                      >
                        <td className="px-6 py-6 font-medium text-sm text-white">
                          {deal.listing?.title || "N/A"}
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-400">
                          {buyerName}
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-400">
                          {dealerName}
                        </td>
                        <td className="px-6 py-6 text-sm font-bold text-white">
                          {formatPrice(deal.agreedPrice)}
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-[10px] text-gray-400 font-medium uppercase">
                            {deal.stage || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            {health.status === "critical" && (
                              <>
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                {health.message && (
                                  <span className="text-xs text-gray-400">
                                    {health.message}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-white">
                                  {health.time}
                                </span>
                              </>
                            )}
                            {health.status === "warning" && (
                              <>
                                <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                {health.message && (
                                  <span className="text-xs text-gray-400">
                                    {health.message}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-white">
                                  {health.time}
                                </span>
                              </>
                            )}
                            {health.status === "healthy" && (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-xs font-bold text-white ml-auto">
                                  {health.time}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-right text-gray-400">
                          {formatTimeAgo(deal.updatedAt || deal.createdAt)}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => handleViewDeal(deal)}
                            className="px-4 py-2 border border-yellow-500/50 rounded-lg text-xs font-medium text-white hover:bg-yellow-500 hover:text-black transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                          >
                            view Deal
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && deals.length > 0 && (
            <div className="px-6 py-4 bg-[#141416] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <div>
                Showing{" "}
                <span className="font-semibold text-white">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-semibold text-white">{meta.total}</span>{" "}
                deals
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-yellow-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                        pageNum === meta.page
                          ? "bg-yellow-500 text-black border-yellow-500 font-bold shadow-[0_2px_10px_rgba(234,179,8,0.3)]"
                          : "bg-[#1A1A1C] border-[#262626] text-gray-300 hover:text-white hover:border-yellow-500/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-yellow-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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

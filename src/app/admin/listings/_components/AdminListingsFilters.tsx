import React from "react";
import { Search } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { AdminListingsFiltersProps, TABS, LIMIT_OPTIONS } from "./types";

export function AdminListingsFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  limit,
  onLimitChange,
}: AdminListingsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4 sm:pb-0">
          {/* Tabs */}
          <div className="flex gap-8 overflow-x-auto w-full sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap px-2 cursor-pointer ${
                  activeTab === tab
                    ? "text-white font-semibold"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* Search and Limit Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search listings..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
              <span className="hidden md:inline">Per page:</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="bg-[#141416] border border-[#262626] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-primary/60 cursor-pointer"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#141416]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default AdminListingsFilters;

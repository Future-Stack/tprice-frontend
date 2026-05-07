"use client";

import React from "react";
import { Search, ChevronDown, ListFilter } from "lucide-react";

interface ServicesSearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onMobileFilterOpen: () => void;
}

export default function ServicesSearchBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  onMobileFilterOpen,
}: ServicesSearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
      {/* Search Bar */}
      <div className="relative flex-1 group w-full">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by name, specialty or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1A1A1A] border-none text-white pl-16 pr-6 py-5 rounded-xl outline-none ring-1 ring-white/5 focus:ring-primary/40 transition-all font-medium placeholder:text-white/20"
        />
      </div>

      {/* Sort & Mobile Filter */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={onMobileFilterOpen}
          className="lg:hidden flex items-center justify-center p-5 bg-[#1A1A1A] rounded-xl ring-1 ring-white/5 text-white/60 hover:text-white transition-colors"
        >
          <ListFilter className="w-6 h-6" />
        </button>

        <div className="relative flex-1 md:w-48">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none border-r border-white/10 pr-3">
              <ListFilter className="w-4 h-4 text-white/40" />
           </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#1A1A1A] text-white pl-14 pr-10 py-5 rounded-xl outline-none ring-1 ring-white/5 focus:ring-primary/40 transition-all appearance-none cursor-pointer font-medium"
          >
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
            <option value="experience">Most Experienced</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

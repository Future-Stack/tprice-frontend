"use client";

import React from "react";
import { Search, ChevronDown, SlidersHorizontal, ListFilter } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onMobileFilterOpen: () => void;
}

export default function SearchBar({ search, setSearch, sortBy, setSortBy, onMobileFilterOpen }: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input
          type="text"
          placeholder="Search by name and location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-white/5 rounded-lg py-3 pl-16 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium"
        />
      </div>

      {/* Mobile Filter Button */}
      <button 
        onClick={onMobileFilterOpen}
        className="md:hidden flex items-center justify-center gap-2 w-full bg-[#111] border border-white/5 rounded-lg py-5 text-white hover:bg-primary/10 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filters
      </button>

      {/* Sort Dropdown */}
      <div className="relative group w-full md:w-64">
        <ListFilter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#111] border border-white/5 rounded-lg py-3 pl-16 pr-12 text-white/80 appearance-none focus:outline-none focus:border-primary/50 cursor-pointer font-medium"
        >
          <option value="newest" className="bg-[#111]">Newest</option>
          <option value="oldest" className="bg-[#111]">Oldest</option>
          <option value="price-low" className="bg-[#111]">Price: Low to High</option>
          <option value="price-high" className="bg-[#111]">Price: High to Low</option>
        </select>
        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}

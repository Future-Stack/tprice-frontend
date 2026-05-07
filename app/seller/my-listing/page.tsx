"use client";

import React from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  Plus
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";

const listings = [
  {
    id: "LST-001",
    name: "Ferrari 488 Spider",
    dateAdded: "Oct 12, 2023",
    category: "Supercar",
    price: "$345,000",
    status: "Live",
    engagement: "1,245",
    image: "/images/listings/ferrari.png",
  },
  {
    id: "LST-002",
    name: "Azimut Grande 27 Metri",
    dateAdded: "Sep 28, 2023",
    category: "Yacht",
    price: "$6,500,000",
    status: "Live",
    engagement: "8,320",
    image: "https://images.unsplash.com/photo-1567899539078-4e8586b39da7?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "LST-003",
    name: "Rolex Daytona 116500LN",
    dateAdded: "Oct 24, 2023",
    category: "Watch",
    price: "$32,500",
    status: "Pending",
    engagement: "0",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "LST-004",
    name: "Modern Bel Air Mansion",
    dateAdded: "Aug 15, 2023",
    category: "Real Estate",
    price: "$14,000,000",
    status: "Sold",
    engagement: "12,450",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "LST-005",
    name: "Bombardier Global 7500",
    dateAdded: "Oct 20, 2023",
    category: "Private Jet",
    price: "$72,000,000",
    status: "Rejected",
    engagement: "0",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=300&h=200",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Live":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Pending":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "Sold":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Rejected":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const SellerListing = () => {
  return (
    <div className="w-full max-w-350 mx-auto space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AnimationWrapper type="fade-down">
          <h1 className="text-4xl font-medium font-clash tracking-tight text-white">My Listings</h1>
        </AnimationWrapper>

        <AnimationWrapper type="fade-down" delay={0.1}>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#E78F23] hover:bg-[#E78F23]/90 transition-all duration-300 text-black font-bold rounded-xl shadow-[0_0_25px_rgba(231,143,35,0.3)] hover:scale-[1.02] active:scale-[0.98]">
            Add Listing
          </button>
        </AnimationWrapper>
      </div>

      <div className="space-y-6">
        {/* Filters Section */}
        <AnimationWrapper type="fade-up" delay={0.2}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-100">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full bg-[#121212] border border-[#2D2D2D] rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]/40 focus:ring-1 focus:ring-[#E78F23]/40 transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center gap-2 px-6 py-2.5 border border-[#E78F23]/60 text-[#E78F23] rounded-xl hover:bg-[#E78F23]/10 transition-all duration-300 font-medium whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <span className="text-gray-400 font-medium text-sm whitespace-nowrap">
                Showing <span className="text-white font-bold text-lg">5</span> items
              </span>
            </div>
          </div>
        </AnimationWrapper>

        {/* Listings Table Section */}
        <AnimationWrapper type="fade-up" delay={0.3}>
          <div className="relative bg-[#0D0D0D] border border-[#1F1F1F] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Table bottom glow effect */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-[#E78F23] blur-[2px] opacity-40"></div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-250">
                <thead>
                  <tr className="border-b border-[#1F1F1F]">
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Item</th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Category</th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Price</th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Engagement</th>
                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {listings.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-white/3 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A] border border-[#2D2D2D] transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-white group-hover:text-[#E78F23] transition-colors duration-300 truncate">{item.name}</p>
                            <p className="text-[12px] text-gray-500 mt-1 font-medium">
                              {item.id} <span className="mx-1.5">•</span> Added {item.dateAdded}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-400 font-medium">{item.category}</td>
                      <td className="px-8 py-6 text-lg font-extrabold text-white">{item.price}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full border tracking-wide inline-block ${getStatusStyles(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5 text-sm text-gray-400 font-bold">
                          <Eye className="w-5 h-5 text-gray-500" />
                          <span>{item.engagement}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300">
                          <MoreVertical className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default SellerListing;

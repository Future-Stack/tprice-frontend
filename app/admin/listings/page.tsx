"use client";

import React, { useState } from "react";
import { Trash2, Check, X } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import Image from "next/image";

const TABS = ["All listings", "pending", "Approved", "Rejected"];

const LISTINGS_DATA = [
    {
        id: 1,
        name: "Rolls-Royals Phantom 2023",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
        dealer: "Elite Motors",
        price: "$299,00",
        category: "Cars",
        submitted: "Today",
        status: "pending",
    },
    {
        id: 2,
        name: "Ferrari SF90 Stradale",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
        dealer: "Maritime luxury",
        price: "$399,00",
        category: "Cars",
        submitted: "Today",
        status: "pending",
    },
    {
        id: 3,
        name: "2024 Lamborghini Revuelto",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
        dealer: "Aviation Elite",
        price: "$499,00",
        category: "Cars",
        submitted: "Today",
        status: "Approved",
    },
    {
        id: 4,
        name: "Rolls-Royals Phantom 2023",
       image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
        dealer: "Elite Motors",
        price: "$350,00",
        category: "Cars",
        submitted: "Today",
        status: "Approved",
    },
    {
        id: 5,
        name: "Rolls-Royals Phantom 2023",
        image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
        dealer: "Elite Motors",
        price: "$350,00",
        category: "Cars",
        submitted: "Today",
        status: "Rejected",
    },
    {
        id: 6,
        name: "2024 Lamborghini Revuelto",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
        dealer: "Elite Motors",
        price: "$350,00",
        category: "Cars",
        submitted: "Today",
        status: "Rejected",
    },
];

export default function AdminListingsPage() {
    const [activeTab, setActiveTab] = useState("All listings");

    const filteredListings = activeTab === "All listings"
        ? LISTINGS_DATA
        : LISTINGS_DATA.filter(item => item.status.toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="min-h-screen text-white font-sans ">
            {/* Header Section */}
            <div className="mb-10">
                <AnimationWrapper type="fade-down" duration={0.5}>
                    <h1 className="text-3xl font-bold mb-6">Manage and review all listings</h1>
                </AnimationWrapper>

                {/* Tabs Section */}
                <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
                    <div className="flex gap-8 border-b border-[#262626]">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap px-2 ${activeTab === tab ? "text-white font-semibold" : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </AnimationWrapper>
            </div>

            {/* Table Section */}
            <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
                <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-250">
                            <thead>
                                <tr className="bg-[#151515] border-b border-primary/30">
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Listing</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dealer</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Submitted</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1A1A1A]">
                                {filteredListings.map((listing) => (
                                    <tr
                                        key={listing.id}
                                        className="group hover:bg-[#151515] transition-all duration-300"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-[#262626]">
                                                    <Image
                                                        src={listing.image}
                                                        alt={listing.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="font-semibold text-base text-gray-100">{listing.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                                            {listing.dealer}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-base text-white">
                                            {listing.price}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-400">
                                            {listing.category}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-400">
                                            {listing.submitted}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`
                        inline-flex px-4 py-1.5 rounded-lg text-xs font-bold capitalize tracking-wide
                        ${listing.status === "pending" ? "bg-yellow-500/10 text-primary border border-primary/20" : ""}
                        ${listing.status === "Approved" ? "bg-green-500/10 text-green-500 border border-green-500/20" : ""}
                        ${listing.status === "Rejected" ? "bg-red-500/10 text-red-500 border border-red-500/20" : ""}
                      `}>
                                                {listing.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                {listing.status === "pending" && (
                                                    <>
                                                        <button className="px-6 py-2 bg-primary hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95">
                                                            Approve
                                                        </button>
                                                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-all active:scale-95">
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {listing.status === "Approved" && (
                                                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                {listing.status === "Rejected" && (
                                                    <button className="px-6 py-2 bg-primary cursor-pointer text-black text-xs font-bold rounded-lg transition-all active:scale-95">
                                                        Approve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimationWrapper>
        </div>
    );
}
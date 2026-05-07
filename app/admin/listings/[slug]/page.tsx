"use client";

import React from "react";
import {
    MapPin,
    BadgeCheck,
    Clock,
    User,
    Mail,
    ListOrdered,
    Handshake,
    CheckCircle2,
    XCircle,
    Copy,
    TrendingUp,
    Fuel,
    Zap,
    Gauge
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

const listingData = {
    title: "New BMW M5",
    price: "$450,000",
    status: "Pending Approval",
    seller: {
        name: "James Morrison",
        location: "Monaco, Monte Carlo",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
        dealerName: "Prestige motors Monaco",
        dealerEmail: "jamesmson3@gmail.com",
        totalListings: 47,
        activeDeals: 47
    },
    timeAgo: "21 minutes ago",
    submittedAt: "Submitted 2 hours ago",
    listingId: "LST-2024-6472",
    images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400"
    ],
    specs: [
        { label: "Mileage", value: "1200 mi", icon: Gauge },
        { label: "0-100", value: "5 sec", icon: TrendingUp },
        { label: "power", value: "661 HP", icon: Zap },
        { label: "Engine", value: "3.9L V8 Twin-Turbo", icon: Fuel },
    ],
    condition: "Excellent",
    description: "A striking new BMW M5 that perfectly blends luxury with high-performance engineering. Finished in a sleek, aggressive exterior with a premium leather interior, this powerhouse features a twin-turbocharged V8, advanced M xDrive all-wheel-drive system, and cutting-edge driver assistance technology."
};

export default function AdminListingDetails() {
    return (
        <div className="min-h-screen  text-white   font-sans">
            <div className=" ">

                {/* --- Listing Review Title --- */}
                <AnimationWrapper type="fade-down" duration={0.5}>
                    <h1 className="text-2xl md:text-3xl font-semibold mb-6">Listing Review</h1>
                </AnimationWrapper>

                {/* --- Top Header Card --- */}
                <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
                    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-medium">{listingData.title}</h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="text-primary text-2xl font-semibold">{listingData.price}</span>
                                <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-primary">
                                    <img src={listingData.seller.avatar} alt="" className="w-5 h-5 rounded-full" />
                                    <span className="text-sm text-gray-300">{listingData.seller.name}</span>
                                    <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    <span>{listingData.seller.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 text-right">
                            <span className="px-4 py-2 rounded-lg border border-primary bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                                {listingData.status}
                            </span>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Clock className="w-4 h-4" />
                                <span>{listingData.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                </AnimationWrapper>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Left Column (2/3) --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <AnimationWrapper type="zoom" duration={0.6}>
                                <div className="rounded-2xl overflow-hidden border border-primary bg-[#141414]">
                                    <img
                                        src={listingData.images[0]}
                                        alt="Main Car"
                                        className="w-full h-[400px] md:h-[500px] object-cover"
                                    />
                                </div>
                            </AnimationWrapper>

                            <div className="grid grid-cols-3 gap-4">
                                {listingData.images.slice(1).map((img, i) => (
                                    <AnimationWrapper key={i} type="fade-up" delay={0.1 * (i + 1)}>
                                        <div className="rounded-xl overflow-hidden border border-primary bg-[#141414] h-24 md:h-32">
                                            <img src={img} alt="" className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                                        </div>
                                    </AnimationWrapper>
                                ))}
                            </div>
                        </div>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                {listingData.specs.map((spec, i) => (
                                    <AnimationWrapper key={i} type="fade-up" delay={0.2 + (i * 0.05)}>
                                        <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl space-y-2">
                                            <p className="text-primary text-[10px] uppercase font-bold tracking-widest">{spec.label}</p>
                                            <p className="text-xl font-medium">{spec.value}</p>
                                        </div>
                                    </AnimationWrapper>
                                ))}
                            </div>

                            <AnimationWrapper type="fade-up" delay={0.4}>
                                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-center items-start h-full">
                                    <p className="text-primary text-[10px] uppercase font-bold tracking-widest mb-3">Condition</p>
                                    <p className="text-2xl font-semibold text-white">{listingData.condition}</p>
                                </div>
                            </AnimationWrapper>
                        </div>

                        {/* Description */}
                        <AnimationWrapper type="fade-up" delay={0.5}>
                            <div className="space-y-4">
                                <h3 className="text-primary text-[10px] uppercase font-bold tracking-widest">Description</h3>
                                <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {listingData.description}
                                    </p>
                                </div>
                            </div>
                        </AnimationWrapper>
                    </div>

                    {/* --- Right Column (1/3) --- */}
                    <div className="space-y-6">

                        {/* Dealer Information */}
                        <AnimationWrapper type="fade-left" delay={0.2}>
                            <div className="bg-[#141414]   rounded-2xl p-6 space-y-8">
                                <h2 className="text-2xl font-semibold text-center mt-2">Dealer Information</h2>

                                <div className="space-y-6">
                                    {/* Dealer Meta */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Dealer Info</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{listingData.seller.dealerName}</p>
                                                    <BadgeCheck className="w-4 h-4 text-gray-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email</p>
                                                <p className="text-sm font-medium text-gray-300">{listingData.seller.dealerEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dealer Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#151C1A] border border-[#1E2E28] rounded-xl p-4 space-y-2">
                                            <div className="flex items-center gap-2 text-[#22C55E]">
                                                <ListOrdered className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Total Listings</span>
                                            </div>
                                            <p className="text-3xl font-semibold text-center">{listingData.seller.totalListings}</p>
                                        </div>
                                        <div className="bg-[#151D24] border border-[#1E2730] rounded-xl p-4 space-y-2">
                                            <div className="flex items-center gap-2 text-[#3B82F6]">
                                                <Handshake className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Active Deals</span>
                                            </div>
                                            <p className="text-3xl font-semibold text-center">{listingData.seller.activeDeals}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 pt-4">
                                        <button className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Approve listing
                                        </button>
                                        <button className="w-full bg-[#1A1A1A] border border-[#262626] hover:bg-[#202020] text-gray-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                            <XCircle className="w-5 h-5" />
                                            Reject listing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AnimationWrapper>

                        {/* Meta Information */}
                        <AnimationWrapper type="fade-left" delay={0.3}>
                            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6">
                                <p className="text-xs text-gray-500 font-medium">Meta Information</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[13px]">{listingData.submittedAt}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1 flex items-center justify-between bg-[#0F0F0F] px-4 py-2 rounded-lg border border-[#262626]">
                                            <span className="text-[11px] font-mono text-gray-500">{listingData.listingId}</span>
                                            <button className="text-primary hover:text-primary/80">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimationWrapper>

                    </div>
                </div>
            </div>
        </div>
    );
}
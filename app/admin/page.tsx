"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Handshake,
  ListOrdered,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

// Mock data for display
const stats = [
  {
    title: "Active Dealers",
    value: "12",
    trend: "+2 this week",
    trendColor: "text-[#4ADE80]",
    icon: <Users className="w-5 h-5 text-primary" />,
    glow: "shadow-[0_0_20px_-5px_rgba(231,143,35,0.15)]",
    hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(231,143,35,0.3)]"
  },
  {
    title: "Pending listings",
    value: "4",
    trend: "5 listings require approval",
    trendColor: "text-[#EF4444]",
    icon: <FileText className="w-5 h-5 text-primary" />,
    glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]",
    hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]"
  },
  {
    title: "Active Deals",
    value: "7",
    trend: "3 response required",
    trendColor: "text-[#60A5FA]",
    icon: <Handshake className="w-5 h-5 text-primary" />,
    glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.15)]",
    hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]"
  },
  {
    title: "Total Listing",
    value: "4",
    trend: "2 high priority",
    trendColor: "text-[#F59E0B]",
    icon: <ListOrdered className="w-5 h-5 text-primary" />,
    glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]",
    hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
  }
];

const pendingApprovals = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
    title: "Rolls-Royces Phantom 2023",
    dealer: "David John",
    time: "21 minutes ago",
    price: "$450,000"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
    title: "2024 Lamborghini Revuelto",
    dealer: "David John",
    time: "21 minutes ago",
    price: "$450,000"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop",
    title: "2024 Lamborghini Revuelto",
    dealer: "David John",
    time: "21 minutes ago",
    price: "$450,000"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=800&auto=format&fit=crop",
    title: "Rolls-Royces Phantom 2023",
    dealer: "David John",
    time: "21 minutes ago",
    price: "$450,000"
  }
];

const topDealers = [
  {
    name: "James Morrison",
    email: "jamesmorison3@gmail.com",
    deals: 8,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "David Jhonson",
    email: "david23243@gmail.com",
    deals: 6,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Leo Smith",
    email: "leosmith4@gmail.com",
    deals: 4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "David Jhonson",
    email: "david23243@gmail.com",
    deals: 5,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
  }
];

const recentActivity = [
  {
    type: "New Listing Submitted",
    description: "2023 Lamborghini Huracan STO by Prasgew Morris",
    amount: "$550,000",
    time: "2 hours ago",
    status: "new"
  },
  {
    type: "Listing Approved",
    description: "Rolls-Royces Phantom 2023",
    amount: "$450,000",
    time: "4 hours ago",
    status: "approved"
  },
  {
    type: "Deal Closed",
    description: "KATINA-MOTOR YACHT",
    amount: "$720,000",
    time: "6 hours ago",
    status: "closed"
  },
  {
    type: "Deal Rejected",
    description: "KATINA-MOTOR YACHT",
    amount: "$250,000",
    time: "8 hours ago",
    status: "rejected"
  }
];

const activeDeals = [
  { title: "Ferrari Lomo Spider", dealer: "ACB Motors", status: "Negotiation" },
  { title: "Mercedes-AMG One - Alex Turner", dealer: "Brothers Car", status: "Pending Payment" },
  { title: "Ferrari Lomo Spider", dealer: "ACB Motors", status: "Negotiation" }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-clash font-semibold text-white tracking-tight">
          Welcome back, David Smith
        </h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative bg-[#111113] border border-white/5 rounded-2xl p-6 transition-all duration-500 ${stat.glow} ${stat.hoverGlow} border-white/5 hover:border-[#E78F23]/40`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#E78F23]/10 rounded-xl border border-[#E78F23]/10 group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-400 font-medium">{stat.title}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-clash font-bold text-white tracking-tighter">
                {stat.value}
              </span>
              <span className={`text-[11px] font-semibold uppercase tracking-widest ${stat.trendColor}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pending Approvals (Left 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-clash font-medium text-white">Pending Approvals</h2>
          </div>
          <div className="grid gap-4">
            {pendingApprovals.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#111113] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/2 transition-all group"
              >
                <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="flex-1 space-y-2 py-1">
                  <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      By {item.dealer} <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                  <span className="text-2xl font-clash font-bold text-primary">{item.price}</span>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary hover:bg-primary/90 text-black font-bold text-xs rounded-lg transition-all active:scale-95 shadow-[0_4px_12px_rgba(231,143,35,0.2)]">
                      Approve
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-lg border border-white/10 transition-all active:scale-95">
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Dealers (Right 4/12) */}
        <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 h-fit shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-clash font-medium text-white">Dealers</h2>
            <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 group bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-all uppercase tracking-widest">
              Manage <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-8">
            {topDealers.map((dealer, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/2 -mx-4 px-4 py-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-[#E78F23]/50 transition-all ring-offset-2 ring-offset-[#111113] group-hover:ring-1 ring-[#E78F23]/30">
                    <Image src={dealer.avatar} alt={dealer.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {dealer.name} <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10 text-xs shrink-0" />
                    </span>
                    <span className="text-[11px] text-gray-500 truncate max-w-[140px] font-medium">{dealer.email}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-white group-hover:text-primary transition-colors">{dealer.deals}</div>
                  <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">active deals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity (Left 7/12) */}
        <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E78F23]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          <h2 className="text-2xl font-clash font-medium text-white mb-10">Recent Activity</h2>
          <div className="space-y-0">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className={`flex items-start justify-between py-6 ${i !== recentActivity.length - 1 ? 'border-b border-white/5' : ''} group relative z-10`}
              >
                <div className="flex items-start gap-5">
                  <div className="mt-1.5 shrink-0">
                    <div className={`w-3 h-3 rounded-full ${activity.status === 'new' ? 'bg-primary shadow-[0_0_12px_rgba(234,179,8,0.6)]' :
                      activity.status === 'approved' ? 'bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.6)]' :
                        activity.status === 'closed' ? 'bg-[#60A5FA] shadow-[0_0_12px_rgba(96,165,250,0.6)]' :
                          'bg-[#F87171] shadow-[0_0_12px_rgba(248,113,113,0.6)]'
                      }`} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors">{activity.type}</h4>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-base font-bold text-white tracking-tight">{activity.amount}</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Deals (Right 5/12) */}
        <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-clash font-medium text-white mb-10">Active Deals</h2>
          <div className="space-y-4 flex-1">
            {activeDeals.map((deal, i) => (
              <div
                key={i}
                className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/4 hover:border-primary/20 transition-all group lg:flex-row flex-col gap-4 text-center lg:text-left"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{deal.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{deal.dealer}</p>
                </div>
                <div className={`shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${deal.status === 'Negotiation'
                  ? 'text-primary border-primary/20 bg-primary/5'
                  : 'text-[#4ADE80] border-[#4ADE80]/20 bg-[#4ADE80]/5'
                  }`}>
                  {deal.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


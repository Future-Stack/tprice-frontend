"use client";

import React from "react";
import {
  Gavel,
  BadgePercent,
  List as ListIcon,
  Heart,
  FileText,
  Eye,
  MapPin,
  Pencil
} from "lucide-react";

import AnimationWrapper from "../components/AnimationWrapper";

export default function Home() {
  return (
    <div className="space-y-8 relative z-0">

      {/* Header */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div>
          <h2 className="text-[40px] font-clash font-medium tracking-wide">Welcome back, Alexander</h2>
        </div>
      </AnimationWrapper>

      {/* Stats Row */}
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12.5">
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
          <StatCard icon={<Gavel className="text-primary w-6 h-6" />} count="2" label="Active Bids" />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
          <StatCard icon={<ListIcon className="text-primary w-6 h-6" />} count="1" label="My Listings" />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.15}>
          <StatCard icon={<BadgePercent className="text-primary w-6 h-6" />} count="3" label="Offers Made" />
        </AnimationWrapper>
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
          <StatCard icon={<Heart className="text-primary w-6 h-6" />} count="8" label="Saved Items" />
        </AnimationWrapper>

      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Bids */}
        <AnimationWrapper type="fade-right" duration={0.6} delay={0.1}>
          <div className="bg-foreground p-7 rounded-2xl border border-primary2/30 shadow-xl hover:border-[#E78F23]/20 transition-colors"
            style={{
              boxShadow: "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)"
            }}

          >
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-clash font-medium">Your Active Bids</h3>
              <span className="bg-[#D98728] text-white text-[11px] font-bold w-5.5 h-5.5 flex items-center justify-center rounded">2</span>
            </div>

            <div className="space-y-6">
              <div className="border-b border-[#2C2C2E]/60 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-200">Ferrari 488 Spider</h4>
                  <span className="bg-green-500/10 text-green-500 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Leading</span>
                </div>
                <div className="flex justify-between text-[13px] mt-2">
                  <span className="text-gray-500 font-medium">Your bid: $295,000</span>
                  <span className="text-gray-500 font-medium">Current highest: $295,000</span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-200">Rolex Submariner</h4>
                  <span className="bg-red-500/10 text-red-500 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Outbid</span>
                </div>
                <div className="flex justify-between text-[13px] mt-2">
                  <span className="text-gray-500 font-medium">Your bid: $14,000</span>
                  <span className="text-gray-500 font-medium">Current highest: $15,500</span>
                </div>
              </div>
            </div>
          </div>
        </AnimationWrapper>

        {/* Recent Activity */}
        <AnimationWrapper type="fade-left" duration={0.6} delay={0.15}>
          <div className="bg-foreground p-7 rounded-2xl border border-primary2/30 shadow-xl hover:border-[#E78F23]/20 transition-colors"
            style={{
              boxShadow: "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)"
            }}
          >
            <h3 className="text-xl font-clash font-medium mb-8">Recent Activity</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2C2C2E]/60 pb-6">
                <div>
                  <h4 className="font-medium text-gray-200 m-0 text-[15px]">You placed a bid on Ferrari 488 Spider</h4>
                  <p className="text-[13px] text-gray-500 mt-1.5 font-medium">2 hours ago</p>
                </div>
                <button className="px-5 py-2 border border-primary rounded-lg text-[13px] font-medium text-white hover:bg-[#2C2C2E] transition-colors hover:text-white cursor-pointer">
                  View Details
                </button>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="font-medium text-gray-200 m-0 text-[15px]">Your offer for Patek Philippe was rejected</h4>
                  <p className="text-[13px] text-gray-500 mt-1.5 font-medium">1 day ago</p>
                </div>
                <button className="px-5 py-2 border border-primary rounded-lg text-[13px] font-medium text-white hover:bg-[#2C2C2E] transition-colors hover:text-white cursor-pointer">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* Active Listing Row */}
      <div className="pt-4 bg-foreground p-8 rounded-2xl"
        style={{
          boxShadow: "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)"
        }}
      >
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.05}>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-[32px] font-clash font-medium">Saved Items</h3>
            <span className="bg-[#D98728] text-white text-[11px] font-bold w-5.5 h-5.5 flex items-center justify-center rounded">8</span>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimationWrapper type="zoom" duration={0.5} delay={0.1}>
            <ListingCard
              image="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
              title="Ferrari 488 Spider"
              location="Monaco"
              price="$295,000"
              active
            />
          </AnimationWrapper>
          <AnimationWrapper type="zoom" duration={0.5} delay={0.15}>
            <ListingCard
              image="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800"
              title="Azimut Grande 27M"
              location="Monaco"
              price="$295,000"
            />
          </AnimationWrapper>
          <AnimationWrapper type="zoom" duration={0.5} delay={0.2}>
            <ListingCard
              image="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
              title="Ferrari 488 Spider"
              location="Monaco"
              price="$295,000"
              active
            />
          </AnimationWrapper>
          <AnimationWrapper type="zoom" duration={0.5} delay={0.25}>
            <ListingCard
              image="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800"
              title="Azimut Grande 27M"
              location="Monaco"
              price="$295,000"
            />
          </AnimationWrapper>
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon, count, label }: { icon: React.ReactNode, count: string, label: string }) {
  return (
    <div className="bg-foreground border border-primary/30 p-5 rounded-2xl flex items-center gap-5  transition-all  cursor-default shadow-card h-50.75"
      style={{
        boxShadow: "0 66px 19px 0 rgba(178, 114, 31, 0.00), 0 42px 17px 0 rgba(178, 114, 31, 0.01), 0 24px 14px 0 rgba(178, 114, 31, 0.05), 0 11px 11px 0 rgba(178, 114, 31, 0.09), 0 3px 6px 0 rgba(178, 114, 31, 0.10)"
      }}
    >
      <div className="w-13 h-13 bg-[#111113] rounded-xl flex items-center justify-center border border-[#3C3C3E]">
        {icon}
      </div>
      <div>
        <div className="text-[40px] font-medium font-clash leading-tight">{count}</div>
        <div className="text-[24px] text-[#FFFDFD] font-normal mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ListingCard({ image, title, location, price, active = false }: { image: string, title: string, location: string, price: string, active?: boolean }) {
  return (
    <div className="bg-foreground  rounded-[8px] border border-primary2/30 overflow-hidden group hover:border-[#E78F23]/20 transition-all shadow-xl hover:shadow-[#E78F23]/5"

    >
      <div className="relative h-54.25 overflow-hidden bg-black  ">
        <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" />

        {active && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">Active</div>
        )}
      </div>
      <div className="p-5 relative mt-6">
        <div className="flex justify-between items-center text-[11px] text-gray-400 mb-2 font-medium">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {location}</span>
          <span className="tracking-widest uppercase text-gray-500">Price</span>
        </div>
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-semibold font-inter text-[15px] truncate pr-3 text-white">{title}</h4>
          <span className="font-normal font-inter text-[17px] text-white">{price}</span>
        </div>

        <div className="space-y-2.5">
          <button className="w-full py-2.5 bg-foreground border border-primary  text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors  hover:text-white">
            <Eye className="w-4 h-4" />  View Details
          </button>

        </div>
      </div>
    </div>
  );
}

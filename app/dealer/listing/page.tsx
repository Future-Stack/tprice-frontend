"use client";
import React from 'react';
import AnimationWrapper from '@/app/components/AnimationWrapper';
import { Search, MapPin, Activity, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const listings = [
  {
    id: 1,
    title: '2024 Lamborghini Revuelto',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop',
    price: 400000,
    activeDeals: 2,
    location: 'New York',
    updatedAt: '2h ago',
    newOfferCategory: 'green',
    logoOnRight: true,
  },
  {
    id: 2,
    title: 'BMW 7 Series 2026',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop',
    price: 330000,
    activeDeals: 0,
    location: 'Monaco',
    updatedAt: '3h ago',
    newOfferCategory: 'light',
  },
  {
    id: 3,
    title: '2024 Lamborghini Revuelto',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2674&auto=format&fit=crop',
    price: 295000,
    activeDeals: 4,
    location: 'Monaco',
    updatedAt: '2h ago',
    newOfferCategory: 'green',
    logoOnRight: true,
  },
  {
    id: 4,
    title: 'Cessna Citation Mustang',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop',
    price: 995000,
    activeDeals: 6,
    location: 'Barcelona',
    updatedAt: '1h ago',
    newOfferCategory: 'light',
  },
  {
    id: 5,
    title: 'KATINA - MOTOR YACHT',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2674&auto=format&fit=crop',
    price: 695000,
    activeDeals: 3,
    location: 'Dubai',
    updatedAt: '2h ago',
    newOfferCategory: 'light',
    logoOnRight: true,
  },
  {
    id: 6,
    title: '2024 Lamborghini Revuelto',
   image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2670&auto=format&fit=crop',
    price: 295000,
    activeDeals: 2,
    location: 'Monaco',
    updatedAt: '2h ago',
    newOfferCategory: 'green',
    logoOnRight: true,
  },
  {
    id: 7,
    title: '2024 Lamborghini Revuelto',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2670&auto=format&fit=crop',
    price: 190000,
    activeDeals: 2,
    location: 'Monaco',
    updatedAt: '2h ago',
    newOfferCategory: 'green',
  },
  {
    id: 8,
    title: '2024 Lamborghini Revuelto',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2670&auto=format&fit=crop',
    price: 295000,
    activeDeals: 2,
    location: 'Monaco',
    updatedAt: '2h ago',
    newOfferCategory: 'green',
    logoOnRight: true,
  }
];

export default function ListingPage() {
  return (
    <AnimationWrapper>
      <div className="w-full text-white min-h-screen   font-sans bg-transparent">
        <div className=" w-full space-y-8">

          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-[28px] font-semibold text-gray-100">Assigned Listings</h1>
            <p className="text-gray-400 text-sm">Listings you are currently managing</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 py-2 border-[#1A1A1A]">
            <div className="relative w-full sm:max-w-110">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by listing name, brand, or keyword"
                className="w-full bg-transparent text-sm text-gray-200 border border-[#333] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-[#888]"
                autoComplete="off"
              />
            </div>
            <Link href="/dealer/add-listing" className="bg-[#EAB308] hover:bg-[#D9A506] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm">
              Add Listing
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#EAB308] text-black text-sm font-medium px-5 py-2 rounded-md">
              All
            </button>
            <button className="bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#B3B3B3] text-sm font-medium px-5 py-2 rounded-md transition-colors border border-[#333]">
              Active Deals
            </button>
            <button className="bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#B3B3B3] text-sm font-medium px-5 py-2 rounded-md transition-colors border border-[#333]">
              No Buyer Activity
            </button>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((item) => (
              <div key={item.id} className="bg-[#1C1C1C] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#444] transition-colors flex flex-col group">
                {/* Image Section */}
                <div className="relative aspect-16/11 w-full bg-[#111] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/80 to-transparent pointer-events-none"></div>

                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {item.newOfferCategory === 'green' && (
                      <div className="bg-[#123314]/90 text-[#4ADE80] text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium border border-[#1b4b1f]">
                        <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full shadow-[0_0_4px_#4ADE80]"></div>
                        New Offer
                      </div>
                    )}
                    {item.newOfferCategory === 'light' && (
                      <div className="bg-[#8AC29B]/20 text-[#8AC29B] text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium border border-[#8AC29B]/30 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-[#8AC29B] rounded-full shadow-[0_0_4px_#8AC29B]"></div>
                        New Offer
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative flex items-center justify-center">
                      {item.logoOnRight && (
                        <div className="absolute opacity-80 scale-[1.7] z-0">
                          <ShieldCheck className="w-5 h-5 text-[#D9A506]/30 fill-[#D9A506]/20" />
                        </div>
                      )}
                      <div className="bg-[#2A230F]/90 text-[#EAB308] text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium z-10 border border-[#EAB308]/20 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-[#EAB308] rounded-full shadow-[0_0_4px_#EAB308]"></div>
                        New Offer
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col flex-1 gap-4">
                  <h3 className="font-medium text-[16px] text-zinc-100 line-clamp-1">{item.title}</h3>

                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-zinc-500" />
                      {item.activeDeals > 0 ? (
                        <span className="text-[#4ADE80] font-medium">{item.activeDeals} active deals</span>
                      ) : (
                        <span className="text-zinc-400">No offers yet</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="truncate max-w-22.5">{item.location}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-2">
                    <div className="text-[#EAB308] font-semibold text-xl sm:text-[22px]">
                      ${item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pb-1">
                      <Clock className="w-3.5 h-3.5" />
                      updated {item.updatedAt}
                    </div>
                  </div>

                  <button className="w-full mt-2 border border-[#333] hover:border-[#EAB308] hover:bg-[#EAB308]/10 text-zinc-300 hover:text-white transition-all py-2.25 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                    {item.activeDeals > 0 ? 'Manage Deals' : 'View Details'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

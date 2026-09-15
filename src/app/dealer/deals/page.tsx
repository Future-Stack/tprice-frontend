"use client";

import React, { useState } from 'react';
import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const activeDealsData = [
  {
    id: 1,
    status: 'Active negotiation',
    carName: '2024 Lamborghini Revuelto',
    buyer: 'James Morrison',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    progress: 3, // 1: Inquery, 2: Offer, 3: Negotiation, 4: Closed
    price: '480,000$'
  },
  {
    id: 2,
    status: 'Offer Received',
    carName: 'Ferrari SF90 Stradale',
    buyer: 'Adam Smith',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    progress: 2,
    price: '510,000$'
  },
  {
    id: 3,
    status: 'Active negotiation',
    carName: '2024 Lamborghini Revuelto',
    buyer: 'James Morrison',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    progress: 3,
    price: '480,000$'
  },
  {
    id: 4,
    status: 'Deal Completed',
    carName: 'Ferrari SF90 Stradale',
    buyer: 'Adam Smith',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    progress: 4,
    price: '480,000$'
  }
];

const closedDealsData = [
  {
    id: 1,
    carName: 'Mercedes-AMG One',
    buyer: 'Alex Turner',
    finalPrice: '2,500,000',
    closedDate: 'March 25, 2026'
  },
  {
    id: 2,
    carName: 'Mc Laren P1',
    buyer: 'Chris Evans',
    finalPrice: '1,500,000',
    closedDate: 'February 25, 2026'
  },
  {
    id: 3,
    carName: 'Ferrari SF90 Stradale',
    buyer: 'Adam Smith',
    finalPrice: '2,500,000',
    closedDate: 'March 30, 2026'
  }
];

const steps = ['Inquery', 'Offer', 'Negotiation', 'Closed'];

export default function Deals() {
  return (
    <div className="flex flex-col gap-10">
      {/* Active Deals Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Active Deals</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeDealsData.map((deal) => (
            <div key={deal.id} className="bg-[#24252A] rounded-xl p-5 flex flex-col gap-6 border border-white/5 shadow-md">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded w-max mb-2 ${deal.status === 'Active negotiation' ? 'bg-[#002C14] text-[#00A34A]' :
                    deal.status === 'Offer Received' ? 'bg-[#002540] text-[#007AE6]' :
                      'bg-[#303136] text-gray-400'
                    }`}>
                    {deal.status}
                  </div>
                  <h3 className="text-xl font-semibold tracking-wide">{deal.carName}</h3>
                  <p className="text-sm text-gray-400 mt-1">Buyer : {deal.buyer}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deal.image} alt={deal.carName} className="w-32 h-20 object-cover rounded-lg shadow-sm" />
              </div>

              {/* Progress Stepper */}
              <div className="px-2 mt-2">
                <div className="relative flex justify-between mt-4 z-0 pb-8">
                  {/* Connecting Line Background */}
                  <div className="absolute top-2.75 left-2.75 right-2.75 h-0.75 bg-[#3a3b40] -z-10 rounded-full"></div>
                  {/* Connecting Line Active */}
                  <div className="absolute top-2.75 left-2.75 h-0.75 bg-[#d3a436] -z-10 transition-all duration-300 rounded-full"
                    style={{ width: `calc(${((deal.progress - 1) / (steps.length - 1)) * 100}% - ${((deal.progress - 1) / (steps.length - 1)) * 22}px)` }}></div>

                  {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber <= deal.progress;
                    return (
                      <div key={index} className="flex flex-col items-center relative z-10 w-12">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${isCompleted ? 'bg-[#d3a436]' : 'bg-[#4c4d52]'}`}>
                          <Check className={`w-4 h-4 ${isCompleted ? 'text-[#24252A]' : 'text-[#24252A]/50'}`} strokeWidth={3.5} />
                        </div>
                        <span className="text-[11px] text-gray-400 mt-3 absolute top-5.5 whitespace-nowrap font-medium tracking-wide">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-5">
                <span className="text-3xl font-bold">{deal.price}</span>
                <Link href={`/dealer/deals/${deal.id}`} className="flex items-center gap-2 bg-[#d3a436] hover:bg-[#c29631] text-[#24252A] px-5 py-2.5 rounded-md text-sm font-bold transition-colors">
                  View Details <ArrowRight className="w-4 h-4 text-[#24252A]" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closed Deals Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Closed Deals</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Sort by</span>
            <button className="flex items-center gap-1 border border-white/20 bg-[#24252A] px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">
              Recent <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {closedDealsData.map((deal) => (
            <div key={deal.id} className="bg-[#24252A] rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0 border border-white/5 shadow-md">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold tracking-wide">{deal.carName} - {deal.buyer}</h3>
                <p className="text-sm font-medium mt-1">
                  <span className="text-gray-400">Final Price : </span>
                  <span className="text-[#d3a436]">${deal.finalPrice}</span>
                </p>
              </div>
              <div className="flex items-center justify-between md:justify-end md:gap-12 w-full md:w-auto">
                <p className="text-sm text-gray-400 font-medium">Closed Date : {deal.closedDate}</p>
                <button className="border border-white/20 hover:bg-white/10 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors ml-4 md:ml-0">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

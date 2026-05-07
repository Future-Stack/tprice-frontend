"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Gavel, ShieldCheck, Crown, ArrowRight } from "lucide-react";

const STEPS = [
  {
    title: "Browse Listings",
    desc: "Explore our curated collection of supercars, estates, jets, and yachts. Filter by category, price, and exclusivity tier.",
    icon: Search
  },
  {
    title: "Submit Offer / Make Bid",
    desc: "Place a private offer or participate in our exclusive auction system. All bids are confidential and handled with discretion.",
    icon: Gavel
  },
  {
    title: "Verification & Paperwork",
    desc: "Our dedicated team of experts handles all due diligence, asset verification, and legal documentation on your behalf.",
    icon: ShieldCheck
  },
  {
    title: "Complete Luxury Purchase",
    desc: "Finalize your acquisition with white-glove concierge support. Delivery, logistics, and aftercare — all arranged for you.",
    icon: Crown
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#050505] px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
          >
            SIMPLE & SEAMLESS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-serif"
          >
            How It Works
          </motion.h2>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center flex flex-col items-center group"
              >
                {/* Connecting Arrow (Desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-16 left-[calc(50%+68px)] w-[calc(100%-136px)] items-center z-0">
                    <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-primary/40 to-primary relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-primary rotate-45" />
                    </div>
                  </div>
                )}

                {/* Circle Container */}
                <div className="relative mb-10">
                  {/* Dashed Border */}
                  <div className="absolute inset-[-10px] rounded-full border border-dashed border-primary/20 group-hover:border-primary/40 transition-colors duration-500" />

                  {/* Icon Circle with Gradient */}
                  <div className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#2A241A] to-[#0A0A0A] opacity-90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
                    <step.icon className="w-8 h-8 text-primary relative z-10 stroke-[1.2]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif text-white mb-4 transition-colors group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-white/40 text-[13px] leading-relaxed font-light max-w-[240px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


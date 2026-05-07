"use client";

import React from "react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Assets", value: "$2.4 B+" },
  { label: "VIP Members", value: "1500+" },
  { label: "Client Satisfaction", value: "97%" },
];

export default function AboutHero() {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing/hero-yacht.png"
          className="w-full h-full object-cover"
          alt="Luxury Yacht"
        />
        {/* Aggressive Dark Overlay as seen in Image 2 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/20 z-[1]" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pb-24">
        <div className="max-w-4xl space-y-6">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary text-sm md:text-base font-bold tracking-[0.3em] uppercase"
          >
            OUR STORY
          </motion.h4>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight"
          >
            The Ultimate Luxury Ecosystem
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed"
          >
            ExoticWorld Was Born From A Simple Belief: The World&apos;s Most Extraordinary Assets Deserve An Extraordinary Platform. We Built The Ecosystem That Ultra-High-Net-Worth Individuals Have Always Deserved.
          </motion.p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 w-full bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              className="py-8 md:py-12 text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

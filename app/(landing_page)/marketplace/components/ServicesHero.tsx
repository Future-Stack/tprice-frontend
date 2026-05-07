"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ServicesHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/services/hero.png"
          alt="Services Hero"
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/20 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-[2]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl space-y-6">
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-bold tracking-[0.4em] uppercase"
          >
            EXPLORE THE MARKETPLACE
          </motion.h4>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-tight whitespace-nowrap"
          >
            Luxury Marketplace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed"
          >
            Discover A Curated Collection Of Ultra-Premium Assets And Connect With Verified Dealers, Private Sellers, And Elite Collectors Across The Global Luxury Ecosystem.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

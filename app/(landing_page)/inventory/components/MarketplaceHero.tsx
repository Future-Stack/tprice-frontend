"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MarketplaceHero() {
  return (
    <section className="relative w-full overflow-hidden     px-6 pt-40 pb-31">
      <div className="container mx-auto">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/landing/hero-yacht.png"
            alt="Marketplace Hero"
            className="w-full h-full object-cover  "
          />
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-black/60 z-1" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-2" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl   space-y-6">
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-[24px] font-normal font-montserrat"
          >
            EXCLUSIVE LISTINGS
          </motion.h4>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-[56px] font-cormorant font-normal text-white"
          >
            The Inventory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#E0E0E0] text-sm md:text-[24px] max-w-330     font-normal font-montserrat"
          >
            Browse Our Curated Collection Of Ultra-Premium Assets — From Hyper
            Cars And Super Yachts To Private Jets And Trophy Real Estate. Each
            Listing Is Carefully Selected To Meet The Highest Standards Of
            Quality, Exclusivity, And Performance.
          </motion.p>
        </div>

        {/* Bottom fade to content */}
        {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent z-3" /> */}
      </div>
    </section>
  );
}

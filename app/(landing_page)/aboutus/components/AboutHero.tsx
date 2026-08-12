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
    <>
      <section className="relative min-h-125 w-full overflow-hidden flex flex-col justify-center pt-35">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/landing/hero-yacht.png"
            className="w-full h-auto object-cover"
            alt="Luxury Yacht"
          />
          {/* Aggressive Dark Overlay as seen in Image 2 */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent z-1" />
          <div className="absolute inset-0 bg-black/20 z-1" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 container mx-auto px-6 md:px-0 pb-24">
          <div className="  space-y-6">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-primary text-sm md:text-[24px] font-montserrat font-normal uppercase"
            >
              OUR STORY
            </motion.h4>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-[56px] font-cormorant font-normal text-white "
            >
              The Ultimate Luxury Ecosystem
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/80 text-lg md:text-[24px]   font-montserrat"
            >
              ExoticWorld was born from a simple belief: the world&apos;s most
              extraordinary assets deserve an extraordinary platform. We built
              the ecosystem that ultra-high-net-worth individuals have always
              deserved.
            </motion.p>
          </div>
        </div>

        {/* Stats Bar */}
      </section>
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
    </>
  );
}

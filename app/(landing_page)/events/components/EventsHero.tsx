"use client";

import React from "react";
import { motion } from "framer-motion";

export default function EventsHero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing/hero-jet.png"
          className="w-full h-full object-cover"
          alt="Luxury Events"
        />
        {/* Cinema-grade Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/20 z-[1]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-20">
        <div className="max-w-4xl space-y-6">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary text-sm md:text-base font-bold tracking-[0.4em] uppercase"
          >
            LUXURY EVENTS
          </motion.h4>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white leading-tight"
          >
            Extraordinary <br />
            <span className="italic">Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed"
          >
            From Exclusive Yacht Parties In Monaco To Private Aviation Summits—Our Events Are Curated To Connect The World&apos;s Most Discerning Individuals In Unparalleled Settings.
          </motion.p>
        </div>
      </div>
      
      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
    </section>
  );
}

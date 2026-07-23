"use client";

import { motion } from "framer-motion";

export default function EventsHero() {
  return (
    <section className="relative h-screen min-h-150 w-full overflow-hidden flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing/hero-jet.png"
          className="w-full h-full object-cover"
          alt="Luxury Events"
        />
        {/* Cinema-grade Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent z-1" />
        <div className="absolute inset-0 bg-black/20 z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-20">
        <div className="max-w-4xl space-y-6">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary font-montserrat text-sm md:text-[24px] font-normal   uppercase"
          >
            Exclusive Gatherings
          </motion.h4>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl   lg:text-[56px] font-serif text-white leading-tight"
          >
            Events & Media
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/70 text-lg md:text-[24px] max-w-3xl leading-relaxed"
          >
            From intimate VIP gatherings to world-class automotive concours,
            ExoticWorld curates the most exclusive events in the luxury asset
            world. Each experience is thoughtfully designed to bring together
            collectors,
          </motion.p>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent z-10" />
    </section>
  );
}

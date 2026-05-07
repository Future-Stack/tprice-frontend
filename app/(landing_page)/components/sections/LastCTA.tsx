"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LastCTA() {
  return (
    <section className="relative h-[600px] w-full overflow-hidden flex flex-col justify-center items-center text-center px-6 mt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/footer.mp4" type="video/mp4" />
        </video>
        {/* Aggressive Dark Gradient for Premium Feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-[1]" />
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight italic"
        >
          Ready to Experience the <br /> 
          <span className="text-primary italic">Ultimate Luxury?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Join our exclusive circle of elite collectors and investors. The most coveted assets in the world are waiting for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="pt-6"
        >
          <Link href="/register" className="cursor-pointer px-12 py-4 bg-primary text-black font-black text-lg uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.4)]">
            Register Now
          </Link>
        </motion.div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LastCTA() {
  return (
    <section className="relative h-225 w-full overflow-hidden flex flex-col justify-end pb-32 items-center text-center px-6 mt-20">
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
        {/* <div className="absolute inset-0 bg-linear-to-b from-black via-black/40 to-black z-1" />
        <div className="absolute inset-0 bg-black/40 z-1" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-[56px] font-medium font-cormorant text-white mb-6"
        >
          List Your Luxury Asset
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl font-montserrat  mx-auto mb-10"
        >
          Join our exclusive network of private and VIP sellers
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="pt-6"
        >
          <Link
            href="/register"
            className="cursor-pointer px-12 py-4 bg-primary text-black font-montserrat font-medium  text-[16px]  hover:bg-white hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.4)] inline-flex items-center gap-1 "
          >
            Become a Seller
            <ArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
    </section>
  );
}

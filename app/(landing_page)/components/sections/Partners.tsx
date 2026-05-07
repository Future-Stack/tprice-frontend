"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PARTNERS = [
  { name: "FERRARI", logo: "/images/landing/brand/ferrari.png" },
  { name: "LAMBORGHINI", logo: "/images/landing/brand/lamborghini.png" },
  { name: "MCLAREN", logo: "/images/landing/brand/mclaren.jpg" },
  { name: "MERCEDES", logo: "/images/landing/brand/mercedes.png" },
  { name: "BENTLEY", logo: "/images/landing/brand/bentley.png" },
  { name: "ROLLS ROYCE", logo: "/images/landing/brand/rolls-royce.webp" },
];

export default function Partners() {
  return (
    <section className="py-24 bg-black border-t border-white/5 px-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-6 mb-16 overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1" />
          <motion.h4
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-md font-bold tracking-[0.4em] uppercase whitespace-nowrap"
          >
            Our Branding Partners
          </motion.h4>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1" />
        </div>

        {/* Animated Infinite Scroll or Responsive Grid */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="flex flex-col items-center gap-4 group cursor-default"
            >
              <Image src={partner.logo} alt={partner.name} width={100} height={100} />
              <span className="text-white text-xs font-bold tracking-[0.2em] group-hover:text-primary transition-colors">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

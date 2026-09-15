"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PARTNERS = [
  { name: "Ferrari", logo: "/brand/2.svg", width: 44, height: 51 },
  { name: "lamborghini", logo: "/brand/3.svg", width: 44, height: 56 },
  { name: "McLaren", logo: "/brand/4.svg", width: 108, height: 15 },
  { name: "Ferrari", logo: "/brand/2.svg", width: 44, height: 51 },
  { name: "Mercedes", logo: "/brand/1.svg", width: 40, height: 40 },
  { name: "Mercedes", logo: "/brand/1.svg", width: 40, height: 40 },
  { name: "Ferrari", logo: "/brand/2.svg", width: 44, height: 51 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
} as const;

export default function Partners() {
  return (
    <section className="py-20 bg-black border-t border-white/5 px-6">
      <div className="container mx-auto">
        <div className="flex items-center   gap-6 mb-20 overflow-hidden">
          <div className="h-[0.5px] bg-[#CEA630] w-25" />
          <motion.h4
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#A0A0A0] text-xs font-normal md:text-[20px] font-inter"
          >
            Our Branding Partners
          </motion.h4>
          <div className="h-[0.5px]  bg-[#CEA630] flex-1" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-between items-center gap-x-12 md:gap-x-16 lg:gap-x-20 gap-y-12 max-w-full px-4"
        >
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <span className="text-white text-[20px] font-clash font-medium   group-hover:text-primary transition-colors duration-300">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

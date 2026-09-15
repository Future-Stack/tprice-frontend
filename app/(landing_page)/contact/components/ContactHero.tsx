"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative   min-h-125 w-full overflow-hidden flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing/contact-hero.png"
          className="w-full h-full object-cover"
          alt="Contact Us"
        />
        {/* Premium Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent z-1" />
        <div className="absolute inset-0 bg-black/30 z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-0 pt-20">
        <div className="space-y-6">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary text-sm md:text-[24px] font-normal"
          >
            GET IN TOUCH
          </motion.h4>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-[56px] font-cormorant text-white leading-tight"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[24px] text-[#E0E0E0] font-normal font-montserrat"
          >
            Whether You&apos;re Looking To Acquire, Sell, Or Simply Learn More —
            Our Team Is Ready To Assist You With The Highest Level Of Discretion
            And Care. From Personalized Guidance To Seamless Transaction
            Support,
          </motion.p>
        </div>
      </div>
    </section>
  );
}

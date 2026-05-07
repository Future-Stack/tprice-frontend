"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDE_ASSETS = [
  { type: "image", src: "/images/landing/hero-car.png" },
  { type: "image", src: "/images/landing/hero-villa.png" },
  { type: "image", src: "/images/landing/hero-jet.png" },
];

export default function MissionVision() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDE_ASSETS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-black px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Mission & Vision */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-white">Our Mission</h2>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-[#1A1A1A]/80 border-l-4 border-primary rounded-sm shadow-xl"
            >
              <p className="text-white/70 text-lg leading-relaxed italic">
                &quot;To preserve the art of the rare by providing a platform where provenance, authenticity, and unparalleled service are the standard for every transaction.&quot;
              </p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-white">Our Vision</h2>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-[#1A1A1A]/80 border-l-4 border-primary rounded-sm shadow-xl"
            >
              <p className="text-white/70 text-lg leading-relaxed">
                We aim to become the global digital authority for luxury assets, redefining how high-value items are discovered, authenticated, and exchanged across borders and cultures.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Image Slider */}
        <div className="relative h-[500px] md:h-[600px] w-full group">
          <div className="absolute inset-0 flex gap-4">
            {/* We show two images side by side as seen in the mockup, but they cycle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1 }}
                className="w-1/2 h-full rounded-lg overflow-hidden border border-white/5"
              >
                <img
                  src={SLIDE_ASSETS[currentIndex].src}
                  className="w-full h-full object-cover"
                  alt="Luxury Asset 1"
                />
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={(currentIndex + 1) % SLIDE_ASSETS.length}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-1/2 h-full rounded-lg overflow-hidden border border-white/5 mt-12"
              >
                <img
                  src={SLIDE_ASSETS[(currentIndex + 1) % SLIDE_ASSETS.length].src}
                  className="w-full h-full object-cover"
                  alt="Luxury Asset 2"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            {SLIDE_ASSETS.map((_, i) => (
              <div
                key={i}
                className={`h-1 transition-all duration-500 rounded-full ${
                  currentIndex === i ? "w-8 bg-primary" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

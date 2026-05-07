"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_ASSETS = [
  { type: "video", src: "/video/hero.mp4" },
  { type: "image", src: "/images/landing/hero-car.png" },
  { type: "image", src: "/images/landing/hero-yacht.png" },
  { type: "image", src: "/images/landing/hero-jet.png" },
  { type: "image", src: "/images/landing/hero-villa.png" },
];

const STATS = [
  { label: "Assets", value: "$2.4 B+" },
  { label: "VIP Members", value: "1500+" },
  { label: "Client Satisfaction", value: "97%" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAsset = HERO_ASSETS[currentIndex];

  const nextAsset = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_ASSETS.length);
  };

  useEffect(() => {
    // Only set a timer if the current asset is an image
    if (currentAsset.type === "image") {
      const timer = setTimeout(() => {
        nextAsset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentAsset]);

  return (
    <section className="relative h-screen min-h-175 w-full overflow-hidden flex flex-col justify-center items-center text-center px-6">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {currentAsset.type === "video" ? (
              <video
                autoPlay
                muted
                playsInline
                onEnded={nextAsset}
                className="w-full h-full object-cover"
              >
                <source src={currentAsset.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentAsset.src}
                className="w-full h-full object-cover"
                alt="Luxury Asset"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-black/70 via-black/40 to-black z-2" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto   pt-20">
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-3xl md:text-[80px] font-normal font-cormorant  "
        >
          Experience the Ultimate
        </motion.h4>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-medium italic font-cormorant text-land leading-tight"
        >
          Luxury  Marketplace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl font-mont mx-auto"
        >
          Cars, Yachts, Jets, Real Estate - All in one Ecosystem
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
        >
          <button className="px-10 py-4 border border-land rounded-sm cursor-pointer text-white text-sm font-semibold tracking-wide hover:bg-primary hover:text-black transition-all duration-300 font-montserrat">
            Explore Listings
          </button>
          <button className="px-10 font-montserrat py-4 bg-land text-black rounded-sm cursor-pointer text-sm font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300  ">
            Become a VIP Buyer
          </button>
        </motion.div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 pt-10">
          {HERO_ASSETS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${currentIndex === i ? "w-8 bg-primary" : "w-4 bg-white/20"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 w-full z-10 border-t border-white/10 hidden md:block"

        style={{
          background: "rgba(217, 217, 217, 0.10)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="container mx-auto px-12 grid grid-cols-3 divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              className="py-10 text-center"
            >
              <h3 className="text-3xl lg:text-[32px] font-semibold text-land font-montserrat mb-2">
                {stat.value}
              </h3>
              <p className="text-white/50 text-[20px] font-medium font-montserrat uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

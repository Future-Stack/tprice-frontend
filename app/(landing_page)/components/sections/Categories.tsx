"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Anchor, Plane, Home } from "lucide-react";

const CATEGORIES = [
  {
    title: "Automotive",
    count: "300+ Listings",
    image: "/images/landing/hero-car.png",
    icon: Car,
  },
  {
    title: "Yachts",
    count: "524+ Listings",
    image: "/images/landing/hero-yacht.png",
    icon: Anchor,
  },
  {
    title: "Aviation",
    count: "150+ Listings",
    image: "/images/landing/hero-jet.png",
    icon: Plane,
  },
  {
    title: "Real Estate",
    count: "280+ Listings",
    image: "/images/landing/hero-villa.png",
    icon: Home,
  },
];

export default function Categories() {
  return (
    <section className="py-32 bg-black px-6">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[16px] font-montserrat font-normal text-land  tracking-widest uppercase mb-4"
          >
            Browse by Category
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-cormorant font-normal"
          >
            Curated Collections
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative h-112.5 overflow-hidden rounded-xl cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent group-hover:via-black/40 transition-all duration-300" />

              {/* Icon / Top Badge */}
              <div className="absolute top-6 left-6 w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white bg-white/5">
                <cat.icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-[20px] font-normal font-cormorant text-white mb-2">{cat.title}</h3>
                <p className="text-white/60 text-sm font-montserrat">{cat.count}</p>
              </div>

              {/* Hover Border Glow */}
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-xl transition-all duration-300 shadow-[inset_0_0_20px_rgba(212,175,55,0)] group-hover:shadow-[inset_0_0_40px_rgba(212,175,55,0.1)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star, Crown } from "lucide-react";

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  text: string;
  assets: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Alexander Petrov",
    role: "Private Collector, Moscow",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "ExoticWorld is unlike anything I've encountered. The off-market access alone is worth the membership. I acquired a Bugatti Chiron and a Monaco penthouse through a single relationship manager. Truly exceptional.",
    assets: "BUGATTI CHIRON • MONACO PENTHOUSE"
  },
  {
    id: 2,
    name: "Elena Vance",
    role: "Yacht Enthusiast, Monaco",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "The verification process for high-value properties and yachts is unparalleled. I felt completely secure during my first cross-border transaction. Highly recommended for any serious investor.",
    assets: "AZIMUT GRANDE 35M • AMALFI VILLA"
  },
  {
    id: 3,
    name: "Julian Thorne",
    role: "Aviation Investor, London",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "Finding off-market jets used to take months. With ExoticWorld's global network, I had three exclusive options presented to me within 48 hours. The speed and professionalism are truly elite.",
    assets: "GULFSTREAM G650ER • ASPEN LODGE"
  },
  {
    id: 4,
    name: "Alexander Petrov",
    role: "Private Collector, Moscow",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "ExoticWorld is unlike anything I've encountered. The off-market access alone is worth the membership. I acquired a Bugatti Chiron and a Monaco penthouse through a single relationship manager. Truly exceptional.",
    assets: "BUGATTI CHIRON • MONACO PENTHOUSE"
  },
  {
    id: 5,
    name: "Elena Vance",
    role: "Yacht Enthusiast, Monaco",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "The verification process for high-value properties and yachts is unparalleled. I felt completely secure during my first cross-border transaction. Highly recommended for any serious investor.",
    assets: "AZIMUT GRANDE 35M • AMALFI VILLA"
  },
  {
    id: 6,
    name: "Julian Thorne",
    role: "Aviation Investor, London",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    text: "Finding off-market jets used to take months. With ExoticWorld's global network, I had three exclusive options presented to me within 48 hours. The speed and professionalism are truly elite.",
    assets: "GULFSTREAM G650ER • ASPEN LODGE"
  },
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <section className="py-24 bg-[#050505] px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
          >
            CLIENT VOICES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-serif"
          >
            VIP Member Reviews
          </motion.h2>
        </div>

        <div className="max-w-7xl mx-auto relative group">
          {/* Review Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1A1A1A] rounded-2xl p-8 md:p-16 relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center relative z-10 px-12 md:px-24">
              <Quote className="w-16 h-16 text-primary/30 mb-8" strokeWidth={1} />
              
              <div className="flex gap-1 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-xl md:text-2xl text-white/80 font-serif leading-relaxed mb-12 max-w-2xl">
                    “{REVIEWS[activeIndex].text}”
                  </p>

                  <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full py-1.5 px-6 mb-10 bg-primary/5">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-[10px] md:text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                      {REVIEWS[activeIndex].assets}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <img 
                      src={REVIEWS[activeIndex].avatar} 
                      alt={REVIEWS[activeIndex].name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 mb-4"
                    />
                    <h4 className="text-xl font-serif text-white mb-1">
                      {REVIEWS[activeIndex].name}
                    </h4>
                    <p className="text-white/40 text-xs tracking-wider">
                      {REVIEWS[activeIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows (Inside the Card) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-6 lg:left-8 z-20">
                 <button onClick={prev} className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ArrowLeft className="w-5 h-5" />
                 </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-6 lg:right-8 z-20">
                  <button onClick={next} className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                      <ArrowRight className="w-5 h-5" />
                  </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Avatar Selectors */}
          <div className="flex justify-center items-center gap-4 mt-12 pb-12">
            {REVIEWS.map((review, i) => (
              <button
                key={review.id}
                onClick={() => setActiveIndex(i)}
                className={`relative group transition-all duration-300 ${
                  activeIndex === i ? "scale-115" : "scale-90 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-100"
                }`}
              >
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className={`w-10 h-10 rounded-full object-cover ${
                    activeIndex === i ? "border-2 border-primary" : "border border-white/10"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


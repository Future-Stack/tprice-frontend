"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";

interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
}

const EVENTS: Event[] = [
  {
    id: 1,
    title: "EBACE Private Aviation Summit",
    category: "Aviation",
    date: "3rd April, 2026, 9pm",
    location: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    image: "/images/landing/hero-jet.png",
  },
  {
    id: 2,
    title: "Monaco Yacht Show Exclusive",
    category: "Yachts",
    date: "12th May, 2026, 7pm",
    location: "Port Hercules, Monaco",
    image: "/images/landing/hero-yacht.png",
  },
  {
    id: 3,
    title: "Pebble Beach Concours d'Elegance",
    category: "Automotive",
    date: "16th August, 2026, 10am",
    location: "Pebble Beach, CA",
    image: "/images/landing/hero-car.png",
  },
];

export default function Events() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
  };

  const event = EVENTS[currentIndex];

  return (
    <section className="py-32 bg-black px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4"
            >
              Exclusive Gatherings
            </motion.h4>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white text-4xl md:text-5xl font-serif"
            >
              Events & Brand Credibility
            </motion.h2>
          </div>
          <button className="cursor-pointer px-6 py-2 border border-white/20 rounded-sm text-white text-sm hover:bg-white hover:text-black transition-all">
            View All
          </button>
        </div>

        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-default"
            >
              {/* Background Image */}
              <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content Box */}
              <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-md text-primary text-xs font-bold uppercase tracking-widest">
                    {event.category}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-6 text-white/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </div>
                  </div>
                </div>

                <button className="cursor-pointer px-8 py-4 border border-primary rounded-sm text-white font-bold text-sm tracking-widest hover:bg-primary hover:text-black transition-all whitespace-nowrap">
                  Apply for Invitation
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between pointer-events-none">
            <button
              onClick={prevSlide}
              className="cursor-pointer w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all pointer-events-auto shadow-2xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="cursor-pointer w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all pointer-events-auto shadow-2xl"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

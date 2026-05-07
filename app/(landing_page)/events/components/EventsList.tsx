"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EVENTS_DATA } from "../../constants/events";

const CATEGORIES = ["ALL", "Automotive", "Yacht", "Aviation", "Real Estate"];

import { Calendar, MapPin, ArrowUpRight } from "lucide-react";

export default function EventsList() {
  const [activeTab, setActiveTab] = useState("ALL");

  const filteredEvents = activeTab === "ALL" 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(e => e.category === activeTab);

  return (
    <section className="py-24 bg-black px-6 md:px-12">
      <div className="container mx-auto">
        <h2 className="text-4xl font-serif text-white mb-12">Events</h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full border text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeTab === cat
                  ? "border-primary bg-primary text-black"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, i) => (
              <Link key={event.id} href={`/events/${event.slug}`}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 h-full flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={event.title}
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-[#4ADE80]/20 backdrop-blur-md border border-[#4ADE80]/30 text-[#4ADE80] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                          {event.category}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                          {event.title}
                        </h3>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black group-hover:bg-white group-hover:scale-110 transition-all shadow-lg mt-2">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-4 mt-auto">
                      <div className="flex items-center gap-2 text-white/40 text-[11px] font-medium tracking-wide">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[11px] font-medium tracking-wide italic">
                        <MapPin className="w-4 h-4 text-primary/60" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

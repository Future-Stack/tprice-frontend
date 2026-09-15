"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useGetEventsQuery } from "@/hooks/useEvents";
import { EventItem } from "@/lib/api/events";

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const EventsSkeleton = () => (
  <div className="relative aspect-video md:aspect-21/9 w-full rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse p-10 flex flex-col justify-end">
    <div className="space-y-4 max-w-2xl">
      <div className="w-24 h-6 bg-white/10 rounded-full" />
      <div className="w-3/4 h-10 bg-white/10 rounded-md" />
      <div className="flex gap-6 pt-2">
        <div className="w-32 h-5 bg-white/10 rounded-md" />
        <div className="w-40 h-5 bg-white/10 rounded-md" />
      </div>
    </div>
  </div>
);

export default function Events() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError, error, refetch } = useGetEventsQuery({
    page: 1,
    limit: 10,
  });

  const events: EventItem[] = data?.data || [];

  // Safeguard index in case events length changes
  const safeIndex =
    events.length > 0 ? Math.min(currentIndex, events.length - 1) : 0;
  const currentEvent = events[safeIndex];

  const nextSlide = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
  };

  const prevSlide = () => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  return (
    <section className="pb-32 bg-black px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-[16px] font-montserrat font-normal uppercase mb-4"
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
          <Link
            href="/events"
            className="cursor-pointer px-6 py-2 border border-white/20 rounded-sm text-white text-sm hover:bg-white hover:text-black transition-all inline-block"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <EventsSkeleton />
        ) : isError ? (
          <div className="py-16 text-center bg-[#0A0A0A] rounded-2xl border border-red-500/20 max-w-xl mx-auto space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-xl text-white font-medium">
              Failed to load events
            </h3>
            <p className="text-white/60 text-sm">
              {(error as any)?.response?.data?.message ||
                (error as Error)?.message ||
                "Something went wrong while fetching events."}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center bg-[#0A0A0A] rounded-2xl border border-white/5 max-w-xl mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="text-xl text-white font-medium">No events found</h3>
            <p className="text-white/40 text-sm">
              There are currently no exclusive events scheduled.
            </p>
          </div>
        ) : (
          <div className="relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-default"
              >
                {/* Background Image */}
                <img
                  src={
                    currentEvent.coverImageUrl || "/images/landing/hero-car.png"
                  }
                  alt={currentEvent.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/landing/hero-car.png";
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content Box */}
                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-md text-primary text-xs font-bold uppercase tracking-widest">
                      {currentEvent.category}
                    </div>
                    <Link href={`/events/${currentEvent.id}`} className="block">
                      <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight hover:text-primary transition-colors cursor-pointer">
                        {currentEvent.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-6 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {formatDate(currentEvent.eventDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {currentEvent.location}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/events/${currentEvent.id}`}
                    className="cursor-pointer px-8 py-4 border border-primary rounded-sm text-white font-bold text-sm tracking-widest hover:bg-primary hover:text-black transition-all whitespace-nowrap inline-block"
                  >
                    Apply for Invitation
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {events.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex justify-between pointer-events-none">
                <button
                  onClick={prevSlide}
                  className="cursor-pointer w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all pointer-events-auto shadow-2xl"
                  aria-label="Previous event"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="cursor-pointer w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all pointer-events-auto shadow-2xl"
                  aria-label="Next event"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

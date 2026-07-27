"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetEventsQuery } from "@/hooks/useEvents";
import { EventItem } from "@/lib/api/events";

const CATEGORIES = [
  { label: "ALL", value: "ALL" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Yacht", value: "YACHT" },
  { label: "Aviation", value: "AVIATION" },
  { label: "Real Estate", value: "REAL_ESTATE" },
];

const formatDate = (dateString: string) => {
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 h-full flex flex-col animate-pulse"
      >
        <div className="relative aspect-16/10 bg-white/5" />
        <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="w-24 h-6 bg-white/10 rounded-full" />
              <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
            </div>
            <div className="w-3/4 h-8 bg-white/10 rounded-md" />
            <div className="w-full h-4 bg-white/5 rounded-md" />
            <div className="w-2/3 h-4 bg-white/5 rounded-md" />
          </div>
          <div className="pt-6 border-t border-white/5 flex gap-8">
            <div className="w-28 h-4 bg-white/10 rounded" />
            <div className="w-36 h-4 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function EventsList() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetEventsQuery({
      page,
      limit,
      category: activeTab,
    });

  const events: EventItem[] = data?.data || [];
  const meta = data?.meta;

  const handleTabChange = (catValue: string) => {
    setActiveTab(catValue);
    setPage(1);
  };

  return (
    <section className="py-24 bg-black px-6 md:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl font-serif text-white">Events</h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleTabChange(cat.value)}
                className={`px-6 py-2 rounded-full border text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${activeTab === cat.value
                  ? "border-primary bg-primary text-black shadow-lg shadow-primary/20"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <EventsSkeleton />
        ) : isError ? (
          /* Error State */
          <div className="py-16 text-center bg-[#0A0A0A] rounded-xl border border-red-500/20 max-w-xl mx-auto space-y-4">
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
          /* Empty State */
          <div className="py-20 text-center bg-[#0A0A0A] rounded-xl border border-white/5 max-w-xl mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-white/20 mx-auto" />
            <h3 className="text-xl text-white font-medium">No events found</h3>
            <p className="text-white/40 text-sm">
              There are currently no events listed under this category.
            </p>
          </div>
        ) : (
          /* Events Grid */
          <div className="relative">
            {/* Background Fetching Indicator */}
            {isFetching && !isLoading && (
              <div className="absolute top-0 right-0 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-primary animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Updating...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 h-full flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative aspect-16/10 overflow-hidden bg-white/5">
                        <img
                          src={
                            event.coverImageUrl ||
                            "/images/landing/hero-car.png"
                          }
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={event.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/landing/hero-car.png";
                          }}
                        />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-1.5 bg-[#4ADE80]/20 backdrop-blur-md border border-[#4ADE80]/30 text-[#4ADE80] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                            {event.status || "UPCOMING"}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 space-y-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-4 flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                              {event.category}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                              {event.title}
                            </h3>
                          </div>

                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black group-hover:bg-white group-hover:scale-110 transition-all shadow-lg shrink-0 mt-2">
                            <ArrowUpRight className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-4 mt-auto">
                          <div className="flex items-center gap-2 text-[#E0E0E0] text-[16px] font-medium tracking-wide">
                            <Calendar className="w-4 h-4 text-primary/60" />
                            {formatDate(event.eventDate)}
                          </div>
                          <div className="flex items-center gap-2 text-[#E0E0E0] text-[16px] font-medium tracking-wide italic">
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

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full border border-white/10 text-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white/60 text-sm tracking-widest uppercase">
                  Page <span className="text-white font-bold">{meta.page}</span>{" "}
                  of{" "}
                  <span className="text-white font-bold">
                    {meta.totalPages}
                  </span>
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, meta.totalPages))
                  }
                  disabled={page === meta.totalPages}
                  className="p-3 rounded-full border border-white/10 text-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

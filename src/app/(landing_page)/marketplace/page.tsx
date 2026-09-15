"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ServicesHero from "./components/ServicesHero";
import ServicesSearchBar from "./components/ServicesSearchBar";
import ServicesSidebar from "./components/ServicesSidebar";
import ServiceCard from "./components/ServiceCard";
import { DEMO_SERVICES } from "./data";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter Logic
  const filteredServices = useMemo(() => {
    return DEMO_SERVICES.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || service.category === activeCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") {
          const expA = parseInt(a.experience) || 0;
          const expB = parseInt(b.experience) || 0;
          return expB - expA;
      }
      return b.id - a.id; // newest based on id for demo
    });
  }, [search, activeCategory, sortBy]);

  return (
    <div className="bg-black min-h-screen pb-32">
      <ServicesHero />

      <section className="mt-20">
        <div className="container mx-auto px-6 md:px-12 lg:flex gap-12 lg:gap-16">
          {/* Sidebar */}
          <ServicesSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            <ServicesSearchBar
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} item={service} />
                ))}
                {filteredServices.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-32 text-center"
                  >
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                         <div className="w-10 h-10 border-2 border-primary/20 rounded-full border-t-primary animate-spin" />
                    </div>
                    <p className="text-white/40 text-xl font-serif italic">
                      No matching experts found.
                    </p>
                    <button 
                        onClick={() => {setSearch(""); setActiveCategory("All");}}
                        className="mt-6 text-primary hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Anchor, Plane, Home, Watch, Sparkles } from "lucide-react";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { Category } from "@/lib/api/categories";

const DEFAULT_IMAGES = [
  "/images/landing/hero-car.png",
  "/images/landing/hero-yacht.png",
  "/images/landing/hero-jet.png",
  "/images/landing/hero-villa.png",
];

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "fb-1",
    name: "Automotive",
    description: "Exotic and luxury sports cars",
    imageUrl: "/images/landing/hero-car.png",
    iconName: "car",
    displayOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { brands: 0, listings: 300 },
  },
  {
    id: "fb-2",
    name: "Yachts",
    description: "Luxury motor yachts and superyachts",
    imageUrl: "/images/landing/hero-yacht.png",
    iconName: "boat",
    displayOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { brands: 0, listings: 524 },
  },
  {
    id: "fb-3",
    name: "Aviation",
    description: "Ultra long range executive aircraft",
    imageUrl: "/images/landing/hero-jet.png",
    iconName: "plane",
    displayOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { brands: 0, listings: 150 },
  },
  {
    id: "fb-4",
    name: "Real Estate",
    description: "Exclusive properties and villas",
    imageUrl: "/images/landing/hero-villa.png",
    iconName: "home",
    displayOrder: 4,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    _count: { brands: 0, listings: 280 },
  },
];

const getCategoryIcon = (iconName?: string | null, name?: string) => {
  const str = `${iconName || ""} ${name || ""}`.toLowerCase();
  if (str.includes("boat") || str.includes("yacht") || str.includes("anchor")) {
    return Anchor;
  }
  if (
    str.includes("plane") ||
    str.includes("jet") ||
    str.includes("aviation") ||
    str.includes("airplane")
  ) {
    return Plane;
  }
  if (
    str.includes("watch") ||
    str.includes("timepiece") ||
    str.includes("horology") ||
    str.includes("clock")
  ) {
    return Watch;
  }
  if (
    str.includes("home") ||
    str.includes("villa") ||
    str.includes("real") ||
    str.includes("estate") ||
    str.includes("property")
  ) {
    return Home;
  }
  if (
    str.includes("car") ||
    str.includes("auto") ||
    str.includes("vehicle") ||
    str.includes("runner") ||
    str.includes("sport")
  ) {
    return Car;
  }
  return Sparkles;
};

export default function Categories() {
  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery({
    limit: 4,
    isActive: true,
  });

  const apiCategories =
    categoriesResponse?.data && Array.isArray(categoriesResponse.data)
      ? categoriesResponse.data
      : [];

  const displayCategories =
    !isLoading && apiCategories.length === 0
      ? FALLBACK_CATEGORIES
      : apiCategories;

  // Limit to 4 items max
  const categoriesToShow = displayCategories.slice(0, 4);

  return (
    <section className="py-32 bg-black px-6">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[16px] font-montserrat font-normal text-land tracking-widest uppercase mb-4"
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
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="relative h-112.5 overflow-hidden rounded-xl bg-white/5 animate-pulse border border-white/10"
                >
                  {/* Icon Badge Skeleton */}
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10" />

                  {/* Content Skeleton */}
                  <div className="absolute bottom-8 left-8 right-8 space-y-3">
                    <div className="h-6 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                  </div>

                  {/* Shimmer gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ))
            : categoriesToShow.map((cat, i) => {
                const IconComponent = getCategoryIcon(cat.iconName, cat.name);
                const count = cat._count?.listings ?? 0;
                const countLabel = `${count}+ Listing${count === 1 ? "" : "s"}`;
                const imageSrc =
                  cat.imageUrl || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length];

                return (
                  <Link
                    key={cat.id || cat.name}
                    href={`/inventory?category=${encodeURIComponent(cat.slug || cat.name)}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group relative h-112.5 overflow-hidden rounded-xl cursor-pointer"
                    >
                      {/* Background Image */}
                      <img
                        src={imageSrc}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent group-hover:via-black/40 transition-all duration-300" />

                      {/* Icon / Top Badge */}
                      <div className="absolute top-6 left-6 w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white bg-white/5">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-[20px] font-normal font-cormorant text-white mb-2">
                          {cat.name}
                        </h3>
                        <p className="text-white/60 text-sm font-montserrat">
                          {countLabel}
                        </p>
                      </div>

                      {/* Hover Border Glow */}
                      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-xl transition-all duration-300 shadow-[inset_0_0_20px_rgba(212,175,55,0)] group-hover:shadow-[inset_0_0_40px_rgba(212,175,55,0.1)]" />
                    </motion.div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}

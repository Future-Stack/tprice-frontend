"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useListingsQuery } from "@/hooks/useListings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { ListingItem } from "@/lib/api/listings";

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery({ isActive: true });
  const categories = categoriesData?.data || [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch featured listings from API (isFeatured: true & optional category)
  const {
    data: listingsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useListingsQuery({
    isFeatured: true,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    limit: 5,
  });

  const featuredListings = listingsData?.data || [];
  const mainProduct = featuredListings[0];
  const sideProducts = featuredListings.slice(1, 5);

  const getProductImage = (item: ListingItem) => {
    return (
      item.media?.[0]?.url ||
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"
    );
  };

  const getFormattedPrice = (item: ListingItem) => {
    if (item.askingPrice) {
      return `$${Number(item.askingPrice).toLocaleString()}`;
    }
    if (item.startingBid) {
      return `Bid: $${Number(item.startingBid).toLocaleString()}`;
    }
    return "Price on Request";
  };

  const getLocationString = (item: ListingItem) => {
    return (
      [item.locationCity, item.locationCountry].filter(Boolean).join(", ") ||
      "Worldwide"
    );
  };

  const getBadgeTag = (item: ListingItem) => {
    if (item.owner?.role === "DEALER") return "Dealer";
    if (item.isFeatured) return "VIP";
    return "Private";
  };

  return (
    <section className="py-32 bg-[#050505] px-6">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4"
            >
              Exclusive Access
            </motion.h4>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white text-4xl md:text-5xl font-serif"
            >
              Featured Collections
            </motion.h2>
          </div>

          {/* Dynamic Category Dropdown */}
          <div className="relative w-full md:w-64" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer w-full bg-white/5 border border-white/10 px-6 py-4 rounded-lg flex items-center justify-between text-white hover:border-primary/50 transition-all text-sm font-medium"
            >
              <span className="truncate">
                {selectedCategory === "ALL"
                  ? "All Categories"
                  : selectedCategory}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/60 transition-transform ${
                  isDropdownOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-lg overflow-hidden z-30 shadow-2xl max-h-64 overflow-y-auto scrollbar-hide"
                >
                  <button
                    onClick={() => {
                      setSelectedCategory("ALL");
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left px-6 py-3.5 hover:bg-primary/10 transition-colors text-sm ${
                      selectedCategory === "ALL"
                        ? "text-primary font-bold"
                        : "text-white/70"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id || cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full text-left px-6 py-3.5 hover:bg-primary/10 transition-colors text-sm truncate ${
                        selectedCategory === cat.name
                          ? "text-primary font-bold"
                          : "text-white/70"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-[#1C1212] border border-red-500/30 rounded-xl p-8 mb-12 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-white mb-1">
              Failed to load featured products
            </h3>
            <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
              {(error as any)?.response?.data?.message ||
                error?.message ||
                "An error occurred while connecting to the server."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-primary text-black font-semibold text-xs rounded-md hover:bg-white transition-all"
            >
              Retry Load
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading || isFetching ? (
          <FeaturedProductsSkeleton />
        ) : featuredListings.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center bg-[#0A0A0A] border border-white/5 rounded-xl px-6"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Sparkles className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">
              No featured listings available
            </h3>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-6 font-light">
              There are currently no featured listings found for this selection.
              Try selecting another category.
            </p>
            {selectedCategory !== "ALL" && (
              <button
                onClick={() => setSelectedCategory("ALL")}
                className="px-6 py-2.5 bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-black font-semibold text-xs rounded-md transition-all"
              >
                Show All Categories
              </button>
            )}
          </motion.div>
        ) : (
          /* Listings Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Featured Card */}
            {mainProduct && (
              <motion.div
                layout
                key={mainProduct.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={
                  sideProducts.length > 0 ? "lg:col-span-4" : "lg:col-span-12"
                }
              >
                <Link
                  href={`/inventory/${mainProduct.slug || mainProduct.id}`}
                  className="group relative h-150 block overflow-hidden rounded-xl border border-white/5 hover:border-primary/40 transition-all shadow-2xl"
                >
                  <img
                    src={getProductImage(mainProduct)}
                    alt={mainProduct.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
                    {getBadgeTag(mainProduct)}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-6 right-6 pb-8">
                    <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">
                      {mainProduct.category}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                      {mainProduct.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary mb-3 font-serif">
                      {getFormattedPrice(mainProduct)}
                    </p>
                    <div className="flex items-center gap-2 text-white/70 text-sm font-light">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">
                        {getLocationString(mainProduct)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Side 4 Cards Grid */}
            {sideProducts.length > 0 && (
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {sideProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Link
                        href={`/inventory/${product.slug || product.id}`}
                        className="group relative h-[290px] block overflow-hidden rounded-xl border border-white/5 hover:border-primary/40 transition-all shadow-xl"
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 text-[10px] font-bold uppercase">
                          {getBadgeTag(product)}
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                            {product.category}
                          </p>
                          <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors truncate">
                            {product.title}
                          </h4>
                          <p className="text-primary font-bold">
                            {getFormattedPrice(product)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push("/inventory")}
            className="cursor-pointer px-8 py-4 bg-primary text-black font-bold uppercase text-sm tracking-widest hover:bg-white transition-all duration-300 rounded-sm shadow-lg shadow-primary/20"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Smooth Skeleton Loading Component ── */
function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      {/* Main Card Skeleton */}
      <div className="lg:col-span-4 h-150 bg-[#0E0E0E] border border-white/5 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="w-16 h-7 bg-white/10 rounded-full" />
        <div className="space-y-4">
          <div className="w-24 h-4 bg-white/10 rounded" />
          <div className="w-3/4 h-8 bg-white/10 rounded" />
          <div className="w-1/3 h-6 bg-white/10 rounded" />
          <div className="w-1/2 h-4 bg-white/5 rounded" />
        </div>
      </div>

      {/* Side 4 Cards Skeleton */}
      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-72.5 bg-[#0E0E0E] border border-white/5 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="w-14 h-5 bg-white/10 rounded-full" />
            <div className="space-y-2">
              <div className="w-20 h-3 bg-white/10 rounded" />
              <div className="w-2/3 h-6 bg-white/10 rounded" />
              <div className="w-1/3 h-5 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

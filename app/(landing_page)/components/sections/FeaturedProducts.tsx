"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

type Category = "Cars" | "Yachts" | "Aviation" | "Real Estate";

interface Product {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  tag: "VIP" | "Private" | "Dealer";
}

const PRODUCTS: Record<Category, Product[]> = {
  Cars: [
    { id: 1, title: "Ferrari 812 Superfast", price: "$350,000", location: "Miami, FL", image: "/images/landing/hero-car.png", tag: "VIP" },
    { id: 2, title: "Lamborghini Aventador", price: "$420,000", location: "Los Angeles, CA", image: "/images/landing/hero-car.png", tag: "Private" },
    { id: 3, title: "Porsche 911 GT3", price: "$180,000", location: "Dubai, UAE", image: "/images/landing/hero-car.png", tag: "Dealer" },
    { id: 4, title: "Aston Martin DBS", price: "$310,000", location: "London, UK", image: "/images/landing/hero-car.png", tag: "VIP" },
    { id: 5, title: "McLaren 720S", price: "$290,000", location: "Singapore", image: "/images/landing/hero-car.png", tag: "Private" },
  ],
  Yachts: [
    { id: 6, title: "Sunseeker 76 Yacht", price: "$4,200,000", location: "Monaco", image: "/images/landing/hero-yacht.png", tag: "VIP" },
    { id: 7, title: "Azimut Grande 27", price: "$6,500,000", location: "Cannes, France", image: "/images/landing/hero-yacht.png", tag: "Private" },
    { id: 8, title: "Princess S78", price: "$3,800,000", location: "Mallorca, Spain", image: "/images/landing/hero-yacht.png", tag: "Dealer" },
    { id: 9, title: "Ferretti 850", price: "$5,100,000", location: "Miami, FL", image: "/images/landing/hero-yacht.png", tag: "VIP" },
    { id: 10, title: "Sanlorenzo SL86", price: "$7,200,000", location: "Genoa, Italy", image: "/images/landing/hero-yacht.png", tag: "Private" },
  ],
  Aviation: [
    { id: 11, title: "Gulfstream G650ER", price: "$65,000,000", location: "Teterboro, NJ", image: "/images/landing/hero-jet.png", tag: "VIP" },
    { id: 12, title: "Bombardier Global 7500", price: "$73,000,000", location: "Geneva, CH", image: "/images/landing/hero-jet.png", tag: "Private" },
    { id: 13, title: "Cessna Citation Longitude", price: "$29,000,000", location: "Wichita, KS", image: "/images/landing/hero-jet.png", tag: "Dealer" },
    { id: 14, title: "Embraer Praetor 600", price: "$21,000,000", location: "Dallas, TX", image: "/images/landing/hero-jet.png", tag: "VIP" },
    { id: 15, title: "Dassault Falcon 8X", price: "$58,000,000", location: "Paris, FR", image: "/images/landing/hero-jet.png", tag: "Private" },
  ],
  "Real Estate": [
    { id: 16, title: "Villa Sunset Ridge", price: "$12,500,000", location: "Malibu, CA", image: "/images/landing/hero-villa.png", tag: "VIP" },
    { id: 17, title: "Ocean Edge Mansion", price: "$25,000,000", location: "The Hamptons, NY", image: "/images/landing/hero-villa.png", tag: "Private" },
    { id: 18, title: "Cloud Nine Penthouse", price: "$9,800,000", location: "New York, NY", image: "/images/landing/hero-villa.png", tag: "Dealer" },
    { id: 19, title: "Amanresort Estate", price: "$32,000,000", location: "Phuket, Thailand", image: "/images/landing/hero-villa.png", tag: "VIP" },
    { id: 20, title: "Alpine Chalet Luxe", price: "$15,400,000", location: "Courchevel, FR", image: "/images/landing/hero-villa.png", tag: "Private" },
  ],
};

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Cars");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories: Category[] = ["Cars", "Yachts", "Aviation", "Real Estate"];
  const currentProducts = PRODUCTS[selectedCategory];
  const mainProduct = currentProducts[0];
  const sideProducts = currentProducts.slice(1);

  return (
    <section className="py-32 bg-[#050505] px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
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

          {/* Custom Dropdown */}
          <div className="relative w-full md:w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer w-full bg-white/5 border border-white/10 px-6 py-4 rounded-lg flex items-center justify-between text-white hover:border-primary/50 transition-all text-sm font-medium"
            >
              {selectedCategory}
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-lg overflow-hidden z-20 shadow-2xl"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full text-left px-6 py-4 hover:bg-primary/10 transition-colors text-sm ${selectedCategory === cat ? "text-primary" : "text-white/70"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Large Card */}
          <motion.div
            layout
            key={`main-${selectedCategory}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 h-[600px] lg:h-auto group relative overflow-hidden rounded-xl"
          >
            <img src={mainProduct.image} alt={mainProduct.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              {mainProduct.tag}
            </div>
            <div className="absolute bottom-0 left-10 right-10">
              <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">{selectedCategory}</p>
              <h3 className="text-3xl font-bold text-white mb-2">{mainProduct.title}</h3>
              <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {mainProduct.location}
              </div>
              {/* <button className="text-primary font-bold border-b border-primary/50 pb-1 hover:border-primary transition-all">
                View Details
              </button> */}
            </div>
          </motion.div>

          {/* 4 Small Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {sideProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group relative h-[300px] overflow-hidden rounded-xl border border-white/5 hover:border-primary/20 transition-all"
                >
                  <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white/80 text-[10px] font-bold uppercase">
                    {product.tag}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{selectedCategory}</p>
                    <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">{product.title}</h4>
                    <p className="text-primary font-bold">{product.price}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="cursor-pointer px-8 py-4 bg-primary text-black font-bold uppercase text-sm tracking-widest hover:bg-white transition-all duration-300 rounded-sm">
            View All
          </button>
        </div>
      </div>
    </section>
  );
}

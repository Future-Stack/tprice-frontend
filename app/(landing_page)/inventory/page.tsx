"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MarketplaceHero from "./components/MarketplaceHero";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "./components/ProductCard";
import { DEMO_ITEMS, MarketplaceItem } from "./data";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Best Match");

  // Initial states aligned with sidebar sliders
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
  const [yearRange, setYearRange] = useState({ min: 1990, max: 2025 });
  const [mileageRange, setMileageRange] = useState({ min: 0, max: 100000 });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    document.body.classList.add('scrollbar-hide');
    return () => {
      document.body.classList.remove('scrollbar-hide');
    };
  }, []);

  // Filter Logic: coordinated by committed state
  const filteredItems = useMemo(() => {
    return DEMO_ITEMS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesBrand = brands.length === 0 || brands.includes(item.brand) || brands.some(b => item.title.toLowerCase().includes(b.toLowerCase()));

      const matchesCondition = conditions.length === 0 || conditions.includes(item.condition);

      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
      const matchesYear = item.year >= yearRange.min && item.year <= yearRange.max;
      const matchesMileage = item.mileage >= mileageRange.min && item.mileage <= mileageRange.max;

      return matchesSearch && matchesBrand && matchesCondition && matchesPrice && matchesYear && matchesMileage;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Newest Arrivals") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // "Best Match" default
    });
  }, [search, brands, conditions, sortBy, priceRange, yearRange, mileageRange]);

  const handleClearFilters = () => {
    setBrands([]);
    setConditions([]);
    setSearch("");
    setSortBy("Best Match");
    setPriceRange({ min: 0, max: 20000000 });
    setYearRange({ min: 1990, max: 2025 });
    setMileageRange({ min: 0, max: 100000 });
  };

  return (
    <div className="bg-black min-h-screen  ">
      <MarketplaceHero />

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:flex gap-16">
          {/* Sidebar */}
          <FilterSidebar
            sortBy={sortBy}
            setSortBy={setSortBy}
            brands={brands}
            setBrands={setBrands}
            conditions={conditions}
            setConditions={setConditions}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            yearRange={yearRange}
            setYearRange={setYearRange}
            mileageRange={mileageRange}
            setMileageRange={setMileageRange}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            onClear={handleClearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            <SearchBar
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-8 lg:gap-10">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
                {filteredItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center"
                  >
                    <p className="text-white/40 text-lg font-serif italic">
                      No matching luxury assets found.
                    </p>
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

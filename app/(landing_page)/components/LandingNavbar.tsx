"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

interface SubLink {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  subLinks?: SubLink[];
}

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  {
    name: "Inventory",
    href: "/inventory",
    subLinks: [
      { name: "Inventory", href: "/inventory" },
      { name: "MarketPlace", href: "/marketplace" },
      // { name: "Shop", href: "/shop" },
    ]
  },
  {
    name: "Events & Media",
    href: "/events",
    subLinks: [
      { name: "Events & Media", href: "/events" },
      { name: "Sponsors", href: "/sponsors" },
    ]
  },
  { name: "About Us", href: "/aboutus" },
  { name: "Contact", href: "/contact" },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-lg py-4 border-b border-white/10" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary font-montserrat">
            Exotic<span className="text-white">World</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const activeSub = link.subLinks?.find(s => s.href === pathname);
            const displayName = activeSub ? activeSub.name : link.name;
            const isActive = pathname === link.href || activeSub;

            return (
              <div
                key={link.name}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <Link
                    href={link.href}
                    className={`text-sm font-montserrat font-normal transition-colors hover:text-land ${isActive ? "text-primary" : "text-white/80"
                      }`}
                  >
                    {displayName}
                  </Link>
                  {link.subLinks && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 font-montserrat ${activeDropdown === link.name ? "rotate-180 text-primary" : "text-white/40"}`} />
                  )}
                </div>

                {/* Dropdown Menu */}
                {link.subLinks && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 pt-6 z-101"
                      >
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-2 min-w-[200px] shadow-2xl backdrop-blur-xl">
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-4 py-3 text-sm font-montserrat font-normal rounded-sm transition-all hover:bg-primary hover:text-black ${pathname === sub.href ? "bg-primary/10 text-primary" : "text-white/70"
                                }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/login" className="text-sm font-normal text-white/80 font-montserrat hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-sm font-montserrat border border-land text-land text-sm font-normal hover:bg-primary hover:text-black transition-all duration-300"
          >
            Register
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <div key={link.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={`text-lg font-medium transition-colors ${pathname === link.href ? "text-primary" : "text-white/90"
                        }`}
                      onClick={() => !link.subLinks && setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.subLinks && (
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className="p-2 text-white/40"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {link.subLinks && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pl-4 flex flex-col gap-4 border-l border-white/10"
                    >
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`text-base font-medium transition-colors ${pathname === sub.href ? "text-primary" : "text-white/60"
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link
                href="/login"
                className="text-lg font-medium text-white/90"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-sm border border-primary text-primary text-center font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

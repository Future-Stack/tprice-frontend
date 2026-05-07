"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, User, Settings, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "View Profile", desc: "Your personal details" },
    { icon: Settings, label: "Settings", desc: "Account preferences" },
    { icon: Shield, label: "Security", desc: "Privacy & security" },
  ];

  return (
    <header className="h-20 lg:h-24 flex items-center justify-between px-4 lg:px-10 z-20 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full bg-[#18181A] border border-primary/30 rounded-full py-2.5 lg:py-3.5 pl-10 lg:pl-12 pr-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:shadow-[0_0_15px_rgba(231,143,35,0.1)] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-7 ml-4 lg:ml-8">
        <button className="relative text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
          <Bell className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111113]"></span>
        </button>
        <div className="hidden sm:block w-px h-8 bg-[#2C2C2E]"></div>

        {/* profile button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden bg-gray-600 border ring-2 ring-[#E78F23]/20 border-transparent shadow-lg object-cover">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#E78F23]">Alexander</span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="hidden sm:block w-4 h-4 text-[#E78F23]/70" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-64 bg-[#18181A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                  <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-white/90 truncate">alexander@example.com</p>
                </div>

                <div className="space-y-0.5">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group group-hover:translate-x-1"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#E78F23]/20 group-hover:text-[#E78F23] transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium leading-none">{item.label}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-1 border-t border-white/5">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group group-hover:translate-x-1">
                    <div className="p-2 rounded-lg bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium leading-none">Logout</p>
                      <p className="text-[10px] text-red-500/50 mt-1">Exit application</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}


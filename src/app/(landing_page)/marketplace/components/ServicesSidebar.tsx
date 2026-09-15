"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ServicesSidebarProps {
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const CATEGORIES = [
  "All",
  "Interior Designers",
  "Luxury Consultants",
  "Property Experts",
  "Yacht Services",
  "Aviation Services",
];

export default function ServicesSidebar({
  activeCategory,
  setActiveCategory,
  isOpen,
  onClose,
}: ServicesSidebarProps) {
  const content = (
    <div className="w-full lg:w-72">
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white text-lg font-serif mb-6 border-b border-white/5 pb-4">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                if (onClose) onClose();
              }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all border",
                activeCategory === cat
                  ? "bg-primary/20 border-primary/40 text-primary font-bold"
                  : "bg-transparent border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 p-8 flex flex-col lg:hidden">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif text-white uppercase tracking-widest">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        {content}
      </div>
    );
  }

  return (
    <aside className="hidden lg:block sticky top-32 self-start z-10 custom-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto">
      {content}
    </aside>
  );
}

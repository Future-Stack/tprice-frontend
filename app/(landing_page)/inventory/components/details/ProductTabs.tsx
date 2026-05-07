"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProductTabs({ activeTab, setActiveTab }: ProductTabsProps) {
  const tabs = ["Overview", "Specifications", "History", "Documents"];

  return (
    <div className="flex items-center gap-8 border-b border-white/5 pb-4 mb-8 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative py-2 text-sm font-medium transition-colors cursor-pointer"
        >
          <span className={`${activeTab === tab ? "text-primary" : "text-white/40 hover:text-white"}`}>
            {tab}
          </span>
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      ))}
    </div>
  );
}

"use client";

import React, { useState } from "react"; 
import Topbar from "../components/Topbar";
import BuyerSidebar from "../components/BuyerSidebar";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const onClose = () => {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <div className="flex h-screen bg-background text-white font-inter overflow-hidden relative">
      <BuyerSidebar isSidebarOpen={isSidebarOpen} onClose={onClose} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E78F23]/5 rounded-full blur-[100px] pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
}

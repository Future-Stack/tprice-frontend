"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Gavel,
  BadgePercent,
  Crown,
  Settings,
  X,
  Heart,
} from "lucide-react";

const navItems = [
  { href: "/dealer", icon: LayoutDashboard, label: "Home" },
  { href: "/dealer/deals", icon: Building2, label: "Deals" },
  { href: "/dealer/listing", icon: Gavel, label: "Listing" },
  { href: "/dealer/messages", icon: BadgePercent, label: "Messages" },
  { href: "/dealer/account", icon: Heart, label: "Account" },
];



export default function DealerSidebar({ isSidebarOpen, onClose }: { isSidebarOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 lg:mt-8 lg:ml-8 border border-primary/30 lg:rounded-[8px] bg-[#18181A] flex flex-col border-r overflow-y-auto shrink-0 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        style={{
          boxShadow: " 50px 0 40px 0 rgba(212, 175, 55, 0.00), 50px 0 40px 0 rgba(212, 175, 55, 0.01), 9px 0 40px 0 rgba(212, 175, 55, 0.05), 35px 0 166px 0 rgba(212, 175, 55, 0.02), -3px 0 43.6px 0 rgba(212, 175, 55, 0.01)"
          // boxShadow: "213px 0 59px 0 rgba(143, 96, 36, 0.00), 136px 0 54px 0 rgba(143, 96, 36, 0.01), 77px 0 46px 0 rgba(143, 96, 36, 0.05), 34px 0 34px 0 rgba(143, 96, 36, 0.09), 9px 0 19px 0 rgba(143, 96, 36, 0.10)"
        }}
      >
        {/* Logo and Close Button (mobile only) */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold font-clash tracking-wide text-white">
              Exotic<span className="text-[#E78F23]">World</span>
            </h1>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                  ? "bg-primary text-white shadow-[0_4px_20px_rgba(231,143,35,0.4)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}

        </nav>

        {/* VIP Upgrade Banner */}
        <div className="p-5 mt-auto mb-6 mx-4 rounded-2xl bg-linear-to-br from-[#EEA341] to-[#C76E12] relative shadow-[0_10px_30px_rgba(231,143,35,0.2)] text-white overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
          <button className="absolute top-3 right-3 text-white/70 hover:text-white z-10 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
          <h3 className="font-bold text-lg mb-1.5 font-clash">Upgrade to VIP!</h3>
          <p className="text-[11px] text-white/90 mb-5 leading-relaxed">Unlock Premium Features And Offers</p>
          <button className="bg-[#111113] w-full py-2.5 rounded-lg text-[#E78F23] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg">
            Upgrade Now
            <Crown className="w-3.5 h-3.5" fill="currentColor" />
          </button>
        </div>
      </aside>
    </>
  );
}


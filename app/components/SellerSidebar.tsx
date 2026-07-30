"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Gavel,
  BadgePercent,
  List as ListIcon,
  X,
} from "lucide-react";

const navItems = [
  { href: "/seller", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/seller/my-listing", icon: Building2, label: "MyListing" },
  { href: "/seller/add-listing", icon: Gavel, label: "Add Listing" },
  {
    href: "/seller/offer-receieved",
    icon: BadgePercent,
    label: "Offer Receieved",
  },
  { href: "/seller/settings", icon: ListIcon, label: "Settings" },
];

export default function SellerSidebar({
  isSidebarOpen,
  onClose,
}: {
  isSidebarOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 lg:mt-8 lg:ml-8 border border-primary/30 lg:rounded-[8px] bg-[#18181A] flex flex-col border-r overflow-y-auto shrink-0 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          boxShadow:
            "50px 0 40px 0 rgba(212, 175, 55, 0.00), 50px 0 40px 0 rgba(212, 175, 55, 0.01), 9px 0 40px 0 rgba(212, 175, 55, 0.05), 35px 0 166px 0 rgba(212, 175, 55, 0.02), -3px 0 43.6px 0 rgba(212, 175, 55, 0.01)",
        }}
      >
        {/* Logo and Close Button (mobile only) */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={160}
              height={30}
              priority
              className="h-auto w-auto max-h-8 object-contain"
            />
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
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
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
      </aside>
    </>
  );
}

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
  Calendar,
  FolderTree,
  Award,
  Users,
  Image as ImageIcon,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/categories", icon: FolderTree, label: "Categories" },
  { href: "/admin/brands", icon: Award, label: "Brands" },
  { href: "/admin/listings", icon: Building2, label: "Listings" },
  { href: "/admin/deals", icon: Gavel, label: "Deals" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/media", icon: ImageIcon, label: "Media" },
  // { href: "/admin/dealers", icon: BadgePercent, label: "Dealers" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/activity", icon: Heart, label: "Activity" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar({
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
          // boxShadow: "213px 0 59px 0 rgba(143, 96, 36, 0.00), 136px 0 54px 0 rgba(143, 96, 36, 0.01), 77px 0 46px 0 rgba(143, 96, 36, 0.05), 34px 0 34px 0 rgba(143, 96, 36, 0.09), 9px 0 19px 0 rgba(143, 96, 36, 0.10)"
        }}
      >
        {/* Logo and Close Button (mobile only) */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold font-clash tracking-wide text-white">
              Exotic<span className="text-primary">World</span>
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

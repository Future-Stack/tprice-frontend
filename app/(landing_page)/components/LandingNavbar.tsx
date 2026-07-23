"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useAuthStore, User } from "@/lib/store/useAuthStore";
import { useLogoutMutation, useGetMeQuery } from "@/hooks/useAuth";

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
    ],
  },
  {
    name: "Events & Media",
    href: "/events",
    subLinks: [
      { name: "Events & Media", href: "/events" },
      { name: "Sponsors", href: "/sponsors" },
    ],
  },
  { name: "About Us", href: "/aboutus" },
  { name: "Contact", href: "/contact" },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { user: storeUser, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  // Fetch user profile via TanStack Query
  const hasToken = !!(Cookies.get("access_token") || useAuthStore.getState().token);
  const { data: userProfile, isLoading: isUserLoading } = useGetMeQuery(hasToken);

  const user = userProfile || storeUser;
  const isLoading = isUserLoading && hasToken;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserDisplayName = (u: User) => {
    if (u.firstName || u.lastName) {
      return `${u.firstName || ""} ${u.lastName || ""}`.trim();
    }
    if (u.name) return u.name;
    return u.email ? u.email.split("@")[0] : "User";
  };

  const getInitials = (u: User) => {
    if (u.firstName && u.lastName) {
      return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
    }
    if (u.firstName) return u.firstName.charAt(0).toUpperCase();
    if (u.name) return u.name.charAt(0).toUpperCase();
    if (u.email) return u.email.charAt(0).toUpperCase();
    return "U";
  };

  const getDashboardPath = (role?: string) => {
    if (!role) return "/buyer";
    const r = role.toUpperCase();
    if (r === "ADMIN") return "/admin";
    if (r === "DEALER") return "/dealer";
    if (r === "SELLER") return "/seller";
    return "/buyer";
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logoutMutation.mutate();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-lg py-4" : "bg-transparent py-6"
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
            const activeSub = link.subLinks?.find((s) => s.href === pathname);
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
                    className={`text-sm font-montserrat font-normal transition-colors hover:text-land ${
                      isActive ? "text-primary" : "text-white/80"
                    }`}
                  >
                    {displayName}
                  </Link>
                  {link.subLinks && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 font-montserrat ${
                        activeDropdown === link.name
                          ? "rotate-180 text-primary"
                          : "text-white/40"
                      }`}
                    />
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
                              className={`block px-4 py-3 text-sm font-montserrat font-normal rounded-sm transition-all hover:bg-primary hover:text-black ${
                                pathname === sub.href
                                  ? "bg-primary/10 text-primary"
                                  : "text-white/70"
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
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="flex items-center gap-3 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div className="flex flex-col gap-1.5">
                <div className="w-20 h-3 bg-white/20 rounded" />
                <div className="w-12 h-2 bg-white/15 rounded" />
              </div>
            </div>
          ) : isAuthenticated && user ? (
            /* Authenticated User Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all cursor-pointer group"
              >
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center shrink-0">
                  {user.avatarUrl || user.avatar ? (
                    <img
                      src={user.avatarUrl || user.avatar}
                      alt={getUserDisplayName(user)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-primary font-montserrat">
                      {getInitials(user)}
                    </span>
                  )}
                </div>

                {/* User Name & Role */}
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-medium text-white font-montserrat leading-tight truncate max-w-30">
                    {getUserDisplayName(user)}
                  </p>
                  <span className="inline-block text-[10px] font-semibold tracking-wider text-primary uppercase leading-tight font-montserrat">
                    {user.role || "BUYER"}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-white/50 transition-transform duration-300 group-hover:text-white ${
                    userDropdownOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-[#0A0A0A] border border-white/10 rounded-md p-3 shadow-2xl backdrop-blur-xl z-105"
                  >
                    {/* User Card */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.avatarUrl || user.avatar ? (
                          <img
                            src={user.avatarUrl || user.avatar}
                            alt={getUserDisplayName(user)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-primary font-montserrat">
                            {getInitials(user)}
                          </span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-semibold text-white font-montserrat truncate">
                          {getUserDisplayName(user)}
                        </h4>
                        <p className="text-xs text-white/50 font-montserrat truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                          {user.role || "BUYER"}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-white/10 my-2" />

                    {/* Dashboard & Logout Actions */}
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/80 hover:text-black hover:bg-primary rounded transition-all font-montserrat"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-500/20 rounded transition-all font-montserrat mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged Out Buttons */
            <>
              <Link
                href="/login"
                className="text-sm font-normal text-white/80 font-montserrat hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-sm font-montserrat border border-land text-land text-sm font-normal hover:bg-primary hover:text-black transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
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
                      className={`text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? "text-primary"
                          : "text-white/90"
                      }`}
                      onClick={() => !link.subLinks && setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.subLinks && (
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === link.name ? null : link.name,
                          )
                        }
                        className="p-2 text-white/40"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
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
                          className={`text-base font-medium transition-colors ${
                            pathname === sub.href
                              ? "text-primary"
                              : "text-white/60"
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

              {/* Mobile Auth Section */}
              {isLoading ? (
                <div className="flex items-center gap-3 p-4 rounded-md bg-white/5 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-white/20" />
                  <div className="flex flex-col gap-2">
                    <div className="w-28 h-3.5 bg-white/20 rounded" />
                    <div className="w-16 h-2.5 bg-white/15 rounded" />
                  </div>
                </div>
              ) : isAuthenticated && user ? (
                <div className="flex flex-col gap-4">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {user.avatarUrl || user.avatar ? (
                        <img
                          src={user.avatarUrl || user.avatar}
                          alt={getUserDisplayName(user)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-primary font-montserrat">
                          {getInitials(user)}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-base font-semibold text-white font-montserrat truncate">
                        {getUserDisplayName(user)}
                      </h4>
                      <p className="text-xs text-white/50 font-montserrat truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
                        {user.role || "BUYER"}
                      </span>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    href={getDashboardPath(user.role)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm border border-primary text-primary font-semibold text-center hover:bg-primary hover:text-black transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    disabled={logoutMutation.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm border border-red-500/40 text-red-400 font-semibold text-center hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

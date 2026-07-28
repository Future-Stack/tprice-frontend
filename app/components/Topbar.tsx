"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserRound } from "lucide-react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Settings,
  LogOut,
  Loader2,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle2,
  Inbox,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  useNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "@/hooks/useNotifications";
import { NotificationItem } from "@/lib/api/notifications";
import Image from "next/image";

function formatTimeAgo(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "just now";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Topbar({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [page, setPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const logoutMutation = useLogoutMutation();
  const { user } = useAuthStore();

  // Notifications API query & mutation
  const { data: notificationsData, isLoading: isNotificationsLoading } =
    useNotificationsQuery({ page, limit: 10 });
  const markAsReadMutation = useMarkNotificationAsReadMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount ?? 0;
  const meta = notificationsData?.meta;

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarSrc = user?.avatar || user?.avatarUrl;

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutMutation.mutate();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
  };

  const handleMarkAsReadOnly = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [{ icon: Settings, label: "Settings", desc: "/settings" }];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ADMIN_HIGH_VALUE_OFFER":
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case "LISTING_MODERATION":
        return <FileText className="w-4 h-4 text-[#E78F23]" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

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
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative text-gray-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-4 h-4 flex items-center justify-center border-2 border-[#111113]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#18181A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 p-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E78F23]/20 text-[#E78F23] border border-[#E78F23]/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {isNotificationsLoading && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                  )}
                </div>

                {/* Notification List Scrollable Container */}
                <div className="max-h-80 sm:max-h-96 overflow-y-auto space-y-1.5 pr-1 text-left scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                  {isNotificationsLoading && notifications.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E78F23]" />
                      <p className="text-xs">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-gray-500">
                      <Inbox className="w-8 h-8 stroke-[1.5]" />
                      <p className="text-xs font-medium">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`group relative p-3 rounded-xl transition-all cursor-pointer border flex items-start gap-3 ${
                          !item.isRead
                            ? "bg-[#E78F23]/10 border-[#E78F23]/30 hover:bg-[#E78F23]/15 hover:border-[#E78F23]/50"
                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                        }`}
                      >
                        {/* Icon Badge */}
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            !item.isRead
                              ? "bg-[#E78F23]/20"
                              : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {getNotificationIcon(item.type)}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4
                              className={`text-xs font-semibold truncate ${
                                !item.isRead ? "text-white" : "text-gray-300"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>

                        {/* Unread Action Button / Indicator */}
                        {!item.isRead && (
                          <button
                            onClick={(e) => handleMarkAsReadOnly(e, item.id)}
                            title="Mark as read"
                            className="shrink-0 text-gray-500 hover:text-white p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 text-[#E78F23]" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Pagination if Total Pages > 1 */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between px-3 pt-2.5 mt-2 border-t border-white/5 text-xs text-gray-400">
                    <button
                      disabled={page <= 1 || isNotificationsLoading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span>
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <button
                      disabled={page >= meta.totalPages || isNotificationsLoading}
                      onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:block w-px h-8 bg-[#2C2C2E]"></div>

        {/* profile button */}
        <div
          className="relative border border-primary rounded-full p-1"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 flex justify-center items-center rounded-full overflow-hidden border ring-2 ring-[#E78F23]/20 border-transparent shadow-lg object-cover">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <UserRound />
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary max-w-30 truncate">
              {displayName}
            </span>
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
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500 font-medium">
                      Signed in as
                    </p>
                    {user?.role && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E78F23]/20 text-[#E78F23] border border-[#E78F23]/30 uppercase">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/90 truncate mt-0.5">
                    {user?.email || ""}
                  </p>
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
                        <p className="text-sm font-medium leading-none">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-1 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-lg bg-red-500/10 transition-colors">
                      {logoutMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium leading-none">
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </p>
                      <p className="text-[10px] text-red-500/50 mt-1">
                        Exit application
                      </p>
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


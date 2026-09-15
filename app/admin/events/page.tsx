"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Users,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  Pencil,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useGetEventsQuery, useDeleteEventMutation } from "@/hooks/useEvents";
import { EventItem } from "@/lib/api/events";
import CreateEventModal from "./CreateEventModal";
import EditEventModal from "./EditEventModal";
import { toast } from "sonner";

const CATEGORIES = [
  { label: "All Events", value: "ALL" },
  { label: "Yacht", value: "YACHT" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Aviation", value: "AVIATION" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watches", value: "WATCH" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 bg-white/10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-48 h-4 bg-white/10 rounded" />
              <div className="w-32 h-3 bg-white/5 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-6 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-6 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="w-8 h-4 bg-white/10 rounded mx-auto" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="w-16 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminEventsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const { data, isLoading, isFetching } = useGetEventsQuery({
    page,
    limit,
    category: activeCategory !== "ALL" ? activeCategory : undefined,
    status: activeStatus !== "ALL" ? activeStatus : undefined,
  });

  const deleteEventMutation = useDeleteEventMutation();

  const events = useMemo(() => {
    const list = data?.data || [];
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (event) =>
        (event.title || "").toLowerCase().includes(query) ||
        (event.location || "").toLowerCase().includes(query),
    );
  }, [data?.data, searchQuery]);
  const meta = data?.meta;

  const handleCategoryChange = (catValue: string) => {
    setActiveCategory(catValue);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveStatus(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteEventMutation.mutateAsync(id);
        toast.success("Event deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete event");
      }
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-12">
      {/* Header & Create Button Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h1 className="text-3xl font-bold font-montserrat">
              Events Management
            </h1>
            <p className="text-gray-400 text-sm">
              Monitor, create, and manage all luxury platform events
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-left" duration={0.5}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.4)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </AnimationWrapper>
      </div>

      {/* Category Tabs Section */}
      <div className="mb-6 border-b border-[#262626]">
        <AnimationWrapper type="fade-right" duration={0.5} delay={0.1}>
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${activeCategory === cat.value
                  ? "text-white font-semibold"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {cat.label}
                {activeCategory === cat.value && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(231,143,35,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </AnimationWrapper>
      </div>

      {/* Controls & Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
          <div className="w-full sm:w-auto flex flex-1 items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search events by title or location..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={activeStatus}
                onChange={handleStatusChange}
                className="bg-[#141416] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none pr-8"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option
                    key={st.value}
                    value={st.value}
                    className="bg-[#141416] text-white"
                  >
                    {st.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </AnimationWrapper>

        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Updating events...
          </div>
        )}
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full">
              <thead>
                <tr className="bg-[#151515] border-b border-primary/20">
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Event
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Date & Time
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-center">
                    Registrations
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Calendar className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No events found
                        </p>
                        <p className="text-xs text-gray-500">
                          There are no events matching your current filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr
                      key={event.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Title & Image */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0">
                            <img
                              src={
                                event.coverImageUrl ||
                                "/images/landing/hero-car.png"
                              }
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/landing/hero-car.png";
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
                              {event.title}
                            </span>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-xs">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                          {event.category}
                        </span>
                      </td>

                      {/* Event Date */}
                      <td className="px-6 py-5 text-xs text-gray-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(event.eventDate)}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          {event.location}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${event.status === "UPCOMING"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : event.status === "ONGOING"
                              ? "bg-yellow-500/10 text-primary border border-primary/20"
                              : event.status === "CANCELLED"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            }`}
                        >
                          {event.status}
                        </span>
                      </td>

                      {/* Registrations */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-[#1A1A1C] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          {event._count?.registrations ?? 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                            title="Edit event"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={deleteEventMutation.isPending}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 0 && (
            <div className="px-6 py-4 bg-[#151515] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-end gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1 || isLoading}
                  className="px-3 py-1.5 bg-[#1C1C1E] border border-[#262626] rounded-lg hover:bg-white/5 text-gray-300 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPages ||
                        Math.abs(p - meta.page) <= 1,
                    )
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-gray-600">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${page === p
                            ? "bg-primary text-black"
                            : "bg-[#1C1C1E] text-gray-400 hover:text-white border border-[#262626]"
                            }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, meta.totalPages))
                  }
                  disabled={page >= meta.totalPages || isLoading}
                  className="px-3 py-1.5 bg-[#1C1C1E] border border-[#262626] rounded-lg hover:bg-white/5 text-gray-300 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={Boolean(editingEvent)}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
      />
    </div>
  );
}

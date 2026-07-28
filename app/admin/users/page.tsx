"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Crown,
  RefreshCw,
  Users as UsersIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  useDeleteAdminUserMutation,
} from "@/hooks/useUsers";
import { AdminUserItem, UpdateUserStatusPayload } from "@/lib/api/users";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import UpdateUserStatusModal from "./UpdateUserStatusModal";

const ROLE_TABS = ["All Roles", "BUYER", "SELLER", "DEALER", "ADMIN"];
const LIMIT_OPTIONS = [10, 20, 50, 100];

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getRoleBadge = (role: string) => {
  const normalized = (role || "").toUpperCase();

  switch (normalized) {
    case "ADMIN":
      return {
        label: "ADMIN",
        className:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      };
    case "DEALER":
      return {
        label: "DEALER",
        className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      };
    case "SELLER":
      return {
        label: "SELLER",
        className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      };
    case "BUYER":
    default:
      return {
        label: "BUYER",
        className:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      };
  }
};

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-800 rounded" />
              <div className="h-3 w-44 bg-gray-800/60 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="h-6 w-20 bg-gray-800 rounded-full mx-auto" />
        </td>
        <td className="px-6 py-5">
          <div className="flex justify-center gap-2">
            <div className="h-6 w-24 bg-gray-800 rounded-full" />
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="h-4 w-28 bg-gray-800 rounded mx-auto" />
        </td>
        <td className="px-6 py-5">
          <div className="h-4 w-24 bg-gray-800 rounded mx-auto" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="h-8 w-28 bg-gray-800 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminUsersPage() {
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Status update modal state
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // React Query Hook for admin users
  const { data, isLoading, isError, refetch, isFetching } = useAdminUsersQuery({
    page,
    limit,
    role: selectedRole,
    search: debouncedSearch,
  });

  const updateStatusMutation = useUpdateAdminUserStatusMutation();
  const deleteUserMutation = useDeleteAdminUserMutation();

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const openUpdateModal = (user: AdminUserItem) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmStatusUpdate = async (
    payload: UpdateUserStatusPayload,
  ) => {
    if (!selectedUser) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedUser.id,
        payload,
      });
      toast.success(
        `Updated status for ${selectedUser.firstName || selectedUser.email} successfully.`,
      );
      setIsUpdateModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update user status. Please try again.",
      );
    }
  };

  const usersList = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  return (
    <div className="min-h-screen text-white font-sans space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.4}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              User Management
              <button
                onClick={() => refetch()}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Refresh users"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`}
                />
              </button>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage platform members, roles, verification status, and VIP
              privileges
            </p>
          </div>
        </AnimationWrapper>
      </div>

      {/* Controls Bar: Role Tabs + Search */}
      <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#111111] border border-[#262626] p-4 rounded-2xl">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {ROLE_TABS.map((tab) => {
              const isActive = selectedRole === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleRoleChange(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-[0_4px_15px_rgba(231,143,35,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-65">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="w-full bg-[#1A1A1C] border border-[#262626] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
      </AnimationWrapper>

      {/* Main Table Card */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="border-b border-[#1A1A1A] bg-[#141416]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    USER & DETAILS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    ROLE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    STATUS & VIP
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    STATS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                    JOINED DATE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                        <p className="text-sm font-semibold">
                          Failed to load user data
                        </p>
                        <button
                          onClick={() => refetch()}
                          className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <UsersIcon className="w-10 h-10 text-gray-600 mb-1" />
                        <p className="text-sm font-semibold text-gray-300">
                          No users found
                        </p>
                        <p className="text-xs text-gray-500">
                          Try adjusting your role filter or search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  usersList.map((user) => {
                    const fullName =
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      user.email.split("@")[0];
                    const roleStyle = getRoleBadge(user.role);
                    const initials = fullName.substring(0, 2).toUpperCase();

                    return (
                      <tr
                        key={user.id}
                        className="group hover:bg-[#1A1A1C]/60 transition-colors duration-150"
                      >
                        {/* User & Details */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-primary/30 to-amber-600/30 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {user.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={user.avatarUrl}
                                  alt={fullName}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                initials
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-white group-hover:text-primary transition-colors truncate">
                                {fullName}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {user.phone}
                                </p>
                              )}
                              {user.dealerProfile?.companyName && (
                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300 font-medium">
                                  🏢 {user.dealerProfile.companyName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${roleStyle.className}`}
                            >
                              {roleStyle.label}
                            </span>
                          </div>
                        </td>

                        {/* Verification & VIP Status */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 ${
                                user.isVerified
                                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.isVerified
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              />
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>

                            {user.vipStatus && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-400" /> VIP
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Activity Stats */}
                        <td className="px-6 py-5 text-center text-xs text-gray-400">
                          {user._count ? (
                            <div className="flex justify-center gap-3 text-[11px]">
                              <span title="Listings">
                                📦{" "}
                                <strong className="text-gray-200">
                                  {user._count.listings}
                                </strong>
                              </span>
                              <span title="Offers">
                                💬{" "}
                                <strong className="text-gray-200">
                                  {user._count.offersAsBuyer +
                                    user._count.offersAsSeller}
                                </strong>
                              </span>
                              <span title="Deals">
                                🤝{" "}
                                <strong className="text-gray-200">
                                  {user._count.dealsAsBuyer +
                                    user._count.dealsAsSeller}
                                </strong>
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-5 text-center text-xs text-gray-400 font-medium">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Action Buttons: Status Update & Delete */}
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openUpdateModal(user)}
                              className="px-3.5 py-2 border border-primary/50 hover:border-primary rounded-xl text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all active:scale-95 shadow-[0_0_15px_rgba(231,143,35,0.1)] hover:shadow-[0_0_20px_rgba(231,143,35,0.3)] cursor-pointer"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              disabled={
                                deleteUserMutation.isPending &&
                                deleteUserMutation.variables === user.id
                              }
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                              title="Delete User"
                            >
                              {deleteUserMutation.isPending &&
                              deleteUserMutation.variables === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Pagination */}
          {!isLoading && !isError && usersList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#1A1A1A] bg-[#141416]">
              {/* Pagination Info & Limit selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  Showing{" "}
                  <strong className="text-white">
                    {Math.min((page - 1) * limit + 1, meta.total)}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-white">
                    {Math.min(page * limit, meta.total)}
                  </strong>{" "}
                  of <strong className="text-white">{meta.total}</strong> users
                </span>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Per page:</span>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="bg-[#1A1A1C] border border-[#262626] text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary/60 cursor-pointer"
                  >
                    {LIMIT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = page;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-[0_2px_10px_rgba(231,143,35,0.4)]"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* User Status Update Modal */}
      <UpdateUserStatusModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmStatusUpdate}
        user={selectedUser}
        isSubmitting={updateStatusMutation.isPending}
      />
    </div>
  );
}

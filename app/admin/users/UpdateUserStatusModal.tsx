"use client";

import React, { useState, useEffect } from "react";
import { X, Crown, UserCheck, Loader2, Sparkles, Check } from "lucide-react";
import { AdminUserItem, UpdateUserStatusPayload } from "@/lib/api/users";

interface UpdateUserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateUserStatusPayload) => Promise<void>;
  user: AdminUserItem | null;
  isSubmitting: boolean;
}

const ROLES = [
  { value: "BUYER", label: "Buyer", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "SELLER", label: "Seller", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "DEALER", label: "Dealer", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { value: "ADMIN", label: "Admin", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
];

export default function UpdateUserStatusModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isSubmitting,
}: UpdateUserStatusModalProps) {
  const [role, setRole] = useState<string>("BUYER");

  useEffect(() => {
    if (user && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(user.role || "BUYER");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      role,
    });
  };

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email.split("@")[0];

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#262626] rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Update User Role</h3>
              <p className="text-xs text-gray-400">Modify user role on the platform</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Preview */}
        <div className="flex items-center gap-4 p-4 bg-[#1A1A1C] border border-[#262626] rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-amber-600/30 border border-primary/40 flex items-center justify-center text-primary font-bold text-base shrink-0">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              getInitials(fullName)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-white line-clamp-1">{fullName}</h4>
              {user.vipStatus && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> VIP
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Status Update Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              User Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((r) => {
                const isSelected = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? `${r.color} ring-1 ring-primary/40`
                        : "bg-[#1A1A1C] border-[#262626] text-gray-400 hover:text-gray-200 hover:border-gray-600"
                    }`}
                  >
                    <span>{r.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#1C1C1E] border border-[#262626] hover:border-gray-600 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

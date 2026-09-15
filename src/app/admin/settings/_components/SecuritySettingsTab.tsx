"use client";

import React, { useState } from "react";
import { Lock, Monitor, LogOut, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useChangePasswordMutation } from "@/hooks/useAuth";
import { useUpdateModerationSettingsMutation } from "@/hooks/useAdminSettings";
import { useRevokeSessionMutation } from "@/hooks/useSessions";
import { parseUserAgent, formatDate } from "./types";
import type { SecuritySettingsTabProps } from "./types";

export function SecuritySettingsTab({
  settings,
  sessions,
  isSessionsLoading,
  isSessionsError,
  onRefetchSessions,
}: SecuritySettingsTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [requireApproval, setRequireApproval] = useState(settings?.requireAdminApproval ?? true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const changePasswordMutation = useChangePasswordMutation();
  const updateModerationSettingsMutation = useUpdateModerationSettingsMutation();
  const revokeSessionMutation = useRevokeSessionMutation();

  const handleSavePassword = () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
        },
      }
    );
  };

  const handleToggleRequireApproval = () => {
    const nextVal = !requireApproval;
    setRequireApproval(nextVal);
    updateModerationSettingsMutation.mutate({
      requireAdminApproval: nextVal,
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    setRevokingId(sessionId);
    revokeSessionMutation.mutate(sessionId, {
      onSettled: () => setRevokingId(null),
    });
  };

  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-8">
        {/* Change Password */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 font-primary">
            Change Password
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-[#666]">Current Password</label>
              <input
                type="password"
                placeholder="********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-[#666]">New Password</label>
              <input
                type="password"
                placeholder="****************"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSavePassword}
            disabled={changePasswordMutation.isPending}
            className="border border-[#facc15]/50 text-[#facc15] hover:bg-[#facc15] hover:text-black hover:border-[#facc15] px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {changePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </section>

        {/* Require approval toggle */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-[#facc15]/5 border border-[#facc15]/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#facc15]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Require admin approval for listings
              </h3>
              <p className="text-[#666] text-sm">Automatically flag stale listings</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleRequireApproval}
            disabled={updateModerationSettingsMutation.isPending}
            className={`relative inline-flex h-8.5 w-16 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              requireApproval ? "bg-[#facc15]" : "bg-[#2A2A2A]"
            }`}
          >
            <div
              className={`inline-block h-7 w-7 transform rounded-full transition-all duration-300 ${
                requireApproval ? "translate-x-8 bg-black shadow-lg" : "translate-x-1 bg-[#444]"
              }`}
            />
          </button>
        </section>

        {/* Active Sessions */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-[#facc15]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Active Sessions</h2>
                <p className="text-[#666] text-xs md:text-sm">
                  Manage devices currently logged into your account
                </p>
              </div>
            </div>
            {isSessionsError && (
              <button
                type="button"
                onClick={onRefetchSessions}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>

          {isSessionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center justify-between p-4 bg-[#1A1A1A]/40 rounded-xl border border-white/5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#2A2A2A] rounded w-52" />
                    <div className="flex items-center gap-3">
                      <div className="h-3 bg-[#222] rounded w-28" />
                      <div className="h-3 bg-[#222] rounded w-36" />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#2A2A2A]" />
                </div>
              ))}
            </div>
          ) : isSessionsError ? (
            <div className="text-center py-8 bg-[#1A1A1A]/30 rounded-xl border border-red-500/10">
              <p className="text-red-400 text-sm mb-3">Failed to load active sessions.</p>
              <button
                type="button"
                onClick={onRefetchSessions}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-[#facc15] text-black rounded-lg hover:bg-[#eab308] transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Sessions
              </button>
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-8 text-[#666] text-sm bg-[#1A1A1A]/20 rounded-xl border border-white/5">
              No active sessions found.
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session, index) => {
                const { device, browser } = parseUserAgent(session.userAgent);
                const isRevoking = revokingId === session.id;

                return (
                  <React.Fragment key={session.id}>
                    {index > 0 && <div className="h-px bg-white/3" />}
                    <div className="flex items-center justify-between group py-2">
                      <div className="space-y-1">
                        <h4 className="text-white font-medium flex items-center gap-2 text-base">
                          <span>
                            {device} - {browser}
                          </span>
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                          <span className="text-[#888]">
                            IP: {session.ipAddress || "Unknown IP"}
                          </span>
                          <span className="text-[#444]">•</span>
                          <span className="text-[#666]">
                            Logged in: {formatDate(session.createdAt)}
                          </span>
                          {session.isCurrent && (
                            <>
                              <span className="text-[#444]">•</span>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#facc15] animate-pulse" />
                                <span className="text-[#facc15] text-[13px] font-medium italic">
                                  Current device
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={isRevoking || revokeSessionMutation.isPending}
                          title="Revoke session"
                          className="w-10 h-10 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 flex items-center justify-center transition-all group/btn border border-transparent hover:border-orange-500/20 cursor-pointer disabled:opacity-50"
                        >
                          {isRevoking ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#f97316]" />
                          ) : (
                            <LogOut className="w-5 h-5 text-[#f97316] group-hover/btn:scale-110 transition-all" />
                          )}
                        </button>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AnimationWrapper>
  );
}

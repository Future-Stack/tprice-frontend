"use client";

import React, { useState } from "react";
import { ClipboardList, ChevronDown, Loader2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useUpdateLogsSettingsMutation } from "@/hooks/useAdminSettings";
import { logRetentionToPeriod, periodToLogRetentionDays } from "./types";
import type { AuditLogsSettingsTabProps } from "./types";

export function AuditLogsSettingsTab({ settings }: AuditLogsSettingsTabProps) {
  const [auditLogs, setAuditLogs] = useState({
    retentionPeriod: logRetentionToPeriod(settings?.logRetentionDays),
    detailedLogin: settings?.detailedLogging ?? false,
  });

  const updateLogsSettingsMutation = useUpdateLogsSettingsMutation();

  const handleSaveAuditLogs = () => {
    updateLogsSettingsMutation.mutate({
      logRetentionDays: periodToLogRetentionDays(auditLogs.retentionPeriod),
      detailedLogging: auditLogs.detailedLogin,
    });
  };

  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-8">
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Log retention
            </h2>
          </div>

          <div className="space-y-10">
            {/* Retention Period Dropdown */}
            <div className="space-y-3 max-w-sm">
              <label className="text-[13px] font-medium text-[#666]">
                Retention Period
              </label>
              <div className="relative">
                <select
                  value={auditLogs.retentionPeriod}
                  onChange={(e) =>
                    setAuditLogs((prev) => ({
                      ...prev,
                      retentionPeriod: e.target.value,
                    }))
                  }
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="7 days">7 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="Forever">Forever</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-[#666]" />
                </div>
              </div>
            </div>

            {/* Detailed Login Toggle */}
            <div className="flex items-center justify-between group">
              <div className="space-y-1.5">
                <h4
                  className={`text-[17px] md:text-[19px] font-medium transition-colors ${
                    auditLogs.detailedLogin ? "text-white" : "text-[#aaa]"
                  }`}
                >
                  Detailed Login
                </h4>
                <p className="text-[#666] text-sm max-w-md">
                  Capture detailed activity logs for all administrative actions and system events.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAuditLogs((prev) => ({
                    ...prev,
                    detailedLogin: !prev.detailedLogin,
                  }))
                }
                className={`relative inline-flex h-8 w-15 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  auditLogs.detailedLogin ? "bg-primary" : "bg-[#2A2A2A]"
                }`}
              >
                <div
                  className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${
                    auditLogs.detailedLogin
                      ? "translate-x-7.5 bg-black shadow-lg"
                      : "translate-x-1 bg-[#444]"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSaveAuditLogs}
            disabled={updateLogsSettingsMutation.isPending}
            className="bg-primary hover:bg-[#eab308] text-black px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer shadow-[#facc15]/10 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
          >
            {updateLogsSettingsMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );
}

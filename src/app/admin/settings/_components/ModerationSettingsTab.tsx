"use client";

import React, { useState } from "react";
import { CheckCircle2, ClipboardList, Search, Loader2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useUpdateModerationSettingsMutation } from "@/hooks/useAdminSettings";
import { ToggleItem, QualityItem } from "./types";
import type { ModerationSettingsTabProps } from "./types";

export function ModerationSettingsTab({ settings }: ModerationSettingsTabProps) {
  const [moderation, setModeration] = useState({
    requireApproval: settings?.requireAdminApproval ?? true,
    autoApproveDealers: settings?.autoApproveTrustedDealers ?? false,
    flagInactiveDeals: settings?.autoFlagInactiveDeals ?? true,
    flagMissingData: settings?.autoFlagMissingData ?? false,
  });

  const updateModerationSettingsMutation = useUpdateModerationSettingsMutation();

  const handleSaveModeration = () => {
    updateModerationSettingsMutation.mutate({
      requireAdminApproval: moderation.requireApproval,
      autoApproveTrustedDealers: moderation.autoApproveDealers,
      autoFlagInactiveDeals: moderation.flagInactiveDeals,
      autoFlagMissingData: moderation.flagMissingData,
    });
  };

  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-8">
        {/* Approval Workflow */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#facc15]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Approval Workflow</h2>
          </div>
          <div className="space-y-6">
            <ToggleItem
              label="Require admin approval for listings"
              subtext="Automatically flag stale listings"
              isActive={moderation.requireApproval}
              onToggle={() =>
                setModeration((prev) => ({
                  ...prev,
                  requireApproval: !prev.requireApproval,
                }))
              }
            />
            <ToggleItem
              label="Auto approve trusted dealers"
              subtext="All new listings must be manually approved"
              isActive={moderation.autoApproveDealers}
              onToggle={() =>
                setModeration((prev) => ({
                  ...prev,
                  autoApproveDealers: !prev.autoApproveDealers,
                }))
              }
            />
          </div>
        </section>

        {/* Listing quality requirements */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-[#facc15]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Listing quality requirements
            </h2>
          </div>
          <div className="space-y-5 ml-2">
            <QualityItem text="Minimum price must be set" />
            <QualityItem text="At least 1 image must be required" />
            <QualityItem text="Description minimum 50 characters" />
          </div>
        </section>

        {/* Auto flag rules */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-[#facc15]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Auto flag rules</h2>
          </div>
          <div className="space-y-6">
            <ToggleItem
              label="Flag Deals after 48 hours of inactivity"
              subtext="All new listings must be manually approved"
              isActive={moderation.flagInactiveDeals}
              onToggle={() =>
                setModeration((prev) => ({
                  ...prev,
                  flagInactiveDeals: !prev.flagInactiveDeals,
                }))
              }
            />
            <ToggleItem
              label="Flag listings with missing Data"
              subtext="Flag incomplete listings submissions"
              isActive={moderation.flagMissingData}
              onToggle={() =>
                setModeration((prev) => ({
                  ...prev,
                  flagMissingData: !prev.flagMissingData,
                }))
              }
            />
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSaveModeration}
            disabled={updateModerationSettingsMutation.isPending}
            className="bg-[#facc15] hover:bg-[#eab308] text-black px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#facc15]/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {updateModerationSettingsMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );
}

"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUpdateGeneralSettingsMutation } from "@/hooks/useAdminSettings";
import { NotificationToggle } from "./types";
import type { GeneralSettingsTabProps } from "./types";

export function GeneralSettingsTab({ settings }: GeneralSettingsTabProps) {
  const [notifications, setNotifications] = useState({
    newListing: settings?.notifyNewListings ?? true,
    dealFlagged: settings?.notifyFlaggedDeals ?? true,
    dealerActivity: settings?.notifyDealerActivity ?? false,
  });

  const updateGeneralSettingsMutation = useUpdateGeneralSettingsMutation();

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    updateGeneralSettingsMutation.mutate({
      notifyNewListings: notifications.newListing,
      notifyFlaggedDeals: notifications.dealFlagged,
      notifyDealerActivity: notifications.dealerActivity,
    });
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Notification
        </h2>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-[13px] font-medium text-[#666]">Alert Type</span>
            <span className="text-[13px] font-medium text-[#666]">Email</span>
          </div>

          <div className="space-y-1 mb-10">
            <NotificationToggle
              label="New Listing Submissions"
              isActive={notifications.newListing}
              onToggle={() => toggleNotification("newListing")}
            />
            <NotificationToggle
              label="Deal Flagged Alerts"
              isActive={notifications.dealFlagged}
              onToggle={() => toggleNotification("dealFlagged")}
            />
            <NotificationToggle
              label="Dealer activity alerts"
              isActive={notifications.dealerActivity}
              onToggle={() => toggleNotification("dealerActivity")}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotifications}
              disabled={updateGeneralSettingsMutation.isPending}
              className="bg-primary cursor-pointer text-black px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 hover:opacity-90"
            >
              {updateGeneralSettingsMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

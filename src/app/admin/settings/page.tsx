"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useAdminSettingsQuery } from "@/hooks/useAdminSettings";
import { useUserSessionsQuery } from "@/hooks/useSessions";
import {
  GeneralSettingsTab,
  ModerationSettingsTab,
  SecuritySettingsTab,
  AuditLogsSettingsTab,
} from "./_components";

const tabs = ["General", "Moderation", "Security", "Audit and logs"] as const;
type TabType = (typeof tabs)[number];

export default function AdminSettings() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const initialTab =
    tabs.find((t) => t.toLowerCase() === tabParam?.toLowerCase()) ?? "General";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const { data: settings, isLoading, isError, refetch } = useAdminSettingsQuery();
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    refetch: refetchSessions,
  } = useUserSessionsQuery();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab.toLowerCase());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "General":
        return {
          title: "General settings",
          subtitle: "Define your platform identity and defaults",
        };
      case "Moderation":
        return {
          title: "Moderation settings",
          subtitle: "Manage listings approval and automated flag rules",
        };
      case "Security":
        return {
          title: "Security settings",
          subtitle: "Configure platform security and access",
        };
      case "Audit and logs":
        return {
          title: "Audit and logs",
          subtitle: "Control listing approval workflow and quality rules",
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <AnimationWrapper>
      <div className="max-w-250 mb-20">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-white mb-2 leading-tight">
              {header.title}
            </h1>
            <p className="text-[#888] text-sm md:text-base">{header.subtitle}</p>
          </div>
          {isError && (
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </header>

        <div className="flex flex-wrap gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-black"
                  : "bg-[#1A1A1C] text-[#888] hover:text-white hover:bg-[#252528]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6 animate-pulse">
            <div className="h-6 bg-[#222] rounded w-1/4 mb-4" />
            <div className="h-12 bg-[#1A1A1A] rounded-xl w-full" />
            <div className="h-12 bg-[#1A1A1A] rounded-xl w-full" />
            <div className="h-12 bg-[#1A1A1A] rounded-xl w-full" />
          </div>
        ) : activeTab === "General" ? (
          <GeneralSettingsTab
            key={settings?.updatedAt || "general"}
            settings={settings}
          />
        ) : activeTab === "Moderation" ? (
          <ModerationSettingsTab
            key={settings?.updatedAt || "moderation"}
            settings={settings}
          />
        ) : activeTab === "Security" ? (
          <SecuritySettingsTab
            key={settings?.updatedAt || "security"}
            settings={settings}
            sessions={sessions}
            isSessionsLoading={isSessionsLoading}
            isSessionsError={isSessionsError}
            onRefetchSessions={refetchSessions}
          />
        ) : (
          <AuditLogsSettingsTab
            key={settings?.updatedAt || "audit"}
            settings={settings}
          />
        )}
      </div>
    </AnimationWrapper>
  );
}

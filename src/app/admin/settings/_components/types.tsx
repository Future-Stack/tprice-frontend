import type { AdminSettingsData } from "@/lib/api/settings";
import type { UserSession } from "@/lib/api/auth";

export type { AdminSettingsData, UserSession };

export function logRetentionToPeriod(days?: number): string {
  if (!days) return "30 days";
  if (days <= 7) return "7 days";
  if (days <= 30) return "30 days";
  if (days <= 90) return "90 days";
  if (days <= 365) return "1 year";
  return "Forever";
}

export function periodToLogRetentionDays(period: string): number {
  switch (period) {
    case "7 days":
      return 7;
    case "30 days":
      return 30;
    case "90 days":
      return 90;
    case "1 year":
      return 365;
    case "Forever":
      return 3650;
    default:
      return 30;
  }
}

export function parseUserAgent(uaString: string | null): {
  device: string;
  browser: string;
} {
  if (!uaString) return { device: "Unknown Device", browser: "Unknown Browser" };

  let device = "Desktop Device";
  if (/macintosh|mac os x/i.test(uaString)) {
    device = "Macbook / Mac";
  } else if (/iphone/i.test(uaString)) {
    device = "iPhone";
  } else if (/ipad/i.test(uaString)) {
    device = "iPad";
  } else if (/android/i.test(uaString)) {
    device = "Android Device";
  } else if (/windows/i.test(uaString)) {
    device = "Windows PC";
  } else if (/linux/i.test(uaString)) {
    device = "Linux PC";
  }

  let browser = "Web Browser";
  if (/firefox/i.test(uaString)) {
    browser = "Firefox";
  } else if (/edg/i.test(uaString)) {
    browser = "Edge";
  } else if (/chrome/i.test(uaString)) {
    browser = "Chrome";
  } else if (/safari/i.test(uaString)) {
    browser = "Safari";
  } else if (/opera|opr/i.test(uaString)) {
    browser = "Opera";
  }

  return { device, browser };
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function NotificationToggle({
  label,
  isActive,
  onToggle,
}: {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-white/3 last:border-0 group transition-all">
      <span
        className={`text-[15px] md:text-[17px] font-medium transition-colors ${
          isActive ? "text-white" : "text-[#888]"
        }`}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-7.5 w-14 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
          isActive ? "bg-primary" : "bg-[#2A2A2A]"
        }`}
      >
        <div
          className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${
            isActive ? "translate-x-6.5 bg-black shadow-lg" : "translate-x-1 bg-[#444]"
          }`}
        />
      </button>
    </div>
  );
}

export function ToggleItem({
  label,
  subtext,
  isActive,
  onToggle,
}: {
  label: string;
  subtext?: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 transition-all">
      <div className="space-y-1.5">
        <h4
          className={`text-[16px] md:text-[18px] font-medium transition-colors ${
            isActive ? "text-white" : "text-[#aaa]"
          }`}
        >
          {label}
        </h4>
        {subtext && (
          <p className="text-[#666] text-xs md:text-sm font-medium">{subtext}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-7.5 w-14 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
          isActive ? "bg-primary" : "bg-[#2A2A2A]"
        }`}
      >
        <div
          className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${
            isActive ? "translate-x-6.5 bg-black shadow-lg" : "translate-x-1 bg-[#444]"
          }`}
        />
      </button>
    </div>
  );
}

export function QualityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 py-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
      <span className="text-[#888] text-[15px] md:text-[16px] font-medium">
        {text}
      </span>
    </div>
  );
}

export interface GeneralSettingsTabProps {
  settings?: AdminSettingsData;
}

export interface ModerationSettingsTabProps {
  settings?: AdminSettingsData;
}

export interface SecuritySettingsTabProps {
  settings?: AdminSettingsData;
  sessions?: UserSession[];
  isSessionsLoading: boolean;
  isSessionsError: boolean;
  onRefetchSessions: () => void;
}

export interface AuditLogsSettingsTabProps {
  settings?: AdminSettingsData;
}

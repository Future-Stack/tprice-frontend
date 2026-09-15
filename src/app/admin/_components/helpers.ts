export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

export function formatPrice(priceStr?: string | number | null, currencyStr = "USD"): string {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currencyStr === "EUR" ? "€" : currencyStr === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
}

export function formatActivityAction(action: string): string {
  if (!action) return "Activity";
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getActivityDescription(activity: {
  action?: string;
  changes?: Record<string, unknown>;
  resource?: string;
}): string {
  const changes = activity.changes || {};
  if (activity.action === "LISTING_APPROVED") {
    return changes.status
      ? `Listing status: ${changes.status}${changes.approvedBy ? ` (${changes.approvedBy})` : ""}`
      : "Listing approved";
  }
  if (activity.action === "DEALER_APPROVAL") {
    return changes.status ? `Dealer profile status: ${changes.status}` : "Dealer profile approved";
  }
  if (activity.action === "USER_ROLE_UPDATED") {
    return changes.newRole
      ? `Role updated to ${changes.newRole} (was ${changes.previousRole || "BUYER"})`
      : "User role updated";
  }
  if (activity.action === "VIP_STATUS_GRANTED") {
    return changes.vipStatus !== undefined
      ? `VIP Status: ${changes.vipStatus ? "Granted" : "Revoked"}`
      : "VIP Status updated";
  }
  if (activity.action === "EVENT_CREATED") {
    return changes.title ? `Event: ${changes.title}` : "New event created";
  }
  return `Resource: ${activity.resource || "Item"}`;
}

export function getActivityStatusType(
  action: string,
  changes?: Record<string, unknown>
): "new" | "approved" | "closed" | "rejected" {
  const upper = (action || "").toUpperCase();
  if (upper.includes("REJECT") || upper.includes("FLAG")) return "rejected";
  if (
    upper.includes("APPROV") ||
    upper.includes("GRANT") ||
    changes?.status === "APPROVED" ||
    changes?.status === "LIVE"
  )
    return "approved";
  if (upper.includes("CLOSE") || upper.includes("UPDATE") || upper.includes("ROLE"))
    return "closed";
  return "new";
}

export function formatStage(stage: string): string {
  if (!stage) return "Active";
  return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
}

import {
  DashboardMetrics,
  PendingApproval,
  DealerSummary,
  RecentActivity,
  ActiveDeal,
} from "@/lib/api/dashboard";

export type { DashboardMetrics, PendingApproval, DealerSummary, RecentActivity, ActiveDeal };

export interface AdminStatsSectionProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
}

export interface AdminPendingApprovalsProps {
  pendingApprovals?: PendingApproval[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (id: string) => void;
  onReject: (item: PendingApproval) => void;
}

export interface AdminDealersSummaryProps {
  dealersSummary?: DealerSummary[];
  isLoading: boolean;
}

export interface AdminRecentActivityProps {
  recentActivities?: RecentActivity[];
  isLoading: boolean;
}

export interface AdminActiveDealsProps {
  activeDeals?: ActiveDeal[];
  isLoading: boolean;
}

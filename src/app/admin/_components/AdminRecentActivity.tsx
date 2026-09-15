import React from "react";
import {
  formatActivityAction,
  getActivityDescription,
  getActivityStatusType,
  formatRelativeTime,
} from "./helpers";
import { RecentActivitySkeleton } from "./AdminSkeletons";
import { AdminRecentActivityProps } from "./types";

export function AdminRecentActivity({ recentActivities, isLoading }: AdminRecentActivityProps) {
  return (
    <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E78F23]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
      <h2 className="text-2xl font-clash font-medium text-white mb-10">Recent Activity</h2>

      {isLoading ? (
        <RecentActivitySkeleton />
      ) : !recentActivities || recentActivities.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-4">No recent activity.</div>
      ) : (
        <div className="space-y-0">
          {recentActivities.map((activity, i) => {
            const statusType = getActivityStatusType(activity.action, activity.changes);
            const userName = activity.user
              ? `${activity.user.firstName} ${activity.user.lastName}`.trim()
              : "";

            return (
              <div
                key={activity.id || i}
                className={`flex items-start justify-between py-6 ${
                  i !== recentActivities.length - 1 ? "border-b border-white/5" : ""
                } group relative z-10`}
              >
                <div className="flex items-start gap-5">
                  <div className="mt-1.5 shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        statusType === "new"
                          ? "bg-primary shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                          : statusType === "approved"
                            ? "bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.6)]"
                            : statusType === "closed"
                              ? "bg-[#60A5FA] shadow-[0_0_12px_rgba(96,165,250,0.6)]"
                              : "bg-[#F87171] shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors">
                      {formatActivityAction(activity.action)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">
                      {getActivityDescription(activity)}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {userName && (
                    <div className="text-base font-bold text-white tracking-tight">
                      By {userName}
                    </div>
                  )}
                  <div className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminRecentActivity;

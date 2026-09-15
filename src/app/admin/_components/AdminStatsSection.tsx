import React from "react";
import { motion } from "framer-motion";
import { Users, FileText, Handshake, ListOrdered } from "lucide-react";
import { StatsSkeleton } from "./AdminSkeletons";
import { AdminStatsSectionProps } from "./types";

export function AdminStatsSection({ metrics, isLoading }: AdminStatsSectionProps) {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const stats = [
    {
      title: "Active Dealers",
      value: metrics?.activeDealersCount ?? 0,
      trend: "+2 this week",
      trendColor: "text-green-400",
      icon: <Users className="w-5 h-5 text-white" />,
      glow: "shadow-[0_0_20px_-5px_rgba(231,143,35,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(231,143,35,0.3)]",
    },
    {
      title: "Pending listings",
      value: metrics?.pendingListingsCount ?? 0,
      trend: `${metrics?.pendingListingsCount ?? 0} listings require approval`,
      trendColor: "text-white",
      icon: <FileText className="w-5 h-5 text-white" />,
      glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
    },
    {
      title: "Active Deals",
      value: metrics?.activeDealsCount ?? 0,
      trend: `${metrics?.activeDealsCount ?? 0} response required`,
      trendColor: "text-[#60A5FA]",
      icon: <Handshake className="w-5 h-5 text-white" />,
      glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
    },
    {
      title: "Total Listing",
      value: metrics?.totalListingsCount ?? 0,
      trend: `${metrics?.totalListingsCount ?? 0} total listings`,
      trendColor: "text-red-500",
      icon: <ListOrdered className="w-5 h-5 text-white" />,
      glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`group relative bg-[#111113] border border-white/5 rounded-2xl p-6 transition-all duration-500 ${stat.glow} ${stat.hoverGlow} hover:border-[#E78F23]/40`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary text-white rounded-xl border border-[#E78F23]/10 group-hover:scale-110 transition-transform duration-500">
              {stat.icon}
            </div>
            <span className="text-sm text-primary font-medium">{stat.title}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-clash font-bold text-white tracking-tighter">
              {stat.value}
            </span>
            <span
              className={`text-[11px] font-semibold uppercase tracking-widest ${stat.trendColor}`}
            >
              {stat.trend}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AdminStatsSection;

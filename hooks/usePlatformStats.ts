import { useQuery } from "@tanstack/react-query";
import { getPlatformStatsApi, PlatformStatsResponse } from "@/lib/api/platform";

export const PLATFORM_STATS_QUERY_KEYS = {
  stats: ["platform-stats"] as const,
};

export const formatAssetsValue = (value?: number): string => {
  if (value === undefined || value === null) return "$0";
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `$${b % 1 === 0 ? b : b.toFixed(1)} B+`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m : m.toFixed(1)} M+`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k : k.toFixed(1)} K+`;
  }
  return `$${value.toLocaleString()}+`;
};

/**
 * Custom React Query hook for fetching platform stats
 */
export const usePlatformStatsQuery = () => {
  return useQuery<PlatformStatsResponse, Error>({
    queryKey: PLATFORM_STATS_QUERY_KEYS.stats,
    queryFn: getPlatformStatsApi,
    staleTime: 5 * 60 * 1000,
  });
};

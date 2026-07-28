import apiClient from "./axios";

export interface PlatformStatsResponse {
  totalAssetsValue: number;
  vipMembersCount: number;
  clientSatisfactionPct: number;
}

/**
 * Fetch platform statistics (totalAssetsValue, vipMembersCount, clientSatisfactionPct)
 */
export const getPlatformStatsApi = async (): Promise<PlatformStatsResponse> => {
  const response = await apiClient.get<
    PlatformStatsResponse | { data: PlatformStatsResponse }
  >("/platform/stats");

  if (response.data && "data" in response.data && response.data.data) {
    return response.data.data;
  }
  return response.data as PlatformStatsResponse;
};

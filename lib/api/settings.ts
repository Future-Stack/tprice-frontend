import apiClient from "./axios";

export interface AdminSettingsData {
  id: number;
  notifyNewListings: boolean;
  notifyFlaggedDeals: boolean;
  notifyDealerActivity: boolean;
  requireAdminApproval: boolean;
  autoApproveTrustedDealers: boolean;
  autoFlagInactiveDeals: boolean;
  autoFlagMissingData: boolean;
  logRetentionDays: number;
  detailedLogging: boolean;
  updatedAt: string;
}

export type UpdateAdminSettingsInput = Partial<
  Omit<AdminSettingsData, "id" | "updatedAt">
>;

export interface UpdateGeneralSettingsPayload {
  notifyNewListings?: boolean;
  notifyFlaggedDeals?: boolean;
  notifyDealerActivity?: boolean;
}

export interface UpdateModerationSettingsPayload {
  requireAdminApproval?: boolean;
  autoApproveTrustedDealers?: boolean;
  autoFlagInactiveDeals?: boolean;
  autoFlagMissingData?: boolean;
}

export interface UpdateLogsSettingsPayload {
  logRetentionDays?: number;
  detailedLogging?: boolean;
}

/**
 * Fetch admin settings from GET /admin/settings
 */
export const getAdminSettingsApi = async (): Promise<AdminSettingsData> => {
  const response = await apiClient.get<AdminSettingsData>("/admin/settings");
  return response.data;
};

/**
 * Update general notification settings via PATCH /admin/settings/general
 */
export const updateGeneralSettingsApi = async (
  payload: UpdateGeneralSettingsPayload
): Promise<AdminSettingsData> => {
  const response = await apiClient.patch<AdminSettingsData>(
    "/admin/settings/general",
    payload
  );
  return response.data;
};

/**
 * Update moderation settings via PATCH /admin/settings/moderation
 */
export const updateModerationSettingsApi = async (
  payload: UpdateModerationSettingsPayload
): Promise<AdminSettingsData> => {
  const response = await apiClient.patch<AdminSettingsData>(
    "/admin/settings/moderation",
    payload
  );
  return response.data;
};

/**
 * Update audit and logs settings via PATCH /admin/settings/logs
 */
export const updateLogsSettingsApi = async (
  payload: UpdateLogsSettingsPayload
): Promise<AdminSettingsData> => {
  const response = await apiClient.patch<AdminSettingsData>(
    "/admin/settings/logs",
    payload
  );
  return response.data;
};

/**
 * Update admin settings via PATCH /admin/settings (or fallback PUT /admin/settings)
 */
export const updateAdminSettingsApi = async (
  payload: UpdateAdminSettingsInput
): Promise<AdminSettingsData> => {
  try {
    const response = await apiClient.patch<AdminSettingsData>(
      "/admin/settings",
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 405 || error.response?.status === 404) {
      const fallbackResponse = await apiClient.put<AdminSettingsData>(
        "/admin/settings",
        payload
      );
      return fallbackResponse.data;
    }
    throw error;
  }
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminSettingsApi,
  updateAdminSettingsApi,
  updateGeneralSettingsApi,
  updateModerationSettingsApi,
  updateLogsSettingsApi,
  AdminSettingsData,
  UpdateAdminSettingsInput,
  UpdateGeneralSettingsPayload,
  UpdateModerationSettingsPayload,
  UpdateLogsSettingsPayload,
} from "@/lib/api/settings";

export const ADMIN_SETTINGS_QUERY_KEYS = {
  settings: ["admin", "settings"] as const,
};

/**
 * Custom React Query hook to fetch admin settings
 */
export const useAdminSettingsQuery = () => {
  return useQuery<AdminSettingsData>({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
    queryFn: getAdminSettingsApi,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Custom React Query hook to update general notification settings via PATCH /admin/settings/general
 */
export const useUpdateGeneralSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGeneralSettingsPayload) =>
      updateGeneralSettingsApi(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData<AdminSettingsData>(
        ADMIN_SETTINGS_QUERY_KEYS.settings,
        (oldData) => (oldData ? { ...oldData, ...updatedSettings } : updatedSettings)
      );
      queryClient.invalidateQueries({
        queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
      });
      toast.success("General notification settings updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update general settings";
      toast.error(message);
    },
  });
};

/**
 * Custom React Query hook to update moderation settings via PATCH /admin/settings/moderation
 */
export const useUpdateModerationSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateModerationSettingsPayload) =>
      updateModerationSettingsApi(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData<AdminSettingsData>(
        ADMIN_SETTINGS_QUERY_KEYS.settings,
        (oldData) => (oldData ? { ...oldData, ...updatedSettings } : updatedSettings)
      );
      queryClient.invalidateQueries({
        queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
      });
      toast.success("Moderation settings updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update moderation settings";
      toast.error(message);
    },
  });
};

/**
 * Custom React Query hook to update audit and logs settings via PATCH /admin/settings/logs
 */
export const useUpdateLogsSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLogsSettingsPayload) =>
      updateLogsSettingsApi(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData<AdminSettingsData>(
        ADMIN_SETTINGS_QUERY_KEYS.settings,
        (oldData) => (oldData ? { ...oldData, ...updatedSettings } : updatedSettings)
      );
      queryClient.invalidateQueries({
        queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
      });
      toast.success("Audit and log settings updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update audit and log settings";
      toast.error(message);
    },
  });
};

/**
 * Custom React Query hook to update admin settings
 */
export const useUpdateAdminSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdminSettingsInput) =>
      updateAdminSettingsApi(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData<AdminSettingsData>(
        ADMIN_SETTINGS_QUERY_KEYS.settings,
        updatedSettings
      );
      queryClient.invalidateQueries({
        queryKey: ADMIN_SETTINGS_QUERY_KEYS.settings,
      });
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update settings";
      toast.error(message);
    },
  });
};

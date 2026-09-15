import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getNotificationsApi,
  markNotificationAsReadApi,
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationItem,
} from "@/lib/api/notifications";

import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/useAuthStore";

export const NOTIFICATIONS_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (params?: GetNotificationsParams) =>
    ["notifications", "list", params] as const,
};

/**
 * React Query hook to fetch user notifications with caching
 */
export const useNotificationsQuery = (
  params?: GetNotificationsParams,
  options?: { enabled?: boolean },
) => {
  const storeToken = useAuthStore((state) => state.token);
  const hasToken =
    !!storeToken ||
    (typeof window !== "undefined" &&
      !!(
        Cookies.get("accessToken") ||
        Cookies.get("token") ||
        Cookies.get("access_token")
      ));

  return useQuery<GetNotificationsResponse>({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(params),
    queryFn: () => getNotificationsApi(params),
    enabled: (options?.enabled ?? true) && hasToken,
    staleTime: 15 * 1000, // 15 seconds stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: (failureCount, error: any) => {
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.response?.status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchInterval: hasToken ? 30 * 1000 : false, // auto refetch every 30s only when authenticated
  });
};

/**
 * React Query hook to mark a notification as read with optimistic UI update
 */
export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationItem,
    Error,
    string,
    { previousQueries: [readonly unknown[], GetNotificationsResponse | undefined][] }
  >({
    mutationFn: (id: string) => markNotificationAsReadApi(id),
    onMutate: async (id: string) => {
      // Cancel outgoing queries for notifications
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });

      // Snapshot previous queries
      const previousQueries = queryClient.getQueriesData<GetNotificationsResponse>({
        queryKey: NOTIFICATIONS_QUERY_KEYS.all,
      });

      // Optimistically update notifications in all cached lists
      queryClient.setQueriesData<GetNotificationsResponse>(
        { queryKey: NOTIFICATIONS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          let wasUnread = false;
          const updatedData = oldData.data.map((item) => {
            if (item.id === id) {
              if (!item.isRead) wasUnread = true;
              return { ...item, isRead: true, updatedAt: new Date().toISOString() };
            }
            return item;
          });

          return {
            ...oldData,
            data: updatedData,
            unreadCount: wasUnread
              ? Math.max(0, (oldData.unreadCount || 0) - 1)
              : oldData.unreadCount,
          };
        }
      );

      return { previousQueries };
    },
    onError: (err, id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to mark notification as read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
};

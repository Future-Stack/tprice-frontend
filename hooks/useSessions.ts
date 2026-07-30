import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserSessionsApi,
  revokeUserSessionApi,
  UserSession,
} from "@/lib/api/auth";

export const SESSIONS_QUERY_KEYS = {
  sessions: ["auth", "sessions"] as const,
};

/**
 * Custom React Query hook to fetch active user sessions
 */
export const useUserSessionsQuery = () => {
  return useQuery<UserSession[]>({
    queryKey: SESSIONS_QUERY_KEYS.sessions,
    queryFn: getUserSessionsApi,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Custom React Query hook to revoke a session by session ID
 */
export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => revokeUserSessionApi(sessionId),
    onSuccess: (data, sessionId) => {
      queryClient.setQueryData<UserSession[]>(
        SESSIONS_QUERY_KEYS.sessions,
        (oldData) =>
          oldData
            ? oldData.filter((s) => s.id !== (data?.id || sessionId))
            : []
      );
      queryClient.invalidateQueries({
        queryKey: SESSIONS_QUERY_KEYS.sessions,
      });
      toast.success(data?.message || "Session revoked successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to revoke session";
      toast.error(message);
    },
  });
};

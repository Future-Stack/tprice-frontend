import { useQuery, useMutation, useQueryClient, keepPreviousData, QueryKey } from "@tanstack/react-query";
import {
  getAdminUsersApi,
  updateAdminUserStatusApi,
  deleteAdminUserApi,
  getVipStatusApi,
  claimVipTrialApi,
  GetAdminUsersParams,
  AdminUsersResponse,
  UpdateUserStatusPayload,
  DeleteUserResponse,
  VipStatusResponse,
  ClaimVipTrialResponse,
} from "@/lib/api/users";
import { AUTH_QUERY_KEYS } from "./useAuth";

export const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  admin: (params: GetAdminUsersParams) => ["users", "admin", params] as const,
  detail: (id: string) => ["users", "detail", id] as const,
  vipStatus: () => ["users", "vip-status"] as const,
};

/**
 * Custom React Query hook for fetching admin users with pagination & filter parameters
 */
export const useAdminUsersQuery = (
  params: GetAdminUsersParams = { page: 1, limit: 10 }
) => {
  return useQuery<AdminUsersResponse>({
    queryKey: USERS_QUERY_KEYS.admin(params),
    queryFn: () => getAdminUsersApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time for admin user data
    gcTime: 10 * 60 * 1000, // 10 minutes cache gc
    placeholderData: keepPreviousData, // smooth data transitions during page/filter updates
    retry: 2,
  });
};

/**
 * Hook to update user status (role, verification, VIP status)
 * Includes optimistic updates for instant UI feedback.
 */
export const useUpdateAdminUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserStatusPayload }) =>
      updateAdminUserStatusApi(id, payload),

    onMutate: async ({ id, payload }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEYS.all });

      // Snapshot previous query states
      const previousQueries = queryClient.getQueriesData<AdminUsersResponse>({
        queryKey: USERS_QUERY_KEYS.all,
      });

      // Optimistically update matching user in cache
      queryClient.setQueriesData<AdminUsersResponse>(
        { queryKey: USERS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((user) =>
              user.id === id
                ? {
                    ...user,
                    ...(payload.isVerified !== undefined ? { isVerified: payload.isVerified } : {}),
                    ...(payload.vipStatus !== undefined ? { vipStatus: payload.vipStatus } : {}),
                    ...(payload.role !== undefined ? { role: payload.role } : {}),
                  }
                : user
            ),
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _variables, context) => {
      // Rollback cache on mutation failure
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Invalidate queries to get fresh server data
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};

interface DeleteUserMutationContext {
  previousQueries: [QueryKey, AdminUsersResponse | undefined][];
}

/**
 * Hook to delete an admin user
 * Includes optimistic update for instant smooth UI response.
 */
export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, Error, string, DeleteUserMutationContext>({
    mutationFn: (id: string) => deleteAdminUserApi(id),

    onMutate: async (id: string) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEYS.all });

      // Snapshot previous query states
      const previousQueries = queryClient.getQueriesData<AdminUsersResponse>({
        queryKey: USERS_QUERY_KEYS.all,
      });

      // Optimistically remove user from matching queries instantly
      queryClient.setQueriesData<AdminUsersResponse>(
        { queryKey: USERS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== id),
            meta: oldData.meta
              ? { ...oldData.meta, total: Math.max(0, oldData.meta.total - 1) }
              : oldData.meta,
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _variables, context) => {
      // Rollback cache on mutation failure
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Invalidate queries to sync with server state
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};

export const useDeleteUserMutation = useDeleteAdminUserMutation;

/**
 * Hook to fetch current user's VIP status & subscription information via GET /users/me/vip-status
 */
export const useVipStatusQuery = () => {
  return useQuery<VipStatusResponse>({
    queryKey: USERS_QUERY_KEYS.vipStatus(),
    queryFn: () => getVipStatusApi(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to claim the 3-Month Free VIP Trial via POST /users/me/claim-vip-trial
 */
export const useClaimVipTrialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ClaimVipTrialResponse, Error, void>(
    {
      mutationFn: () => claimVipTrialApi(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.vipStatus() });
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
        queryClient.invalidateQueries({ queryKey: ["buyer", "dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["listings"] });
      },
    }
  );
};


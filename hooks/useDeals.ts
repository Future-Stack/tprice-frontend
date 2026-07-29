import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getDealsApi,
  getAdminDealsApi,
  getDealDetailApi,
  getDealMessagesApi,
  sendDealMessageApi,
  GetDealsParams,
  GetDealsResponse,
  DealItem,
  DealMessage,
} from "@/lib/api/deals";

export const DEALS_QUERY_KEYS = {
  all: ["deals"] as const,
  list: (params?: GetDealsParams) => ["deals", "list", params] as const,
  detail: (id: string) => ["deals", "detail", id] as const,
  messages: (dealId: string) => ["deals", "messages", dealId] as const,
};

/**
 * React Query hook to fetch user deals (Buyer/Seller) with caching and pagination
 */
export const useDealsQuery = (
  params?: GetDealsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<GetDealsResponse>({
    queryKey: DEALS_QUERY_KEYS.list(params),
    queryFn: () => getDealsApi(params),
    staleTime: 15 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * React Query hook to fetch admin deals with caching and pagination
 */
export const useAdminDealsQuery = (params?: GetDealsParams) => {
  return useQuery<GetDealsResponse>({
    queryKey: DEALS_QUERY_KEYS.list(params),
    queryFn: () => getAdminDealsApi(params),
    staleTime: 30 * 1000, // 30 seconds stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
  });
};

/**
 * React Query hook to fetch a single deal by ID
 */
export const useDealDetailQuery = (dealId: string) => {
  return useQuery<DealItem>({
    queryKey: DEALS_QUERY_KEYS.detail(dealId),
    queryFn: () => getDealDetailApi(dealId),
    enabled: Boolean(dealId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * React Query hook to fetch deal messages with auto-refetching/polling
 */
export const useDealMessagesQuery = (dealId?: string) => {
  return useQuery<DealMessage[]>({
    queryKey: DEALS_QUERY_KEYS.messages(dealId || ""),
    queryFn: async () => {
      try {
        return await getDealMessagesApi(dealId!);
      } catch (e) {
        // Return empty array if backend endpoint returns 404/error for deals without messages yet
        return [];
      }
    },
    enabled: Boolean(dealId),
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000, // Poll every 10 seconds for dynamic live updates
    retry: 1,
  });
};

/**
 * React Query mutation hook to send a deal message with optimistic UI updates
 */
export const useSendDealMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DealMessage,
    Error,
    { dealId: string; message: string },
    { previousMessages?: DealMessage[] }
  >({
    mutationFn: ({ dealId, message }) => sendDealMessageApi(dealId, { message }),
    onMutate: async ({ dealId, message }) => {
      await queryClient.cancelQueries({
        queryKey: DEALS_QUERY_KEYS.messages(dealId),
      });

      const previousMessages = queryClient.getQueryData<DealMessage[]>(
        DEALS_QUERY_KEYS.messages(dealId)
      );

      const optimisticMsg: DealMessage = {
        id: `temp-${Date.now()}`,
        dealId,
        senderId: "temp-buyer",
        message,
        createdAt: new Date().toISOString(),
        sender: null,
      };

      if (previousMessages) {
        queryClient.setQueryData<DealMessage[]>(
          DEALS_QUERY_KEYS.messages(dealId),
          [...previousMessages, optimisticMsg]
        );
      } else {
        queryClient.setQueryData<DealMessage[]>(
          DEALS_QUERY_KEYS.messages(dealId),
          [optimisticMsg]
        );
      }

      return { previousMessages };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData<DealMessage[]>(
          DEALS_QUERY_KEYS.messages(variables.dealId),
          context.previousMessages
        );
      }
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to send message";
      toast.error(errMsg);
    },
    onSuccess: (data, variables) => {
      toast.success("Message sent successfully");
      queryClient.invalidateQueries({
        queryKey: DEALS_QUERY_KEYS.messages(variables.dealId),
      });
      queryClient.invalidateQueries({
        queryKey: DEALS_QUERY_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
      });
    },
  });
};



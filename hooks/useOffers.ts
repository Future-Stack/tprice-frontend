import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOffersApi,
  getOfferDetailApi,
  acceptOfferApi,
  createOfferApi,
  withdrawOfferApi,
  counterOfferApi,
  GetOffersParams,
  GetOffersResponse,
  OfferDetailItem,
  AcceptOfferResponse,
  WithdrawOfferResponse,
  CreateOfferPayload,
  CounterOfferPayload,
} from "@/lib/api/offers";

export const OFFERS_QUERY_KEYS = {
  all: ["offers"] as const,
  list: (params?: GetOffersParams) => ["offers", "list", params] as const,
  detail: (id: string) => ["offers", "detail", id] as const,
};

export interface AcceptOfferContext {
  previousQueries: [QueryKey, GetOffersResponse | undefined][];
  previousDetail?: OfferDetailItem;
}

/**
 * React Query hook to fetch offers with caching and stale time configuration
 */
export const useOffersQuery = (
  params?: GetOffersParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<GetOffersResponse>({
    queryKey: OFFERS_QUERY_KEYS.list(params),
    queryFn: () => getOffersApi(params),
    staleTime: 30 * 1000, // 30 seconds stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
    ...options,
  });
};

/**
 * React Query hook to fetch a single offer details by ID
 */
export const useOfferDetailQuery = (offerId: string) => {
  return useQuery<OfferDetailItem>({
    queryKey: OFFERS_QUERY_KEYS.detail(offerId),
    queryFn: () => getOfferDetailApi(offerId),
    enabled: Boolean(offerId),
    staleTime: 30 * 1000, // 30 seconds stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
  });
};

/**
 * React Query hook to create a new offer
 */
export const useCreateOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<OfferDetailItem, Error, CreateOfferPayload>({
    mutationFn: (payload: CreateOfferPayload) => createOfferApi(payload),
    onSuccess: (data) => {
      toast.success("Offer sent successfully!");
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all });
    },
    onError: (err) => {
      const errMsg =
        (err as any)?.response?.data?.message ||
        err.message ||
        "Failed to send offer";
      toast.error(errMsg);
    },
  });
};


/**
 * React Query hook to accept an offer with instant optimistic UI update
 */
export const useAcceptOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AcceptOfferResponse, Error, string, AcceptOfferContext>({
    mutationFn: (offerId: string) => acceptOfferApi(offerId),
    onMutate: async (offerId: string) => {
      // Cancel outgoing refetches so they don't overwrite optimistic updates
      await queryClient.cancelQueries({ queryKey: OFFERS_QUERY_KEYS.all });

      // Snapshot previous offers queries
      const previousQueries = queryClient.getQueriesData<GetOffersResponse>({
        queryKey: OFFERS_QUERY_KEYS.all,
      });

      // Optimistically update offer status to "ACCEPTED" in all cached lists
      queryClient.setQueriesData<GetOffersResponse>(
        { queryKey: OFFERS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((offer) => {
              if (offer.id === offerId) {
                return {
                  ...offer,
                  status: "ACCEPTED",
                  updatedAt: new Date().toISOString(),
                };
              }
              return offer;
            }),
          };
        }
      );

      // Optimistically update detail query
      queryClient.setQueryData<OfferDetailItem>(
        OFFERS_QUERY_KEYS.detail(offerId),
        (oldDetail) => {
          if (!oldDetail) return oldDetail;
          return {
            ...oldDetail,
            status: "ACCEPTED",
            updatedAt: new Date().toISOString(),
          };
        }
      );

      return { previousQueries };
    },
    onError: (err, offerId, context) => {
      // Rollback optimistic cache update
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const errMsg =
        (err as any)?.response?.data?.message ||
        err.message ||
        "Failed to accept offer";
      toast.error(errMsg);
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Offer accepted! Deal initiated successfully."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all });
    },
  });
};

/**
 * React Query hook to withdraw an offer
 */
export const useWithdrawOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<WithdrawOfferResponse, Error, string>({
    mutationFn: (offerId: string) => withdrawOfferApi(offerId),
    onSuccess: (data) => {
      toast.success(data?.message || "Offer withdrawn successfully!");
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all });
    },
    onError: (err) => {
      const errMsg =
        (err as any)?.response?.data?.message ||
        err.message ||
        "Failed to withdraw offer";
      toast.error(errMsg);
    },
  });
};

export interface CounterOfferParams {
  offerId: string;
  payload: CounterOfferPayload;
}

/**
 * React Query hook to send a counter-offer for an existing offer
 */
export const useCounterOfferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<OfferDetailItem, Error, CounterOfferParams>({
    mutationFn: ({ offerId, payload }: CounterOfferParams) =>
      counterOfferApi(offerId, payload),
    onSuccess: () => {
      toast.success("Counter offer sent successfully!");
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all });
    },
    onError: (err) => {
      const errMsg =
        (err as any)?.response?.data?.message ||
        err.message ||
        "Failed to send counter offer";
      toast.error(errMsg);
    },
  });
};


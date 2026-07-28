import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  createContactInquiryApi,
  getContactInfoApi,
  getAdminContactInquiriesApi,
  updateAdminContactInquiryApi,
  ContactInquiryPayload,
  ContactInquiryResponse,
  ContactInfoResponse,
  GetContactInquiriesParams,
  ContactInquiriesResponse,
  UpdateContactInquiryPayload,
  ContactInquiryItem,
} from "@/lib/api/contact";

export const CONTACT_QUERY_KEYS = {
  all: ["admin", "contact-inquiries"] as const,
  info: ["contact-info"] as const,
  adminInquiries: (params: GetContactInquiriesParams) =>
    ["admin", "contact-inquiries", params] as const,
};

/**
 * Custom React Query hook for fetching contact information
 */
export const useContactInfoQuery = () => {
  return useQuery<ContactInfoResponse, Error>({
    queryKey: CONTACT_QUERY_KEYS.info,
    queryFn: getContactInfoApi,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Custom React Query hook for submitting contact inquiries
 */
export const useContactInquiryMutation = () => {
  return useMutation<ContactInquiryResponse, Error, ContactInquiryPayload>({
    mutationFn: (payload: ContactInquiryPayload) => createContactInquiryApi(payload),
  });
};

/**
 * Custom React Query hook for admin fetching contact inquiries with pagination & filters
 */
export const useAdminContactInquiriesQuery = (
  params: GetContactInquiriesParams = { page: 1, limit: 10 }
) => {
  return useQuery<ContactInquiriesResponse, Error>({
    queryKey: CONTACT_QUERY_KEYS.adminInquiries(params),
    queryFn: () => getAdminContactInquiriesApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData, // smooth data transitions during pagination/filters
    retry: 2,
  });
};

/**
 * Custom React Query hook for updating admin contact inquiry status & notes
 * Includes optimistic update and query cache invalidation.
 */
export const useUpdateAdminContactInquiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ContactInquiryItem,
    Error,
    { id: string; payload: UpdateContactInquiryPayload }
  >({
    mutationFn: ({ id, payload }) => updateAdminContactInquiryApi(id, payload),

    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: CONTACT_QUERY_KEYS.all });

      // Snapshot previous queries data
      const previousQueries = queryClient.getQueriesData<ContactInquiriesResponse>({
        queryKey: CONTACT_QUERY_KEYS.all,
      });

      // Optimistically update status and adminNotes in matching cache entries
      queryClient.setQueriesData<ContactInquiriesResponse>(
        { queryKey: CONTACT_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ...(payload.status ? { status: payload.status } : {}),
                    ...(payload.adminNotes !== undefined ? { adminNotes: payload.adminNotes } : {}),
                    updatedAt: new Date().toISOString(),
                  }
                : item
            ),
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _variables, context: any) => {
      // Rollback cache on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Refresh cache from server
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.all });
    },
  });
};




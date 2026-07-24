import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getEventsApi,
  getEventByIdApi,
  createEventApi,
  deleteEventApi,
  GetEventsParams,
  EventsResponse,
  EventItem,
  CreateEventInput,
} from "@/lib/api/events";

export const EVENTS_QUERY_KEYS = {
  all: ["events"] as const,
  list: (params: GetEventsParams) => ["events", "list", params] as const,
  detail: (id: string) => ["events", "detail", id] as const,
};

/**
 * Hook to fetch paginated events with category filtering and TanStack Query caching
 */
export const useGetEventsQuery = (params: GetEventsParams = { page: 1, limit: 10 }) => {
  return useQuery<EventsResponse>({
    queryKey: EVENTS_QUERY_KEYS.list(params),
    queryFn: () => getEventsApi(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache garbage collection time
    placeholderData: keepPreviousData, // smooth data transitions during page / tab changes
  });
};

/**
 * Hook to fetch single event details by ID
 */
export const useGetEventByIdQuery = (id: string) => {
  return useQuery<EventItem>({
    queryKey: EVENTS_QUERY_KEYS.detail(id),
    queryFn: () => getEventByIdApi(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new event
 */
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventInput) => createEventApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete an event
 */
export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
    },
  });
};

import apiClient from "./axios";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  description: string;
  eventDate: string;
  location: string;
  coverImageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    registrations: number;
  };
}

export interface EventsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventsResponse {
  data: EventItem[];
  meta: EventsMeta;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const getEventsApi = async (params?: GetEventsParams): Promise<EventsResponse> => {
  const response = await apiClient.get<EventsResponse>("/events", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      ...(params?.category && params.category !== "ALL" ? { category: params.category } : {}),
      ...(params?.search ? { search: params.search } : {}),
    },
  });
  return response.data;
};

export const getEventByIdApi = async (id: string): Promise<EventItem> => {
  const response = await apiClient.get<EventItem>(`/events/${id}`);
  return response.data;
};

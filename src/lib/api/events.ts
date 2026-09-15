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
  status?: string;
  search?: string;
}

export interface CreateEventInput {
  title: string;
  category: string;
  description: string;
  eventDate: string;
  location: string;
  coverImageUrl?: string;
}

export interface UpdateEventInput {
  title?: string;
  category?: string;
  description?: string;
  eventDate?: string;
  location?: string;
  coverImageUrl?: string;
  status?: string;
}

export const getEventsApi = async (
  params?: GetEventsParams,
): Promise<EventsResponse> => {
  const response = await apiClient.get<EventsResponse>("/events", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      ...(params?.category && params.category !== "ALL"
        ? { category: params.category }
        : {}),
      ...(params?.status && params.status !== "ALL"
        ? { status: params.status }
        : {}),
      ...(params?.search ? { search: params.search } : {}),
    },
  });
  return response.data;
};

export const getEventByIdApi = async (id: string): Promise<EventItem> => {
  const response = await apiClient.get<EventItem>(`/events/${id}`);
  return response.data;
};

export const createEventApi = async (
  data: CreateEventInput,
): Promise<EventItem> => {
  const response = await apiClient.post<EventItem>("/events", data);
  return response.data;
};

export const updateEventApi = async (
  id: string,
  data: UpdateEventInput,
): Promise<EventItem> => {
  const response = await apiClient.patch<EventItem>(`/events/${id}`, data);
  return response.data;
};

export interface RegisterEventInput {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  numberOfGuests: number;
  specialRequest?: string;
}

export interface RegisterEventResponse {
  registered: boolean;
  message: string;
  data: {
    id: string;
    eventId: string;
    userId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phone: string;
    numberOfGuests: number;
    specialRequest?: string;
    registeredAt: string;
  };
}

export const registerEventApi = async (
  eventId: string,
  data: RegisterEventInput,
): Promise<RegisterEventResponse> => {
  const response = await apiClient.post<RegisterEventResponse>(
    `/events/${eventId}/register`,
    data,
  );
  return response.data;
};

export const deleteEventApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/events/${id}`);
};


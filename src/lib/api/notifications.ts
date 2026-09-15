import apiClient from "./axios";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  data: NotificationItem[];
  unreadCount: number;
  meta: NotificationsMeta;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

/**
 * Fetch paginated user notifications
 */
export const getNotificationsApi = async (
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  const response = await apiClient.get<GetNotificationsResponse>(
    "/notifications",
    { params }
  );
  return response.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsReadApi = async (
  id: string
): Promise<NotificationItem> => {
  const response = await apiClient.patch<NotificationItem>(
    `/notifications/${id}/read`
  );
  return response.data;
};

import apiClient from "./axios";

export interface ContactInquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactInquiryResponse {
  message?: string;
  data?: unknown;
  success?: boolean;
}

export interface OfficeHours {
  sunday?: string;
  weekday?: string;
  saturday?: string;
}

export interface ContactInfoResponse {
  id?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  officeHours?: OfficeHours;
  mapEmbedUrl?: string | null;
  updatedAt?: string;
}

export interface ContactInquiryItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: "NEW" | "READ" | "RESPONDED" | "RESOLVED" | string;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInquiriesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactInquiriesResponse {
  data: ContactInquiryItem[];
  meta: ContactInquiriesMeta;
}

export interface GetContactInquiriesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface UpdateContactInquiryPayload {
  status?: "NEW" | "RESOLVED" | string;
  adminNotes?: string | null;
}

/**
 * Submit contact inquiry to /contact/inquiries
 */
export const createContactInquiryApi = async (
  payload: ContactInquiryPayload
): Promise<ContactInquiryResponse> => {
  const response = await apiClient.post<ContactInquiryResponse>(
    "/contact/inquiries",
    payload
  );
  return response.data;
};

/**
 * Fetch public contact information
 */
export const getContactInfoApi = async (): Promise<ContactInfoResponse> => {
  const response = await apiClient.get<
    ContactInfoResponse | { data: ContactInfoResponse }
  >("/contact/info");
  if (response.data && "data" in response.data && response.data.data) {
    return response.data.data;
  }
  return response.data as ContactInfoResponse;
};

/**
 * Fetch admin contact inquiries with pagination and filters
 */
export const getAdminContactInquiriesApi = async (
  params: GetContactInquiriesParams = { page: 1, limit: 10 }
): Promise<ContactInquiriesResponse> => {
  const response = await apiClient.get<ContactInquiriesResponse>(
    "/admin/contact/inquiries",
    { params }
  );
  return response.data;
};

/**
 * Update admin contact inquiry (PATCH /admin/contact/inquiries/:id)
 */
export const updateAdminContactInquiryApi = async (
  id: string,
  payload: UpdateContactInquiryPayload
): Promise<ContactInquiryItem> => {
  const response = await apiClient.patch<
    ContactInquiryItem | { data: ContactInquiryItem }
  >(`/admin/contact/inquiries/${id}`, payload);
  if (response.data && "data" in response.data && response.data.data) {
    return response.data.data;
  }
  return response.data as ContactInquiryItem;
};




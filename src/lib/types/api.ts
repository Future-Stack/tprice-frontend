export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  success?: boolean;
  message?: string;
  data: T[];
  meta: PaginatedMeta;
}

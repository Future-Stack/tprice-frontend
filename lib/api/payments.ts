import apiClient from "./axios";

export interface CreateCheckoutSessionPayload {
  type: string;
  targetId?: string;
  listingId?: string;
  successUrl: string;
  cancelUrl: string;
  [key: string]: any;
}

export interface TransactionMetadata {
  title?: string;
  userEmail?: string;
  [key: string]: any;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  targetId: string | null;
  amount: string;
  currency: string;
  status: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  metadata?: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  transaction?: Transaction;
}

/**
 * Creates a Stripe checkout session endpoint POST /payments/create-checkout-session
 */
export const createCheckoutSessionApi = async (
  payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> => {
  const response = await apiClient.post<
    CheckoutSessionResponse | { data: CheckoutSessionResponse }
  >("/payments/create-checkout-session", payload);

  const resData = response.data as any;
  if (resData?.data && resData?.data?.checkoutUrl) {
    return resData.data;
  }
  return resData;
};

/**
 * Returns a valid FQDN URL for payment success/cancel callbacks to satisfy backend @IsUrl() validators.
 * When running in local development (e.g. localhost), falls back to a valid FQDN domain.
 */
export const getPaymentReturnUrl = (path: string): string => {
  if (typeof window !== "undefined" && window.location.origin) {
    const origin = window.location.origin;
    const isLocal =
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      !origin.includes(".");
    if (!isLocal && origin.startsWith("http")) {
      return `${origin}${path}`;
    }
  }
  return `https://exoticworldinc.com${path}`;
};

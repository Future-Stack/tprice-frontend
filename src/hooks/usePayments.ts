import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSessionApi,
  CreateCheckoutSessionPayload,
  CheckoutSessionResponse,
} from "@/lib/api/payments";

export const useCreateCheckoutSessionMutation = () => {
  return useMutation<CheckoutSessionResponse, Error, CreateCheckoutSessionPayload>({
    mutationFn: (payload: CreateCheckoutSessionPayload) => createCheckoutSessionApi(payload),
  });
};

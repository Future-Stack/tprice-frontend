import { useMutation } from "@tanstack/react-query";
import { decodeVinApi, DecodedVehicleData } from "@/lib/api/vehicles";

export const VEHICLES_QUERY_KEYS = {
  all: ["vehicles"] as const,
  decodeVin: (vin: string) => ["vehicles", "decode-vin", vin] as const,
};

/**
 * Hook to decode vehicle VIN mutation
 */
export const useDecodeVinMutation = () => {
  return useMutation<DecodedVehicleData, Error, string>({
    mutationFn: (vin: string) => decodeVinApi(vin),
  });
};

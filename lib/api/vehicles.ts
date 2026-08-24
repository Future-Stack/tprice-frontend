import apiClient from "./axios";

export interface DecodedVehicleRaw {
  [key: string]: string | number | null | undefined;
}

export interface DecodedVehicleData {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  bodyClass?: string;
  engineDisplacementL?: string;
  engineCylinders?: number;
  engineHorsepower?: string;
  fuelType?: string;
  manufacturer?: string;
  vehicleType?: string;
  raw?: DecodedVehicleRaw;
}

/**
 * Decode vehicle VIN via GET /vehicles/decode-vin/:vin
 */
export const decodeVinApi = async (vin: string): Promise<DecodedVehicleData> => {
  const trimmedVin = vin.trim();
  const response = await apiClient.get<DecodedVehicleData>(
    `/vehicles/decode-vin/${encodeURIComponent(trimmedVin)}`,
  );
  return response.data;
};

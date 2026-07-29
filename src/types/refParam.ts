import { ImageRef } from "./facility";

// Reference Parameter (master data referensi item). Mirror model ReffParameter
// & endpoint /ref-parameter.

export interface RefParamApiDaum {
  _id: string;
  key: number;
  value: string;
  type: string;
  description: string;
  icon_id?: ImageRef | string | null;
  created_at?: string;
  createdAt?: string;
}

export interface RefParamPayload {
  value: string;
  type: string;
  description: string;
  icon_id?: string | null;
}

export interface RefParamListResponse {
  success: boolean;
  message: string;
  data: RefParamApiDaum[];
  page_size?: number;
  current_page?: number;
}

export interface RefParamSingleResponse {
  success: boolean;
  message: string;
  data?: RefParamApiDaum;
}

export interface RefParamTypesResponse {
  success: boolean;
  message: string;
  data: string[];
}

// Type khusus untuk opsi fasilitas ruangan (amenities) di RoomUnit.
export const AMENITY_REF_TYPE = "amenities";

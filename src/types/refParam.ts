// Reference Parameter (master data referensi item). Mirror model ReffParameter
// & endpoint /ref-parameter.

import { ImageRef } from "./api";

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

// Field teks form (icon/image upload dikelola state `iconId` terpisah).
export interface FormDataRefParamProps {
  value: string;
  type: string;
  description: string;
}

export interface RefParamTypesResponse {
  success: boolean;
  message: string;
  data: string[];
}

// Type khusus untuk opsi fasilitas ruangan (amenities) di RoomUnit.
export const AMENITY_REF_TYPE = "amenities";

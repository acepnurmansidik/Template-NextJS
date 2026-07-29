import { ImageRef } from "./facility";

// Kategori komponen layout. Model backend saat ini hanya mendukung "SHAPES".
export const LAYOUT_COMPONENT_CATEGORIES = ["SHAPES"] as const;
export type LayoutComponentCategory =
  (typeof LAYOUT_COMPONENT_CATEGORIES)[number];

export interface LayoutComponentApiDaum {
  _id: string;
  name: string;
  category: LayoutComponentCategory | string;
  image_id?: ImageRef | string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LayoutComponentPayload {
  name: string;
  category: string;
  image_id?: string | null;
}

export interface LayoutComponentListResponse {
  success: boolean;
  message: string;
  data: LayoutComponentApiDaum[];
  page_size?: number;
  current_page?: number;
}

export interface LayoutComponentSingleResponse {
  success: boolean;
  message: string;
  data?: LayoutComponentApiDaum;
}

// Satu grup komponen (hasil endpoint /layout-component/grouped).
export interface LayoutComponentGroup {
  category: string;
  items: LayoutComponentApiDaum[];
}

export interface LayoutComponentGroupedResponse {
  success: boolean;
  message: string;
  data: LayoutComponentGroup[];
}

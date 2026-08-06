// Product master data. Mirror endpoint /product.
// Referenced models (product_category_id, uom_id) may arrive either as raw
// id strings or populated objects depending on the endpoint.

export type Ref = string | { _id: string; name?: string; code?: string; prefix?: string };

// Referensi gambar: string id atau objek populate { _id, path }.
export type ImageRef = string | { _id: string; path?: string } | null;

export interface ProductApiDaum {
  _id: string;
  product_category_id: Ref;
  uom_id: Ref;
  product_image_id?: ImageRef;
  code: string;
  name: string;
  slug: string;
  description?: string;
  barcode?: string;
  purchase_price?: number;
  selling_price?: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductPayload {
  product_category_id: string;
  uom_id: string;
  product_image_id?: string | null;
  code?: string;
  name: string;
  description?: string;
  barcode?: string;
  purchase_price?: number;
  selling_price?: number;
  is_active?: boolean;
}

// Ambil id string dari ImageRef (string / objek populate).
export const imageRefId = (r?: ImageRef): string | null =>
  r ? (typeof r === "object" ? r._id : r) : null;

// Ambil path gambar dari ImageRef populate (untuk preview).
export const imageRefPath = (r?: ImageRef): string | null =>
  r && typeof r === "object" ? (r.path ?? null) : null;

// Ambil label yang bisa ditampilkan dari sebuah Ref (nama > kode > em dash).
export const refLabel = (r?: Ref): string =>
  r && typeof r === "object" ? (r.name ?? r.code ?? "—") : "—";

// Bentuk form yang dikumpulkan modal Create/Update. Nilai select disimpan
// sebagai id string (bukan daftar option yang di-fetch). `is_active` hanya
// dipakai oleh Update.
export interface FormDataProductProps {
  product_category_id: string | null;
  uom_id: string | null;
  product_image_id: string | null;
  code: string;
  name: string;
  barcode: string;
  description: string;
  purchase_price: number;
  selling_price: number;
  is_active?: boolean;
}

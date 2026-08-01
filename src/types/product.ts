// Product master data. Mirror endpoint /product.
// Referenced models (product_category_id, uom_id) may arrive either as raw
// id strings or populated objects depending on the endpoint.

export type Ref = string | { _id: string; name?: string; code?: string; prefix?: string };

export interface ProductApiDaum {
  _id: string;
  product_category_id: Ref;
  uom_id: Ref;
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
  code?: string;
  name: string;
  description?: string;
  barcode?: string;
  purchase_price?: number;
  selling_price?: number;
  is_active?: boolean;
}

// Ambil label yang bisa ditampilkan dari sebuah Ref (nama > kode > em dash).
export const refLabel = (r?: Ref): string =>
  r && typeof r === "object" ? (r.name ?? r.code ?? "—") : "—";

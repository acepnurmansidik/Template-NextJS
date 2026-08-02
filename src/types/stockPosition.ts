/* --------------------------- STOCK POSITION TYPES ------------------------ */

// Referensi bisa berupa string id atau object populate ({ _id, name?, code? }).
export type Ref = string | { _id: string; name?: string; code?: string };

// Bentuk data dari API (field ref bisa berupa id / object populate).
export interface StockPositionApiDaum {
  _id: string;
  product_id: Ref;
  warehouse_id: Ref;
  uom_id?: Ref | null;
  quantity?: number;
  reserved_quantity?: number;
  created_at?: string;
}

// Payload yang dikirim ke API (selalu berupa id string).
export interface StockPositionPayload {
  product_id: string;
  warehouse_id: string;
  uom_id?: string | null;
  quantity?: number;
  reserved_quantity?: number;
}

// Ambil label yang bisa dibaca dari sebuah ref (name > code > "—").
export const refLabel = (r?: Ref | null): string =>
  r && typeof r === "object" ? (r.name ?? r.code ?? "—") : "—";

// Ambil id string dari sebuah ref (untuk prefilled update form).
export const refId = (r?: Ref | null): string =>
  r ? (typeof r === "object" ? r._id : r) : "";

// Bentuk field yang dikumpulkan modal Create/Update. `uom_id` tidak disimpan di
// sini karena diturunkan otomatis dari product terpilih (read-only).
export interface FormDataStockPositionProps {
  product_id: string | null;
  warehouse_id: string | null;
  quantity: number;
  reserved_quantity: number;
}

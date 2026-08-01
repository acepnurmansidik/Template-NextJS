// Tipe & helper untuk fitur Stock Movement.

export type Ref = string | { _id: string; name?: string; code?: string };

export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUSTMENT = "ADJUSTMENT",
  TRANSFER = "TRANSFER",
}

export const MOVEMENT_TYPE_LABEL: Record<MovementType, string> = {
  IN: "Stock In",
  OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
  TRANSFER: "Transfer",
};

export interface StockMovementApiDaum {
  _id: string;
  product_id: Ref;
  warehouse_id: Ref;
  destination_warehouse_id?: Ref | null;
  uom_id?: Ref | null;
  type: MovementType;
  quantity: number;
  reference?: string;
  date?: string;
  note?: string;
  created_at?: string;
}

export interface StockMovementPayload {
  product_id: string;
  warehouse_id: string;
  destination_warehouse_id?: string | null;
  uom_id?: string | null;
  type: MovementType;
  quantity: number;
  reference?: string;
  date?: string;
  note?: string;
}

// Ambil label yang bisa ditampilkan dari sebuah Ref (populate object) —
// prioritas name, lalu code, lalu em-dash bila hanya string id / kosong.
export const refLabel = (r?: Ref | null): string =>
  r && typeof r === "object" ? (r.name ?? r.code ?? "—") : "—";

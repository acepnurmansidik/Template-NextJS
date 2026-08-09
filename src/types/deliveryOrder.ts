// Tipe mirror endpoint /delivery-order.
//
// Delivery Order (DO): dokumen pengeluaran barang STANDALONE (tidak berelasi
// ke PR/PO/GR). Satu header + banyak item (collection detail_product_items)
// memakai pola shared yang sama, namun tiap baris hanya menempel ke DO ini.
// Item hanya mencatat product + qty (tanpa nilai uang). Status:
//   PENDING (default) -> SHIPPED (via aksi "Kirim Barang").
// Saat dikirim, stok gudang sumber berkurang & StockMovement OUT dibuat.

import { PurchaseItemApiDaum, PurchaseItemPayload, Ref } from "./purchaseItem";

export enum DeliveryOrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
}

export const DO_STATUS_LABEL: Record<DeliveryOrderStatus, string> = {
  [DeliveryOrderStatus.PENDING]: "Pending",
  [DeliveryOrderStatus.SHIPPED]: "Shipped",
};

export interface DeliveryOrderApiDaum {
  _id: string;
  delivery_no: string;
  date: string;
  delivery_date?: string;
  recipient?: string;
  reference?: string;
  description?: string;
  // Gudang sumber (stok dikurangi dari sini saat dikirim).
  warehouse_id?: Ref | null;
  status: DeliveryOrderStatus;
  items: PurchaseItemApiDaum[];
  created_at?: string;
  updated_at?: string;
}

// Field header/scalar form (baris item & warehouse dikelola state terpisah).
export interface FormDataDeliveryOrderProps {
  date: string;
  delivery_date: string;
  recipient: string;
  reference: string;
  description: string;
}

// Payload create/update (items di-nest; status dikelola server via aksi ship).
export interface DeliveryOrderPayload {
  date: string;
  delivery_date?: string;
  recipient?: string;
  reference?: string;
  description?: string;
  warehouse_id: string;
  items: PurchaseItemPayload[];
}

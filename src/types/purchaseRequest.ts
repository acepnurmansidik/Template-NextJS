// Tipe mirror endpoint /purchase-request.
//
// Purchase Request (PR): permintaan pembelian. Satu header + banyak item
// (collection purchase_items). Default status DRAFT; naik ke SUBMITTED lewat
// tombol action di list. `purchase_order_id` adalah flag apakah PR ini sudah
// dibuatkan PO (opsional — PO bisa dibuat manual tanpa PR).

import {
  ProcurementStatus,
  PurchaseItemApiDaum,
  PurchaseItemPayload,
  Ref,
} from "./purchaseItem";

export interface PurchaseRequestApiDaum {
  _id: string;
  request_no: string;
  date: string;
  needed_date?: string;
  requested_by?: string;
  reference?: string;
  description?: string;
  status: ProcurementStatus;
  // Flag: terisi bila PR sudah dipakai/di-generate menjadi PO.
  purchase_order_id?: Ref | null;
  items: PurchaseItemApiDaum[];
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Field header/scalar form (baris item dikelola state `items` terpisah).
export interface FormDataPurchaseRequestProps {
  date: string;
  needed_date: string;
  requested_by: string;
  reference: string;
  description: string;
  status: ProcurementStatus;
}

// Payload create/update (items di-nest).
export interface PurchaseRequestPayload {
  date: string;
  needed_date?: string;
  requested_by?: string;
  reference?: string;
  description?: string;
  status?: ProcurementStatus;
  items: PurchaseItemPayload[];
}

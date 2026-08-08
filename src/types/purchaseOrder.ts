// Tipe mirror endpoint /purchase-order.
//
// Purchase Order (PO): dokumen pemesanan ke supplier. Bisa dibuat dari satu
// atau banyak Purchase Request (pr_ids) yang otomatis mengisi item, atau
// dibuat manual tanpa PR. Default status DRAFT; naik ke SUBMITTED lewat tombol
// action di list.

import {
  ProcurementStatus,
  PurchaseItemApiDaum,
  PurchaseItemPayload,
  Ref,
} from "./purchaseItem";

export interface PurchaseOrderApiDaum {
  _id: string;
  order_no: string;
  date: string;
  expected_date?: string;
  reference?: string;
  description?: string;
  status: ProcurementStatus;
  // PR sumber (opsional). Bisa kosong bila PO dibuat manual.
  pr_ids?: Ref[];
  // Supplier PO (opsional) — diisi otomatis saat PO dibuat (group per-supplier).
  supplier_id?: Ref | null;
  items: PurchaseItemApiDaum[];
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Field header/scalar form (baris item & pr_ids dikelola state terpisah).
export interface FormDataPurchaseOrderProps {
  date: string;
  expected_date: string;
  reference: string;
  description: string;
  status: ProcurementStatus;
}

// Payload create/update (items di-nest, pr_ids sebagai daftar id PR).
export interface PurchaseOrderPayload {
  date: string;
  expected_date?: string;
  reference?: string;
  description?: string;
  status?: ProcurementStatus;
  pr_ids?: string[];
  items: PurchaseItemPayload[];
}

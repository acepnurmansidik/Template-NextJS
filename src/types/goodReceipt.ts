// Tipe mirror endpoint /good-receipt.
//
// Good Receipt (GR): penerimaan barang atas satu / beberapa Purchase Order
// (po_ids). Item mengisi qty diterima (received_qty) per gudang. Status
// dihitung OTOMATIS dari received_qty (bukan dipilih manual):
//   DRAFT (belum diterima) / PARTIAL (sebagian) / RECEIVED (diterima penuh).

import { PurchaseItemApiDaum, PurchaseItemPayload, Ref } from "./purchaseItem";

export enum GoodReceiptStatus {
  DRAFT = "DRAFT",
  PARTIAL = "PARTIAL",
  RECEIVED = "RECEIVED",
}

export const GR_STATUS_LABEL: Record<GoodReceiptStatus, string> = {
  [GoodReceiptStatus.DRAFT]: "Draft",
  [GoodReceiptStatus.PARTIAL]: "Partial Received",
  [GoodReceiptStatus.RECEIVED]: "Full Received",
};

// Hitung status GR dari received_qty tiap item (samakan dengan backend):
// DRAFT (belum ada diterima) / RECEIVED (semua qty diterima) / PARTIAL.
export const deriveGrStatus = (
  items: { quantity: number; received_qty: number }[],
): GoodReceiptStatus => {
  if (!items.length) return GoodReceiptStatus.DRAFT;
  const anyReceived = items.some((it) => (Number(it.received_qty) || 0) > 0);
  if (!anyReceived) return GoodReceiptStatus.DRAFT;
  const allFull = items.every(
    (it) =>
      (Number(it.quantity) || 0) > 0 &&
      (Number(it.received_qty) || 0) >= (Number(it.quantity) || 0),
  );
  return allFull ? GoodReceiptStatus.RECEIVED : GoodReceiptStatus.PARTIAL;
};

// Mode gudang: SINGLE = semua item ke satu gudang (header); MULTIPLE = tiap
// item punya gudang sendiri.
export enum WarehouseMode {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
}

export interface GoodReceiptApiDaum {
  _id: string;
  receipt_no: string;
  date: string;
  received_date?: string;
  reference?: string;
  description?: string;
  status: GoodReceiptStatus;
  // PO yang diterima (bisa lebih dari satu).
  po_ids?: Ref[];
  warehouse_id?: Ref | null;
  warehouse_mode?: WarehouseMode;
  items: PurchaseItemApiDaum[];
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Field header/scalar form (baris item, po_ids & warehouse dikelola terpisah).
export interface FormDataGoodReceiptProps {
  date: string;
  received_date: string;
  reference: string;
  description: string;
}

// Payload create/update (items di-nest; status dihitung server).
export interface GoodReceiptPayload {
  date: string;
  received_date?: string;
  reference?: string;
  description?: string;
  po_ids: string[];
  warehouse_id?: string | null;
  warehouse_mode: WarehouseMode;
  items: PurchaseItemPayload[];
}

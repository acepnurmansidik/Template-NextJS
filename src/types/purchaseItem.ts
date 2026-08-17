// Tipe untuk collection "purchase_items" — detail item dari dokumen
// procurement (Purchase Request / Purchase Order / Good Receipt).
//
// Satu koleksi dipakai bersama ketiga dokumen; tiap baris ditandai oleh
// salah satu parent id (purchase_request_id / purchase_order_id /
// good_receipt_id) plus referensi product, uom, supplier, qty, & harga beli
// per item.

export type Ref =
  | string
  | {
      _id: string;
      name?: string;
      code?: string;
      prefix?: string;
      // Nomor dokumen bila ref berupa PR/PO yang di-populate (untuk tampilan
      // "item ini dari PR mana").
      request_no?: string;
      order_no?: string;
      // Supplier default produk (di-populate saat product_id di-populate) —
      // dipakai untuk auto-isi supplier item PO saat sumber dari PR.
      supplier_id?: Ref | null;
    };

// Ambil label yang bisa ditampilkan dari sebuah Ref (name > code > em dash).
export const refLabel = (r?: Ref | null): string =>
  r && typeof r === "object" ? (r.name ?? r.code ?? "—") : "—";

// Ambil id string dari sebuah Ref (string apa adanya, atau _id bila populate).
export const refId = (r?: Ref | null): string | null => {
  if (!r) return null;
  return typeof r === "object" ? r._id : r;
};

// Nomor dokumen (request_no / order_no) dari sebuah Ref populate.
export const refDocNo = (r?: Ref | null): string => {
  if (r && typeof r === "object") return r.request_no ?? r.order_no ?? "—";
  return "—";
};

// Label "CODE — Name" dari sebuah Ref populate (untuk cache tampilan).
export const refCodeName = (r?: Ref | null): string => {
  if (r && typeof r === "object") {
    const code = r.code ?? "";
    const name = r.name ?? "";
    if (code && name) return `${code} — ${name}`;
    return name || code || "";
  }
  return "";
};

export enum GoodReceiptStatus {
  DRAFT = "DRAFT",
  PARTIAL = "PARTIAL",
  RECEIVED = "RECEIVED",
}

// Status dokumen procurement. Default DRAFT; naik ke SUBMITTED lewat tombol
// action di list (setelah SUBMITTED dokumen dikunci — tak bisa edit/hapus).
export enum ProcurementStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  PARTIAL_ORDERED = "PARTIAL_ORDERED",
  ORDERED = "ORDERED",
  PARTIAL_RECEIVED = "PARTIAL_RECEIVED",
  RECEIVED = "RECEIVED",
  CLOSED = "CLOSED",
}

export const PROCUREMENT_STATUS_LABEL: Record<ProcurementStatus, string> = {
  [ProcurementStatus.DRAFT]: "Draft",
  [ProcurementStatus.SUBMITTED]: "Submitted",
  [ProcurementStatus.PARTIAL_ORDERED]: "Partial Ordered",
  [ProcurementStatus.ORDERED]: "Ordered",
  [ProcurementStatus.PARTIAL_RECEIVED]: "Partial Received",
  [ProcurementStatus.RECEIVED]: "Received",
  [ProcurementStatus.CLOSED]: "Closed",
};

// Status siklus satu baris item (detail_product_items.status).
//  PENDING -> ORDERED -> PARTIAL_RECEIVED -> RECEIVED
export enum DetailItemStatus {
  PENDING = "PENDING",
  ORDERED = "ORDERED",
  PARTIAL_RECEIVED = "PARTIAL_RECEIVED",
  RECEIVED = "RECEIVED",
}

export const DETAIL_ITEM_STATUS_LABEL: Record<DetailItemStatus, string> = {
  [DetailItemStatus.PENDING]: "Pending",
  [DetailItemStatus.ORDERED]: "Ordered",
  [DetailItemStatus.PARTIAL_RECEIVED]: "Partial Received",
  [DetailItemStatus.RECEIVED]: "Received",
};

// Satu baris item sebagaimana dikembalikan API (referensi bisa populate).
export interface PurchaseItemApiDaum {
  _id?: string;
  product_id: Ref;
  uom_id?: Ref | null;
  supplier_id?: Ref | null;
  warehouse_id?: Ref | null;
  purchase_request_id?: Ref | null;
  purchase_order_id?: Ref | null;
  good_receipt_id?: Ref | null;
  delivery_order_id?: Ref | null;
  quantity: number;
  // Qty yang benar-benar diterima (khusus Good Receipt).
  received_qty?: number;
  price: number;
  // Harga hasil update user (bila berbeda dari `price`, master product ikut
  // diperbarui di backend).
  new_price?: number;
  // Status siklus item (PENDING/ORDERED/PARTIAL_RECEIVED/RECEIVED).
  status?: DetailItemStatus;
  created_at?: string;
}

// Baris item pada form.
// - `source_pr_id`: form PO — menandai baris berasal dari PR mana (null = manual).
// - `source_item_ids`: form PO — _id detail item PR yang dipakai ulang (shared
//   doc). Bila > 1 berarti baris hasil gabung produk sama dari beberapa PR.
// - `received_qty` & `warehouse_id`: khusus form Good Receipt.
export interface PurchaseItemForm {
  product_id: string;
  uom_id: string | null;
  supplier_id: string | null;
  warehouse_id: string | null;
  quantity: number;
  received_qty: number;
  price: number;
  // Harga yang diedit user (PO). Kosong = mengikuti `price` (tidak ada update).
  new_price?: number;
  source_pr_id?: string | null;
  source_item_ids?: string[];
  // Label tampilan (frontend saja, tidak dikirim ke payload) — agar baris bisa
  // menampilkan produk/uom/supplier tanpa memuat seluruh daftar master.
  product_label?: string;
  uom_label?: string;
  supplier_label?: string;
}

// Bentuk item pada payload create/update (di-nest di payload dokumen induk;
// backend yang memecahnya ke collection purchase_items).
export interface PurchaseItemPayload {
  product_id: string;
  uom_id?: string | null;
  supplier_id?: string | null;
  warehouse_id?: string | null;
  quantity: number;
  received_qty?: number;
  price: number;
  new_price?: number;
  source_item_ids?: string[];
}

// Baris item kosong untuk inisialisasi form.
export const emptyPurchaseItem: PurchaseItemForm = {
  product_id: "",
  uom_id: null,
  supplier_id: null,
  warehouse_id: null,
  quantity: 1,
  received_qty: 0,
  price: 0,
  source_pr_id: null,
  source_item_ids: [],
  product_label: "",
  uom_label: "",
  supplier_label: "",
};

// Total nilai dari sekumpulan baris (qty * harga beli). Bila baris punya
// `new_price` (harga hasil edit user, mis. di PO) maka itu yang dipakai —
// sama seperti subtotal per baris — sehingga total ikut terkalkulasi saat
// harga diubah.
export const sumItems = (
  items: { quantity: number; price: number; new_price?: number }[],
): number => {
  const round2 = (v: number) => Math.round((Number(v) || 0) * 100) / 100;
  const unit = (it: { price: number; new_price?: number }) =>
    Number(it.new_price) > 0 ? Number(it.new_price) : Number(it.price) || 0;
  return round2(
    items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * unit(it), 0),
  );
};

// Ubah PurchaseItemApiDaum (populate) menjadi baris form yang bisa diedit.
// `sourcePrId` dipakai form PO untuk menandai asal baris.
export const apiItemToForm = (
  it: PurchaseItemApiDaum,
  sourcePrId: string | null = null,
): PurchaseItemForm => {
  // Supplier default produk (bila product_id di-populate membawa supplier_id).
  const productRef = it.product_id;
  const productSupplier =
    productRef && typeof productRef === "object"
      ? (productRef.supplier_id ?? null)
      : null;

  return {
    product_id: refId(it.product_id) ?? "",
    uom_id: refId(it.uom_id),
    // Supplier item; bila item belum punya supplier (mis. baris dari PR yang
    // tak menyimpan supplier), fallback ke supplier default produk.
    supplier_id: refId(it.supplier_id) ?? refId(productSupplier),
    warehouse_id: refId(it.warehouse_id),
    quantity: Number(it.quantity) || 0,
    received_qty: Number(it.received_qty) || 0,
    price: Number(it.price) || 0,
    product_label: refCodeName(it.product_id),
    uom_label: refCodeName(it.uom_id),
    // Label supplier item; fallback ke supplier default produk bila item belum
    // menyimpan supplier sendiri.
    supplier_label:
      refCodeName(it.supplier_id) || refCodeName(productSupplier),
    source_pr_id: sourcePrId,
    // _id detail item dipakai PO untuk reuse (shared doc) — HANYA bila item ini
    // memang milik sebuah PR (punya purchase_request_id). Item manual tidak
    // ditandai agar tetap diperlakukan sebagai baris baru.
    source_item_ids:
      it._id && refId(it.purchase_request_id) ? [String(it._id)] : [],
  };
};

// Ubah baris form menjadi item payload. `source_item_ids` hanya dikirim bila ada
// (dipakai PO untuk reuse detail PR).
export const formItemToPayload = (
  it: PurchaseItemForm,
): PurchaseItemPayload => {
  const price = Number(it.price) || 0;
  // new_price: pakai nilai edit user bila > 0, kalau tidak samakan dengan
  // `price` agar backend tidak menganggapnya sebagai perubahan harga.
  const new_price = Number(it.new_price) > 0 ? Number(it.new_price) : price;
  return {
    product_id: it.product_id,
    uom_id: it.uom_id,
    supplier_id: it.supplier_id,
    warehouse_id: it.warehouse_id,
    quantity: Number(it.quantity) || 0,
    received_qty: Number(it.received_qty) || 0,
    price,
    new_price,
    ...(it.source_item_ids && it.source_item_ids.length > 0
      ? { source_item_ids: it.source_item_ids }
      : {}),
  };
};

// Gabung baris berdasarkan product_id (dipakai PO): qty dijumlahkan &
// source_item_ids digabung. Baris tanpa source (manual) dibiarkan terpisah.
export const mergeItemsByProduct = (
  items: PurchaseItemForm[],
): PurchaseItemForm[] => {
  const merged: PurchaseItemForm[] = [];
  const indexByProduct = new Map<string, number>();
  for (const it of items) {
    const fromPr = (it.source_item_ids?.length ?? 0) > 0;
    if (!fromPr) {
      merged.push(it);
      continue;
    }
    const key = it.product_id;
    if (indexByProduct.has(key)) {
      const idx = indexByProduct.get(key)!;
      const cur = merged[idx];
      merged[idx] = {
        ...cur,
        quantity: (Number(cur.quantity) || 0) + (Number(it.quantity) || 0),
        source_item_ids: [
          ...(cur.source_item_ids ?? []),
          ...(it.source_item_ids ?? []),
        ],
      };
    } else {
      indexByProduct.set(key, merged.length);
      merged.push({ ...it });
    }
  }
  return merged;
};

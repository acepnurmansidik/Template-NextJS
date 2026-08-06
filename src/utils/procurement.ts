// Helper bersama untuk modal-modal Procurement (Purchase Request / Order /
// Good Receipt): sumber dropdown product & supplier, derivasi UOM + harga beli
// dari master product, serta kelas styling seragam.

import { apiGet } from "@/utils/api";
import { ListResponse } from "@/types/api";
import {
  apiItemToForm,
  PurchaseItemApiDaum,
  PurchaseItemForm,
  Ref,
  refId,
} from "@/types/purchaseItem";

export type Option = { value: string; label: string };

// Bentuk minimal record product dari /product (membawa uom_id + purchase_price).
export interface ProductSource {
  _id: string;
  code?: string;
  name?: string;
  uom_id?: Ref | null;
  purchase_price?: number;
}

// Bentuk minimal record supplier dari /supplier.
export interface SupplierSource {
  _id: string;
  code?: string;
  name?: string;
}

// Bentuk minimal record warehouse dari /warehouse.
export interface WarehouseSource {
  _id: string;
  code?: string;
  name?: string;
}

// Label "CODE — Name" (fallback ke salah satu bila kosong).
export const codeNameLabel = (d: {
  _id: string;
  code?: string;
  name?: string;
}): string =>
  d.code ? `${d.code} — ${d.name ?? ""}`.trim() : (d.name ?? d._id);

export const productOptionsFrom = (products: ProductSource[]): Option[] =>
  products.map((p) => ({ value: p._id, label: codeNameLabel(p) }));

// Opsi produk untuk AsyncSelect: cari server-side (search by name/code), batasi
// 5 hasil. `data` membawa product mentah (uom_id + purchase_price) untuk prefill.
export type ProductOption = Option & { data: ProductSource };
export const fetchProductOptions = async (
  search: string,
): Promise<ProductOption[]> => {
  try {
    const res = await apiGet<ListResponse<ProductSource>>(
      "/product",
      { search: search || "", limit: 5 },
      false,
    );
    return (res.data ?? []).map((p) => ({
      value: p._id,
      label: codeNameLabel(p),
      data: p,
    }));
  } catch {
    return [];
  }
};

export const supplierOptionsFrom = (suppliers: SupplierSource[]): Option[] =>
  suppliers.map((s) => ({ value: s._id, label: codeNameLabel(s) }));

export const warehouseOptionsFrom = (
  warehouses: WarehouseSource[],
): Option[] =>
  warehouses.map((w) => ({ value: w._id, label: codeNameLabel(w) }));

// Label UOM dari sebuah Ref uom (populate: "CODE — Name", string: apa adanya).
const uomLabelFromRef = (u?: Ref | null): string => {
  if (!u) return "";
  if (typeof u === "object")
    return `${u.code ?? ""}${u.code && u.name ? " — " : ""}${u.name ?? ""}`.trim();
  return u;
};

// Info UOM + harga beli master dari sebuah product terpilih.
export const productUomInfo = (
  products: ProductSource[],
  productId?: string | null,
): { uomId: string | null; uomLabel: string; purchasePrice: number } => {
  const p = products.find((x) => x._id === productId);
  if (!p) return { uomId: null, uomLabel: "", purchasePrice: 0 };
  return {
    uomId: refId(p.uom_id),
    uomLabel: uomLabelFromRef(p.uom_id),
    purchasePrice: Number(p.purchase_price) || 0,
  };
};

// react-select: pastikan menu portal berada di atas modal (z-index tinggi).
export const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

// Sinkronkan daftar item form saat pilihan PR (di Purchase Order) berubah:
// - PR yang DILEPAS  -> semua item bertanda source_pr_id itu dihapus.
// - PR yang DITAMBAH -> item PR tsb (dari getPrItems) di-append & ditandai.
// Item manual (source_pr_id null/undefined) tidak pernah tersentuh.
export const syncItemsWithPrs = (
  prevIds: string[],
  nextIds: string[],
  currentItems: PurchaseItemForm[],
  getPrItems: (prId: string) => PurchaseItemApiDaum[],
): PurchaseItemForm[] => {
  const removed = prevIds.filter((id) => !nextIds.includes(id));
  const added = nextIds.filter((id) => !prevIds.includes(id));

  let result = currentItems.filter(
    (it) => !it.source_pr_id || !removed.includes(it.source_pr_id),
  );

  for (const prId of added) {
    const appended = getPrItems(prId).map((it) => apiItemToForm(it, prId));
    result = [...result, ...appended];
  }
  return result;
};

export const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
export const readOnlyCls =
  "w-full bg-zinc-100 dark:bg-zinc-800/60 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none";
export const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

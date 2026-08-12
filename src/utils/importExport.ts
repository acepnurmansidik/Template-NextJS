// Konfigurasi fitur Import/Export yang dipakai modal reusable.
//
// Consumer (halaman) cukup mengirim `module` (mis. "product"); base endpoint
// "/import-export" ada di dalam komponen. Import mengunggah file ke
//   POST /import-export/:module/import
// Export mengambil data dari
//   GET  /import-export/:module/export?range=7d|1m|1y
// lalu file Excel-nya dirakit di frontend.

// Base endpoint (hanya ada di sini, tidak dikirim oleh consumer).
export const IMPORT_EXPORT_BASE = "/import-export";

export const importUrl = (module: string) =>
  `${IMPORT_EXPORT_BASE}/${module}/import`;
export const exportUrl = (module: string) =>
  `${IMPORT_EXPORT_BASE}/${module}/export`;

// Path template (disimpan di public/templates/<module>.xlsx).
export const templateUrl = (module: string) => `/templates/${module}.xlsx`;

// Opsi filter rentang created_at untuk export (sesuai dukungan backend).
// "custom" = pilih rentang tanggal sendiri (start_date & end_date).
export interface RangeOption {
  value: "" | "7d" | "1m" | "1y" | "custom";
  label: string;
}
export const RANGE_OPTIONS: RangeOption[] = [
  { value: "7d", label: "7 hari terakhir" },
  { value: "1m", label: "1 bulan terakhir" },
  { value: "1y", label: "1 tahun terakhir" },
  { value: "custom", label: "Rentang tanggal (custom)" },
  { value: "", label: "Semua data" },
];

// Modul yang mendukung IMPORT (punya template & upsert di backend). Modul
// procurement (PR/PO/GR/DO) hanya mendukung export.
export const IMPORTABLE_MODULES = new Set<string>([
  "product",
  "product-category",
  "uom",
  "warehouse",
  "supplier",
  "stock-position",
  "stock-movement",
]);

export const isImportable = (module: string) => IMPORTABLE_MODULES.has(module);

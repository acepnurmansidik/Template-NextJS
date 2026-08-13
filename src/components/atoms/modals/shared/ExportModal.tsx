"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
// xlsx-js-style: drop-in fork of SheetJS whose `write` keeps cell styles
// (bold / fill / font size), which the community `xlsx` build strips.
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import { FiDownloadCloud } from "react-icons/fi";
import { apiGet } from "@/utils/api";
import { exportUrl, RANGE_OPTIONS, RangeOption } from "@/utils/importExport";
import { selectStyles } from "@/utils/procurement";
import BlockingLoader from "@/components/atoms/shared/BlockingLoader";

interface ExportResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: string;
  label?: string;
}

// stamp tanggal untuk nama file (client-side, aman pakai Date).
const stamp = () => new Date().toISOString().slice(0, 10);

// Modal Export reusable (kecil). Consumer hanya mengirim `module`. Ambil data
// dari backend (JSON) lalu rakit Excel di sisi frontend. Filter created_at:
// 7 hari / 1 bulan / 1 tahun / semua.
export default function ExportModal({ isOpen, onClose, module, label }: Props) {
  const [range, setRange] = useState<RangeOption>(RANGE_OPTIONS[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustom = range.value === "custom";

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose, loading]);

  const handleExport = async () => {
    // Validasi rentang custom.
    if (isCustom && (!startDate || !endDate)) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi rentang tanggal",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (isCustom && startDate > endDate) {
      Swal.fire({
        icon: "warning",
        title: "Tanggal awal melebihi tanggal akhir",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);
    try {
      // Custom -> start_date & end_date; preset -> range.
      const params = isCustom
        ? { start_date: startDate, end_date: endDate }
        : { range: range.value || undefined };
      const res = await apiGet<ExportResponse>(
        exportUrl(module),
        params,
        true, // kirim Bearer token
      );
      const rows = res.data ?? [];
      if (rows.length < 1) {
        setLoading(false);
        Swal.fire({
          icon: "info",
          title: "Tidak ada data",
          text: "Tidak ada data pada rentang yang dipilih.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      // Header label: buang underscore -> spasi, tiap kata diawali huruf besar
      // (mis. "purchase_price" -> "Purchase Price"). Khusus "created_at"
      // ditampilkan sebagai "Created Time" (key respons tetap created_at).
      const prettify = (key: string) =>
        key === "created_at"
          ? "Created Time"
          : key
              .replace(/_/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .replace(/\b\w/g, (c) => c.toUpperCase());

      // Gaya header: tebal, tulisan lebih besar & putih, background biru, rata
      // tengah — supaya jelas terlihat sebagai header.
      const headerStyle = {
        font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "2563EB" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "1E40AF" } },
          bottom: { style: "thin", color: { rgb: "1E40AF" } },
          left: { style: "thin", color: { rgb: "1E40AF" } },
          right: { style: "thin", color: { rgb: "1E40AF" } },
        },
      };

      // Deteksi field yang bentuknya array (mis. finance: `accounts`). Jika ada,
      // tiap record dipecah menjadi beberapa baris (satu per elemen array) dan
      // kolom non-array (header) di-merge vertikal sepanjang jumlah elemennya.
      const firstRow = (rows[0] ?? {}) as Record<string, unknown>;
      const arrayKey = Object.keys(firstRow).find((k) =>
        rows.some((r) => Array.isArray((r as Record<string, unknown>)[k])),
      );

      type Merge = { s: { r: number; c: number }; e: { r: number; c: number } };
      let ws: XLSX.WorkSheet;
      let columns: string[];

      if (arrayKey) {
        // Kolom = field skalar + field dari tiap elemen array.
        const scalarKeys = Object.keys(firstRow).filter((k) => k !== arrayKey);
        let elementKeys: string[] = [];
        for (const r of rows) {
          const arr = (r as Record<string, unknown>)[arrayKey];
          if (Array.isArray(arr) && arr.length) {
            elementKeys = Object.keys(arr[0] as Record<string, unknown>);
            break;
          }
        }
        columns = [...scalarKeys, ...elementKeys];

        const aoa: unknown[][] = [columns.slice()]; // baris 0 = key (diprettify)
        const merges: Merge[] = [];
        let rowIdx = 1;
        for (const rec of rows) {
          const record = rec as Record<string, unknown>;
          const arr = Array.isArray(record[arrayKey])
            ? (record[arrayKey] as Record<string, unknown>[])
            : [];
          const n = Math.max(1, arr.length);
          for (let j = 0; j < n; j++) {
            const el = (arr[j] ?? {}) as Record<string, unknown>;
            const line: unknown[] = [];
            // Field skalar hanya diisi di baris pertama (sisanya di-merge).
            scalarKeys.forEach((k) => line.push(j === 0 ? record[k] ?? "" : ""));
            elementKeys.forEach((k) => line.push(el[k] ?? ""));
            aoa.push(line);
          }
          if (n > 1) {
            scalarKeys.forEach((_k, c) =>
              merges.push({ s: { r: rowIdx, c }, e: { r: rowIdx + n - 1, c } }),
            );
          }
          rowIdx += n;
        }
        ws = XLSX.utils.aoa_to_sheet(aoa);
        ws["!merges"] = merges;
      } else {
        ws = XLSX.utils.json_to_sheet(rows);
        columns = Object.keys(firstRow);
      }

      // Tulis ulang baris header (baris ke-1) dengan label rapi + gaya di atas.
      columns.forEach((key, c) => {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
        if (!cell) return;
        cell.v = prettify(key);
        cell.t = "s";
        (cell as { s?: unknown }).s = headerStyle;
      });

      // Setiap sel bertipe number ditulis dengan format currency (pemisah
      // ribuan gaya id-ID, mis. 1.234.567) namun tetap numerik agar bisa
      // dihitung di Excel. Pada sheet dengan merge (finance), SEMUA sel data
      // (baik yang ter-merge maupun tidak) tulisannya dibuat rata tengah.
      // Sekaligus hitung lebar kolom dari isi sel.
      const centerData = Boolean(arrayKey);
      const sheetRange = XLSX.utils.decode_range(ws["!ref"] as string);
      const widths = columns.map((k) => prettify(k).length);
      for (let r = 1; r <= sheetRange.e.r; r++) {
        for (let c = sheetRange.s.c; c <= sheetRange.e.c; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r, c })];
          if (!cell) continue;
          if (cell.t === "n") {
            cell.z = "#,##0";
            (cell as { s?: unknown }).s = {
              numFmt: "#,##0",
              alignment: centerData
                ? { horizontal: "center", vertical: "center" }
                : { horizontal: "right" },
            };
          } else if (centerData) {
            (cell as { s?: unknown }).s = {
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
          const len = cell.v == null ? 0 : String(cell.v).length;
          if (len > widths[c]) widths[c] = len;
        }
      }
      ws["!cols"] = widths.map((w) => ({ wch: Math.min(w + 6, 60) }));

      // Tinggikan baris header agar teks yang lebih besar tampak lega.
      ws["!rows"] = [{ hpt: 22 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, label ?? module);
      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([buf], { type: "application/octet-stream" }),
        `${label ?? module}-${stamp()}.xlsx`,
      );

      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Export gagal",
        text: serverMessage || "Gagal mengambil data. Coba lagi.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[900] flex items-center justify-center bg-zinc-950/50 p-4"
        onClick={() => !loading && onClose()}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Export {label ?? module}
            </h3>
            <button
              onClick={() => !loading && onClose()}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <IoClose className="text-red-500 text-lg" />
            </button>
          </div>

          {/* BODY */}
          <div className="px-5 py-5 space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              Rentang (created_at)
            </label>
            <Select
              instanceId={`export-range-${module}`}
              classNamePrefix="rs"
              options={RANGE_OPTIONS}
              value={range}
              onChange={(opt) =>
                setRange((opt as RangeOption) ?? RANGE_OPTIONS[0])
              }
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              styles={selectStyles}
            />

            {isCustom && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-500">
                    Dari tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-500">
                    Sampai tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-zinc-400">
              File Excel dibuat di browser dari data yang dikirim server.
            </p>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <button
              onClick={() => !loading && onClose()}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiDownloadCloud size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      <BlockingLoader show={loading} message="Menyiapkan file…" />
    </>
  );
}

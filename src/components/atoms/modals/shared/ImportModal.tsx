"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud, FiFileText, FiDownload, FiX } from "react-icons/fi";
import { apiPost } from "@/utils/api";
import { importUrl, templateUrl } from "@/utils/importExport";
import BlockingLoader from "@/components/atoms/shared/BlockingLoader";

interface ImportSummary {
  total_rows: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}
interface ImportResponse {
  success: boolean;
  message: string;
  data: ImportSummary;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: string; // hanya module; base endpoint ada di dalam util
  label?: string; // judul, mis. "Product"
}

// Modal Import reusable (kecil, tidak full-screen). Consumer hanya mengirim
// `module`. Menyediakan tombol unduh template + upload file, lalu POST ke
// backend. Selama proses, BlockingLoader mengunci layar.
export default function ImportModal({ isOpen, onClose, module, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setFile(null);
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose, loading]);

  const pickFile = (f?: File | null) => {
    if (!f) return;
    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      Swal.fire({
        icon: "warning",
        title: "Hanya file Excel (.xlsx)",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Pilih file dulu",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiPost<ImportResponse>(
        importUrl(module),
        form,
        true, // kirim Bearer token
        true, // multipart/form-data
      );
      setLoading(false);
      if (res.success) {
        const s = res.data;
        await Swal.fire({
          icon: s.skipped > 0 ? "warning" : "success",
          title: "Import selesai",
          html: `
            <div style="text-align:left;font-size:14px">
              <div>Baru: <b>${s.inserted}</b></div>
              <div>Diperbarui: <b>${s.updated}</b></div>
              <div>Dilewati: <b>${s.skipped}</b></div>
              ${
                s.errors?.length
                  ? `<details style="margin-top:8px"><summary>Detail error (${s.errors.length})</summary><ul style="margin:6px 0 0 16px">${s.errors
                      .map((e) => `<li>${e}</li>`)
                      .join("")}</ul></details>`
                  : ""
              }
            </div>`,
          confirmButtonColor: "#2563eb",
        });
        onClose();
      }
    } catch (error) {
      setLoading(false);
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Import gagal",
        text: serverMessage || "Gagal mengunggah file. Coba lagi.",
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
              Import {label ?? module}
            </h3>
            <button
              onClick={() => !loading && onClose()}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <IoClose className="text-red-500 text-lg" />
            </button>
          </div>

          {/* BODY */}
          <div className="px-5 py-5 space-y-4">
            {/* template */}
            <a
              href={templateUrl(module)}
              download
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <FiDownload size={15} />
              Unduh template {label ?? module}
            </a>

            {/* dropzone / file input */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-8 text-center transition-colors hover:border-blue-400"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                  <FiFileText className="text-blue-600" />
                  <span className="truncate max-w-[220px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-zinc-400 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <FiUploadCloud size={28} />
                  <p className="text-sm">
                    Klik atau seret file <b>.xlsx</b> ke sini
                  </p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>

            <p className="text-[11px] text-zinc-400">
              Data akan divalidasi & di-upsert (tidak duplikat) di server.
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
              onClick={handleSubmit}
              disabled={loading || !file}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Import
            </button>
          </div>
        </div>
      </div>

      <BlockingLoader show={loading} message="Mengimpor data…" />
    </>
  );
}

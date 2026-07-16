"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiClock, FiFileText } from "react-icons/fi";
import React from "react";
import { apiGet } from "@/utils/api";
import {
  AppConfigApiDaum,
  AppReleaseLogDaum,
  BodyAppReleaseLogResponseApiDaum,
  UpdateType,
} from "@/types/appConfig";

interface DataProps {
  initialData: AppConfigApiDaum;
  isOpen: boolean;
  onClose: () => void;
}

// Badge warna untuk update type.
const updateTypeBadge = (type: UpdateType) => {
  switch (type) {
    case UpdateType.FORCE:
      return "border-red-400 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300";
    case UpdateType.OPTIONAL:
      return "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400";
  }
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const releasedByLabel = (by: AppReleaseLogDaum["released_by"]) => {
  if (!by) return "System";
  if (typeof by === "string") return by;
  return by.name || by.username || by._id || "-";
};

export default function ViewAppConfigModal({
  isOpen,
  onClose,
  initialData,
}: DataProps) {
  const [showLog, setShowLog] = useState<boolean>(false);
  const [logs, setLogs] = useState<AppReleaseLogDaum[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState<boolean>(false);
  const [hasFetchedLog, setHasFetchedLog] = useState<boolean>(false);

  // Reset ke tampilan detail setiap kali modal dibuka ulang.
  useEffect(() => {
    setShowLog(false);
    setLogs([]);
    setHasFetchedLog(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const fetchLogs = async () => {
    setIsLoadingLog(true);
    try {
      const result = await apiGet<BodyAppReleaseLogResponseApiDaum>(
        "/app-configs/release-history",
        { page: 1, limit: 1000 },
        false,
      );
      const data = result.data ?? [];
      // Urutkan terbaru di atas.
      const sorted = [...data].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
      setLogs(sorted);
    } catch (error) {
      setLogs([]);
    } finally {
      setIsLoadingLog(false);
      setHasFetchedLog(true);
    }
  };

  const handleToggleLog = () => {
    const next = !showLog;
    setShowLog(next);
    // Fetch pertama kali saja saat log dibuka.
    if (next && !hasFetchedLog) {
      fetchLogs();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {showLog ? "Release History" : "View Application Config"}
        </h2>
        <div className="flex items-center gap-2">
          {/* Tombol toggle Detail / Log */}
          <button
            onClick={handleToggleLog}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/70 transition-all hover:cursor-pointer"
          >
            {showLog ? (
              <>
                <FiFileText className="text-blue-500" />
                <span>Detail</span>
              </>
            ) : (
              <>
                <FiClock className="text-blue-500" />
                <span>Log</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
          >
            <IoClose className="text-red-500 text-xl" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {showLog ? (
          /* =========================== LOG TIMELINE ============================ */
          <div className="max-w-3xl mx-auto">
            {isLoadingLog ? (
              <div className="py-16 text-center text-sm text-zinc-400">
                Loading release history...
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">
                  Belum ada history rilis
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Riwayat versi yang sudah dirilis akan tampil di sini.
                </p>
              </div>
            ) : (
              <ol className="relative border-l-2 border-zinc-200 dark:border-zinc-700 ml-3">
                {logs.map((log) => (
                  <li key={log._id} className="mb-8 ml-6">
                    {/* Dot timeline */}
                    <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white dark:ring-zinc-950" />

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-sm">
                      {/* Header entry */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          v{log.version_released}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-400 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                          {log.platform}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${updateTypeBadge(
                            log.update_type,
                          )}`}
                        >
                          {log.update_type}
                        </span>
                        {log.status_maintenance && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                            Maintenance
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400 mb-3">
                        <span className="flex items-center gap-1">
                          <FiClock />
                          {formatDate(log.createdAt)}
                        </span>
                        <span>
                          Released by:{" "}
                          <span className="text-zinc-500 dark:text-zinc-300 font-medium">
                            {releasedByLabel(log.released_by)}
                          </span>
                        </span>
                      </div>

                      {/* Release notes (HTML dari Quill) */}
                      {log.release_notes ? (
                        <div
                          className="ql-editor-view text-sm text-zinc-600 dark:text-zinc-300 prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: log.release_notes,
                          }}
                        />
                      ) : (
                        <p className="text-sm text-zinc-400 italic">
                          Tidak ada catatan rilis.
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ) : (
          /* =========================== DETAIL (read-only) ============================ */
          <div className="max-w-full px-5 mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Platform
                </label>
                <input
                  disabled
                  value={initialData.platform ?? ""}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Version
                </label>
                <input
                  disabled
                  value={initialData.latest_version ?? ""}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Update Type
                </label>
                <input
                  disabled
                  value={initialData.update_type ?? ""}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Download Url
                </label>
                <input
                  disabled
                  value={initialData.download_url ?? ""}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Status Maintenance
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                      initialData.status_maintenance
                        ? "border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
                        : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {initialData.status_maintenance ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* MESSAGE (read-only HTML) */}
              <div className="group md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Message
                </label>
                {initialData.maintenance_message ? (
                  <div
                    className="w-full bg-zinc-50 dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 prose prose-sm max-w-none dark:prose-invert min-h-[100px]"
                    dangerouslySetInnerHTML={{
                      __html: initialData.maintenance_message,
                    }}
                  />
                ) : (
                  <div className="w-full bg-zinc-50 dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-400 italic min-h-[100px]">
                    Tidak ada pesan.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

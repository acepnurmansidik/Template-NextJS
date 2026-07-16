"use client";

import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { get } from "lodash";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  AppConfigApiDaum,
  BodyAppConfigResponseApiDaum,
  UpdateType,
} from "@/types/appConfig";
import { apiDelete } from "@/utils/api";
import axios from "axios";
import UpdateAppConfigModal from "../modals/update/UpdateAppConfigModal";
import ViewAppConfigModal from "../modals/view/ViewAppConfigModal";

interface DataProps {
  hasAccess: Record<string, boolean>;
  columns: { title: string; value: string }[];
  data: AppConfigApiDaum[];
  visibleColumns: string[];
  selectedNames: string[];
  handleSelectAll: () => void;
  toggleSelectName: (name: string) => void;
  expandedRow: number | null;
  toggleRow: (index: number) => void;
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  windowPages: number[];
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  onRefresh?: () => void;
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

export const TableAppConfig = ({
  hasAccess,
  columns,
  data,
  visibleColumns,
  selectedNames,
  handleSelectAll,
  toggleSelectName,
  totalData,
  totalPage,
  page,
  limit,
  setPage,
  setLimit,
  windowPages,
  onRefresh,
}: DataProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalView, setShowModalView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<AppConfigApiDaum | null>(
    null,
  );

  const handleDeleteData = async (id: string) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });

      if (!confirmation.isConfirmed) {
        return;
      }

      setIsLoading(true);
      const result = await apiDelete<BodyAppConfigResponseApiDaum>(
        `/app-configs/${id}`,
        {},
        false,
      );

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted successfully",
          text: result.message || "Your data has been deleted successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          timerProgressBar: true,
        });

        onRefresh?.();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: serverMessage || "Failed to delete data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleModalView = (newData: AppConfigApiDaum) => {
    setShowModalView(true);
    setSelectedData(newData);
  };
  const handleModalUpdate = (newData: AppConfigApiDaum) => {
    setShowModalUpdate(true);
    setSelectedData(newData);
  };

  return (
    <div className="grid grid-cols-1 items-center">
      {/* =========================== TABLE WRAPPER ============================ */}
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-100 custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-zinc-800 sticky top-0 z-10 transition-colors duration-300">
              <tr className="text-sm text-gray-900 dark:text-zinc-100">
                {columns
                  .filter((col) => visibleColumns.includes(col.value))
                  .map((col, index) => (
                    <th
                      key={index}
                      className={`py-2 px-3 font-bold cursor-pointer select-none ${
                        col.value === "action" ? "w-[10%]" : "w-[22%]"
                      }`}
                    >
                      {col.value === "*" ? (
                        <>
                          <style jsx>{`
                            input[type="checkbox"].custom-checkbox:checked::after {
                              content: "✓";
                              position: absolute;
                              color: white;
                              font-size: 13px;
                              font-weight: bold;
                              top: -2px;
                              left: 2px;
                            }
                          `}</style>

                          <input
                            type="checkbox"
                            checked={
                              selectedNames.length === data.length &&
                              data.length > 0
                            }
                            onChange={handleSelectAll}
                            className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 dark:border-zinc-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 relative transition-all hover:border-blue-500 hover:shadow-md"
                          />
                        </>
                      ) : (
                        col.title
                      )}
                    </th>
                  ))}
              </tr>
            </thead>

            {/* =========================== BODY TABEL ============================ */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.filter((col) =>
                        visibleColumns.includes(col.value),
                      ).length
                    }
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 transition-colors duration-300">
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-zinc-700/30 text-gray-400 dark:text-zinc-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-inbox"
                        >
                          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                        </svg>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-800 dark:text-zinc-200">
                          No data available
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-xs mx-auto">
                          There are no records found in this table. Try creating
                          a new entry or adjusting your search filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`transition text-sm border-b border-gray-100/50 dark:border-zinc-700/50 ${
                      rowIndex % 2 === 0
                        ? "bg-gray-50 dark:bg-zinc-700/30"
                        : "bg-white dark:bg-transparent"
                    }`}
                  >
                    {columns
                      .filter((col) => visibleColumns.includes(col.value))
                      .map((col, indexCol) => (
                        <td
                          key={indexCol}
                          className="py-3 px-3 text-gray-700 dark:text-zinc-300"
                        >
                          {col.value === "*" ? (
                            <>
                              <style jsx>{`
                                input[type="checkbox"].custom-checkbox:checked::after {
                                  content: "✓";
                                  position: absolute;
                                  color: white;
                                  font-size: 13px;
                                  font-weight: bold;
                                  top: -2px;
                                  left: 2px;
                                }
                              `}</style>
                              <input
                                type="checkbox"
                                checked={selectedNames.includes(row._id)}
                                onChange={() => toggleSelectName(row._id)}
                                className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 dark:border-zinc-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 relative transition-all hover:border-blue-500 hover:shadow-md"
                              />
                            </>
                          ) : col.value === "action" ? (
                            <div className="flex items-center text-gray-500 dark:text-zinc-400">
                              {hasAccess.view && (
                                <button
                                  onClick={() => handleModalView(row)}
                                  className="cursor-pointer me-3 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                                >
                                  <FaEye size={18} />
                                </button>
                              )}
                              {hasAccess.update && (
                                <button
                                  onClick={() => handleModalUpdate(row)}
                                  className="cursor-pointer text-blue-700 dark:text-blue-400 me-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                  <FaEdit size={18} />
                                </button>
                              )}
                              {hasAccess.delete && (
                                <button
                                  onClick={() => handleDeleteData(row._id)}
                                  className="text-red-500 duration-300 dark:text-red-400 cursor-pointer hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                >
                                  <FaTrash size={16} />
                                </button>
                              )}
                            </div>
                          ) : col.value === "update_type" ? (
                            <span
                              className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${updateTypeBadge(
                                row.update_type,
                              )}`}
                            >
                              {row.update_type}
                            </span>
                          ) : col.value === "status_maintenance" ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                row.status_maintenance
                                  ? "border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
                                  : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                              }`}
                            >
                              {row.status_maintenance ? "Active" : "Inactive"}
                            </span>
                          ) : col.value === "latest_version" ? (
                            <span className="font-medium">
                              v{row.latest_version}
                            </span>
                          ) : (
                            get(row, col.value, "-")
                          )}
                        </td>
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================== PAGINATION ============================ */}
      <div className="flex justify-between items-center mt-5 text-sm text-gray-600 dark:text-zinc-400 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <span>
            {data.length === 0
              ? "Showing 0 - 0 of 0"
              : `Showing ${(page - 1) * limit + 1} - ${Math.min(page * limit, totalData)} of ${totalData}`}
          </span>

          <select
            className="border-[1.5px] border-gray-300 dark:border-zinc-600 outline-none px-2 py-1 rounded bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            value={limit}
            disabled={data.length === 0}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 100, 200, 1000].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 text-gray-800 dark:text-zinc-200">
          {/* Previous Arrow */}
          {page > 1 && data.length > 0 && (
            <button
              className="p-1 hover:cursor-pointer rounded hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setPage(page - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>
          )}

          {/* Dynamic Pages */}
          {windowPages.map((p) => (
            <button
              key={p}
              disabled={data.length === 0}
              onClick={() => setPage(p)}
              className={`px-3 duration-300 py-1 rounded transition-all ${
                data.length === 0
                  ? "bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                  : p === page
                    ? "font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400 cursor-default"
                    : "hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-200"
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next Arrow */}
          {page < totalPage && data.length > 0 && (
            <button
              className="p-1 hover:cursor-pointer rounded hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setPage(page + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showModalUpdate && selectedData && (
        <UpdateAppConfigModal
          key={selectedData._id}
          isOpen={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
          onSuccess={() => {
            setShowModalUpdate(false);
            onRefresh?.();
          }}
          initialData={selectedData}
        />
      )}
      {showModalView && selectedData && (
        <ViewAppConfigModal
          key={selectedData._id}
          isOpen={showModalView}
          onClose={() => setShowModalView(false)}
          initialData={selectedData}
        />
      )}
    </div>
  );
};

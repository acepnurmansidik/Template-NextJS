"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { HiOutlinePuzzlePiece } from "react-icons/hi2";
import { apiDelete } from "@/utils/api";
import {
  BuildingApiDaum,
  BUILDING_TYPE_BADGE,
  BUILDING_TYPE_LABEL,
  BuildingType,
  refName,
} from "@/types/facility";
import UpdateBuildingModal from "../modals/update/UpdateBuildingModal";
import ViewBuildingModal from "../modals/view/ViewBuildingModal";
import LayoutBuildingModal from "../modals/LayoutBuildingModal";
import { SingleResponse } from "@/types/api";

interface DataProps {
  columns: { title: string; value: string; classname: string }[];
  hasAccess: Record<string, boolean>;
  data: BuildingApiDaum[];
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  windowPages: number[];
  onRefresh?: () => void;
}

export const TableBuilding = ({
  hasAccess,
  columns,
  data,
  page,
  limit,
  totalData,
  totalPage,
  setPage,
  setLimit,
  windowPages,
  onRefresh,
}: DataProps) => {
  const [selectedData, setSelectedData] = useState<BuildingApiDaum | null>(
    null,
  );
  const [showModalLayout, setShowModalLayout] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalView, setShowModalView] = useState(false);

  const handleDelete = async (row: BuildingApiDaum) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Building beserta lantai & ruangan di dalamnya akan ikut dihapus.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });
      if (!confirmation.isConfirmed) return;

      const result = await apiDelete<SingleResponse<BuildingApiDaum>>(
        `/building/${row._id}`,
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
    } catch (error) {
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

  const renderCell = (row: BuildingApiDaum, value: string) => {
    switch (value) {
      case "code":
        return (
          <span className="font-mono text-xs font-bold text-gray-500 dark:text-zinc-400">
            {row.code}
          </span>
        );
      case "name":
        return (
          <span className="font-medium text-gray-800 dark:text-zinc-200">
            {row.name}
          </span>
        );
      case "branch":
        return refName(row.branch_id);
      case "building_type":
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              BUILDING_TYPE_BADGE[row.building_type as BuildingType] ?? ""
            }`}
          >
            {BUILDING_TYPE_LABEL[row.building_type as BuildingType] ??
              row.building_type}
          </span>
        );
      case "total_floors":
        return (
          <span className="font-mono text-gray-800 dark:text-zinc-200">
            {row.total_floors}
          </span>
        );
      case "status":
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              row.is_active
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
            }`}
          >
            {row.is_active ? "Active" : "Inactive"}
          </span>
        );
      default:
        return "—";
    }
  };

  return (
    <div className="grid grid-cols-1 items-center">
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-[32rem] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-zinc-800 sticky top-0 z-10 transition-colors duration-300">
              <tr className="text-sm text-gray-900 dark:text-zinc-100">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-2 px-3 font-bold select-none ${col.classname}`}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
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
                          There are no buildings found. Try creating a new entry
                          or adjusting your search filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row._id}
                    className={`transition text-sm border-b border-gray-100/50 dark:border-zinc-700/50 ${
                      rowIndex % 2 === 0
                        ? "bg-gray-50 dark:bg-zinc-700/30"
                        : "bg-white dark:bg-transparent"
                    }`}
                  >
                    {columns.map((col, indexCol) => (
                      <td
                        key={indexCol}
                        className={`py-3 px-3 text-gray-700 dark:text-zinc-300 ${col.classname ?? ""}`}
                      >
                        {col.value === "action" ? (
                          <div className="flex items-center gap-0.5 text-gray-500 dark:text-zinc-400">
                            {hasAccess.view && (
                              <button
                                onClick={() => {
                                  setSelectedData(row);
                                  setShowModalView(true);
                                }}
                                title="View floors"
                                className="h-7 w-7 flex items-center justify-center rounded-md hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                              >
                                <FiEye size={15} />
                              </button>
                            )}
                            {hasAccess.update && (
                              <button
                                onClick={() => {
                                  setSelectedData(row);
                                  setShowModalUpdate(true);
                                }}
                                title="Edit"
                                className="h-7 w-7 flex items-center justify-center rounded-md hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer"
                              >
                                <FiEdit2 size={15} />
                              </button>
                            )}
                            {hasAccess.layout && (
                              <button
                                onClick={() => {
                                  setSelectedData(row);
                                  setShowModalLayout(true);
                                }}
                                title="Edit"
                                className="h-7 w-7 flex items-center justify-center rounded-md hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer"
                              >
                                <HiOutlinePuzzlePiece size={19} />
                              </button>
                            )}
                            {hasAccess.delete && (
                              <button
                                onClick={() => handleDelete(row)}
                                title="Delete"
                                className="h-7 w-7 flex items-center justify-center rounded-md hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            )}
                          </div>
                        ) : (
                          renderCell(row, col.value)
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
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 text-gray-800 dark:text-zinc-200">
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
        <UpdateBuildingModal
          isOpen={showModalUpdate}
          initialData={selectedData}
          onClose={() => setShowModalUpdate(false)}
          onSuccess={() => {
            setShowModalUpdate(false);
            onRefresh?.();
          }}
        />
      )}

      {showModalView && selectedData && (
        <ViewBuildingModal
          isOpen={showModalView}
          buildingId={selectedData._id}
          onClose={() => setShowModalView(false)}
          onRefresh={onRefresh}
        />
      )}

      {showModalLayout && selectedData && (
        <LayoutBuildingModal
          isOpen={showModalLayout}
          buildingId={selectedData._id}
          onClose={() => setShowModalLayout(false)}
        />
      )}
    </div>
  );
};

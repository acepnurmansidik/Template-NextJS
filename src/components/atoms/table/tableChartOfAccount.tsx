"use client";

import { useEffect, useMemo, useState } from "react";
import { Column, SingleResponse } from "@/types/api";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { apiDelete } from "@/utils/api";
import {
  buildTree,
  ChartOfAccountApiDaum,
  ChartOfAccountNode,
} from "@/types/chartOfAccount";
import UpdateChartOfAccountModal from "../modals/update/UpdateChartOfAccountModal";
import ViewChartOfAccountModal from "../modals/view/ViewChartOfAccountModal";
import { BALANCE_BADGE, TYPE_BADGE } from "@/utils/utils";

// Ratakan pohon menjadi daftar baris yang TERLIHAT saja (node ikut tampil bila
// seluruh leluhurnya sedang expanded), sambil menjaga urutan & kedalaman.
const flattenVisible = (
  nodes: ChartOfAccountNode[],
  expanded: Set<string>,
): ChartOfAccountNode[] => {
  const rows: ChartOfAccountNode[] = [];
  const walk = (list: ChartOfAccountNode[]) => {
    for (const node of list) {
      rows.push(node);
      if (node.children.length > 0 && expanded.has(node._id)) {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return rows;
};

interface DataProps {
  hasAccess: Record<string, boolean>;
  data: ChartOfAccountApiDaum[];
  columns: Column[];
  // TRUE saat search aktif → semua node otomatis dibuka agar hasil terlihat.
  searchActive?: boolean;
  onRefresh?: () => void;
  onAddChild: (parentId: string) => void;
}

export const TableChartOfAccount = ({
  columns,
  hasAccess,
  data,
  searchActive,
  onRefresh,
  onAddChild,
}: DataProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedData, setSelectedData] =
    useState<ChartOfAccountApiDaum | null>(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalView, setShowModalView] = useState(false);

  const tree = useMemo(() => buildTree(data), [data]);
  const rows = useMemo(() => flattenVisible(tree, expanded), [tree, expanded]);

  // Saat mencari, buka semua node agar hasil kelihatan.
  useEffect(() => {
    if (searchActive) setExpanded(new Set(data.map((a) => a._id)));
  }, [searchActive, data]);

  const toggleNode = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(data.map((a) => a._id)));
  const collapseAll = () => setExpanded(new Set());

  const handleModalView = (row: ChartOfAccountApiDaum) => {
    setSelectedData(row);
    setShowModalView(true);
  };

  const handleModalUpdate = (row: ChartOfAccountApiDaum) => {
    setSelectedData(row);
    setShowModalUpdate(true);
  };

  const handleDelete = async (row: ChartOfAccountApiDaum) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: row.is_header
          ? "Akun header hanya bisa dihapus bila tidak memiliki sub-akun."
          : "You won't be able to revert this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });
      if (!confirmation.isConfirmed) return;

      const result = await apiDelete<SingleResponse<ChartOfAccountApiDaum>>(
        `/chart-of-account/${row._id}`,
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

  return (
    <div className="grid grid-cols-1 items-center">
      <div className="flex items-center justify-end gap-2.5 mb-3">
        <button
          onClick={expandAll}
          className="h-7.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 cursor-pointer px-4 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
        >
          Expand all
        </button>
        <button
          onClick={collapseAll}
          className="h-7.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 cursor-pointer px-4 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
        >
          Collapse all
        </button>
      </div>

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
              {rows.length === 0 ? (
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
                          There are no accounts found. Try creating a new entry
                          or adjusting your search filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((node, rowIndex) => {
                  const hasChildren = node.children.length > 0;
                  const isOpen = expanded.has(node._id);
                  return (
                    <tr
                      key={node._id}
                      onClick={() => hasChildren && toggleNode(node._id)}
                      className={`group transition text-sm border-b border-gray-100/50 dark:border-zinc-700/50 ${
                        hasChildren ? "cursor-pointer" : ""
                      } ${
                        rowIndex % 2 === 0
                          ? "bg-gray-50 dark:bg-zinc-700/30"
                          : "bg-white dark:bg-transparent"
                      } hover:bg-blue-50/60 dark:hover:bg-zinc-700/60`}
                    >
                      {/* NAME (indentasi sesuai level + chevron) */}
                      <td className="py-3 px-3">
                        <div
                          className="flex items-center gap-2"
                          style={{
                            paddingLeft: `${(node.level - 1) * 1.5}rem`,
                          }}
                        >
                          <span
                            className={`flex items-center justify-center h-5 w-5 shrink-0 rounded ${
                              hasChildren
                                ? "text-gray-500 dark:text-zinc-400"
                                : "invisible"
                            }`}
                          >
                            <FiChevronRight
                              size={14}
                              className={`transition-transform duration-200 ${
                                isOpen ? "rotate-90" : ""
                              }`}
                            />
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-500 dark:text-zinc-400">
                            {node.code}
                          </span>
                          <span
                            className={`truncate ${
                              node.is_header
                                ? "font-bold text-gray-900 dark:text-zinc-100"
                                : "font-medium text-gray-700 dark:text-zinc-300"
                            }`}
                          >
                            {node.name}
                          </span>
                          {node.is_header && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600 shrink-0">
                              HEADER
                            </span>
                          )}
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            TYPE_BADGE[node.type]
                          }`}
                        >
                          {node.type}
                        </span>
                      </td>

                      {/* NORMAL BALANCE */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            BALANCE_BADGE[node.normal_balance]
                          }`}
                        >
                          {node.normal_balance}
                        </span>
                      </td>

                      {/* LEVEL */}
                      <td className="py-3 px-3 text-gray-600 dark:text-zinc-400">
                        {node.level}
                      </td>

                      {/* ACTION (stopPropagation agar tak ikut toggle) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-0.5 text-gray-500 dark:text-zinc-400">
                          {hasAccess.view && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModalView(node);
                              }}
                              title="View"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                            >
                              <FiEye size={15} />
                            </button>
                          )}
                          {hasAccess.create && node.is_header && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddChild(node._id);
                              }}
                              title="Add sub-account"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer"
                            >
                              <FiPlus size={15} />
                            </button>
                          )}
                          {hasAccess.update && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModalUpdate(node);
                              }}
                              title="Edit"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer"
                            >
                              <FiEdit2 size={15} />
                            </button>
                          )}
                          {hasAccess.delete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(node);
                              }}
                              title="Delete"
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModalUpdate && selectedData && (
        <UpdateChartOfAccountModal
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
        <ViewChartOfAccountModal
          isOpen={showModalView}
          initialData={selectedData}
          onClose={() => setShowModalView(false)}
        />
      )}
    </div>
  );
};

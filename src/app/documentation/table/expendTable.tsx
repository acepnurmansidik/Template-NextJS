"use client";

import { Fragment, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaEnvelope,
  FaChevronDown,
} from "react-icons/fa";
import { get } from "lodash";

interface DataProps {
  columns: { title: string; value: string }[];
  data: any[];
  visibleColumns: string[];
  toggleSelectName: (name: string) => void;
  toggleRow: (index: number) => void;
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
  windowPages: number[];
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
}

export default function ExpendTable({
  columns,
  data,
  visibleColumns,
  toggleSelectName,
  totalData,
  totalPage,
  page,
  limit,
  setPage,
  setLimit,
  windowPages,
}: DataProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const toggleExpand = (rowIndex: number) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  const handleSelectAll = () => {
    if (selectedNames.length === data.length) {
      setSelectedNames([]);
    } else {
      setSelectedNames(data.map((item) => item.name));
    }
  };

  return (
    <div className="grid grid-cols-1 items-center">
      {/* CSS Injection untuk Animasi Expand */}
      <style jsx global>{`
        @keyframes expandRow {
          from {
            grid-template-rows: 0fr;
            opacity: 0;
          }
          to {
            grid-template-rows: 1fr;
            opacity: 1;
          }
        }
        .animate-expand {
          display: grid;
          animation: expandRow 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="overflow-x-auto transition-all bg-white ">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              {columns
                .filter((col) => visibleColumns.includes(col.value))
                .map((col, index) => (
                  <th
                    key={index}
                    className={`py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap ${
                      col.value === "action"
                        ? "sticky right-0 z-20 bg-slate-50 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]"
                        : col.value === "*"
                          ? "sticky left-0 z-20 bg-slate-50 shadow-[4px_0_8px_rgba(0,0,0,0.02)]"
                          : "bg-slate-50"
                    }`}
                  >
                    {col.value === "*" ? (
                      <div className="flex items-center justify-center">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedNames.length === data.length &&
                              data.length > 0
                            }
                            onChange={handleSelectAll}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 bg-white transition-all checked:bg-indigo-600 checked:border-indigo-600 hover:border-indigo-300 focus:ring-1 focus:ring-indigo-500/10"
                          />
                          <svg
                            className="absolute h-3.5 w-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      col.title
                    )}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {data.map((row, rowIndex) => (
              <Fragment key={rowIndex}>
                <tr
                  className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(rowIndex)}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.value))
                    .map((col, indexCol) => (
                      <td
                        key={indexCol}
                        className={`py-5 px-6 text-sm border-b border-slate-50 transition-colors ${
                          col.value === "action"
                            ? "sticky right-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-10px_0_15px_rgba(0,0,0,0.011)]"
                            : col.value === "*"
                              ? "sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[10px_0_15px_rgba(0,0,0,0.011)]"
                              : "bg-transparent"
                        }`}
                      >
                        {col.value === "*" ? (
                          <div className="flex items-center justify-center">
                            <div
                              className="relative flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedNames.includes(row.name)}
                                onChange={() => toggleSelectName(row.name)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 bg-white transition-all checked:bg-indigo-600 checked:border-indigo-600 hover:border-indigo-300 focus:ring-1 focus:ring-indigo-500/10"
                              />
                              <svg
                                className="absolute h-3.5 w-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          </div>
                        ) : col.value === "action" ? (
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="p-2 cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow">
                              <FaEye size={15} />
                            </button>
                            <button className="p-2 cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow">
                              <FaEdit size={15} />
                            </button>
                            <button className="p-2 cursor-pointer text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow">
                              <FaTrash size={13} />
                            </button>
                          </div>
                        ) : col.value === "cards" ? (
                          <div className="flex flex-col gap-1.5 min-w-40">
                            <div className="flex flex-wrap gap-1 max-h-14 overflow-hidden">
                              {row.cards
                                .slice(0, 2)
                                .map((card: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-md"
                                  >
                                    {card}
                                  </span>
                                ))}
                              {row.cards.length > 2 && (
                                <span className="text-[9px] font-bold text-slate-400 self-center">
                                  +{row.cards.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-600 whitespace-nowrap">
                            {get(row, col.value, "-")}
                          </span>
                        )}
                      </td>
                    ))}
                </tr>

                {/* ANIMATED EXPANDED ROW */}
                {expandedRow === rowIndex && (
                  <tr>
                    <td
                      colSpan={
                        columns.filter((col) =>
                          visibleColumns.includes(col.value),
                        ).length
                      }
                      className="p-0 bg-slate-50/50"
                    >
                      <div className="animate-expand overflow-hidden">
                        <div className="min-h-0">
                          <div className="px-8 py-8 flex flex-col gap-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transform transition-all animate-in fade-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
                                    {row.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="text-slate-900 font-bold text-lg leading-tight">
                                      {row.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-1">
                                      <FaEnvelope size={10} />
                                      {row.email}
                                    </div>
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 animate-pulse">
                                  Active Profile
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
                                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                                    Address
                                  </p>
                                  <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                                    {row.address || "California, USA"}
                                  </p>
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
                                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                                    Joined Date
                                  </p>
                                  <p className="text-slate-700 text-sm font-semibold">
                                    {row.joined || "Oct 12, 2023"}
                                  </p>
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
                                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                                    Company
                                  </p>
                                  <p className="text-slate-700 text-sm font-semibold">
                                    {row.company || "Tech Nova Inc."}
                                  </p>
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-both">
                                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                                    Phone
                                  </p>
                                  <p className="text-slate-700 text-sm font-semibold">
                                    {row.phone || "+1 (555) 000-111"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col gap-4 animate-in fade-in duration-1000">
                                <div className="flex items-center justify-between">
                                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    Payment Methods
                                  </p>
                                  <span className="text-[10px] font-bold text-indigo-600 cursor-pointer hover:underline">
                                    Manage Methods
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {row.cards.map((card: any, i: number) => (
                                    <span
                                      key={i}
                                      className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all cursor-default"
                                    >
                                      {card}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Showing {page} - {limit} of {totalData}
          </span>
          <select
            className="border-2 border-slate-100 outline-none px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-slate-600 focus:border-indigo-500 transition-all cursor-pointer shadow-sm hover:border-slate-200"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} rows
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2.5 rounded-xl border-2 border-slate-50 text-slate-400 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaChevronDown className="rotate-90 text-[10px]" />
          </button>

          <div className="flex gap-1">
            {windowPages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                  p === page
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105"
                    : "text-slate-400 hover:bg-slate-50 border-2 border-transparent hover:border-slate-100 cursor-pointer"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
            className="p-2.5 rounded-xl border-2 border-slate-50 text-slate-400 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaChevronDown className="-rotate-90 text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

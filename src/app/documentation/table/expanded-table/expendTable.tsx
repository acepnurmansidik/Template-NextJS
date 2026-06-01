import { Fragment, useState } from "react";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
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
  toggleRow,
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
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {},
  );

  const toggleExpand = (rowIndex: number) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  const handleSelect = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleSelectAll = () => {
    if (selectedNames.length === data.length) {
      setSelectedNames([]);
    } else {
      setSelectedNames(data.map((item) => item.name));
    }
  };

  const handleToggleCards = (rowIndex: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  return (
    <div className="grid grid-cols-1 items-center">
      {/* =========================== TABLE WRAPPER ============================ */}
      <div className="overflow-hidden">
        <style>{`
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

        <div className="overflow-y-auto max-h-100 custom-scrollbar">
          <table className="w-full text-left transition-colors duration-300">
            <thead className="bg-white dark:bg-zinc-800 sticky top-0 z-10">
              <tr className="text-sm text-gray-900 dark:text-zinc-100">
                {columns
                  .filter((col) => visibleColumns.includes(col.value))
                  .map((col, index) => (
                    <th
                      key={index}
                      className="py-2 px-3 font-bold cursor-pointer select-none"
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

            <tbody>
              {data.length === 0 ? (
                /* ======================= EMPTY STATE MESSAGE ========================== */
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
                          There are no records found in this table. Try adding a
                          new configuration or adjustment.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ======================= DATA RENDERING LIST ========================== */
                data.map((row, rowIndex) => (
                  <Fragment key={rowIndex}>
                    <tr
                      className={`transition text-sm hover:cursor-pointer border-b border-gray-100/50 dark:border-zinc-700/50 ${
                        rowIndex % 2 === 0
                          ? "bg-gray-50 dark:bg-zinc-700/30"
                          : "bg-white dark:bg-transparent"
                      }`}
                      onClick={() => toggleExpand(rowIndex)}
                    >
                      {columns
                        .filter((col) => visibleColumns.includes(col.value))
                        .map((col, indexCol) => (
                          <td
                            key={indexCol}
                            className="py-3 px-3 text-gray-700 dark:text-zinc-300"
                          >
                            {col.value === "*" ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedNames.includes(row.name)}
                                  onChange={() => {
                                    handleSelect(row.name);
                                    toggleSelectName(row.name);
                                  }}
                                  className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 dark:border-zinc-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 relative transition-all hover:border-blue-500 hover:shadow-md"
                                />
                              </div>
                            ) : col.value === "action" ? (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center text-gray-500 dark:text-zinc-400"
                              >
                                <button className="cursor-pointer me-3 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                                  <FaEye size={18} />
                                </button>
                                <button className="cursor-pointer text-blue-700 dark:text-blue-400 me-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                  <FaEdit size={18} />
                                </button>
                                <button className="text-red-500 dark:text-red-400 cursor-pointer hover:text-red-600 dark:hover:text-red-300 transition-colors">
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            ) : col.value === "cards" ? (
                              <div className="flex flex-col gap-1">
                                <div
                                  className={`overflow-hidden transition-all duration-300 ${
                                    expandedCards[rowIndex]
                                      ? "max-h-40"
                                      : "max-h-12"
                                  }`}
                                >
                                  {(expandedCards[rowIndex]
                                    ? row.cards
                                    : row.cards.slice(0, 2)
                                  ).map((card: string, i: number) => (
                                    <div
                                      key={i}
                                      className="text-xs bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 px-2 py-1 rounded mb-1 border border-transparent dark:border-zinc-600/30"
                                    >
                                      {card}
                                    </div>
                                  ))}
                                </div>

                                {row.cards.length > 2 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleCards(rowIndex);
                                      toggleRow(rowIndex);
                                    }}
                                    className="text-blue-600 dark:text-blue-400 text-xs cursor-pointer italic hover:underline mt-1 text-left"
                                  >
                                    {expandedCards[rowIndex]
                                      ? "Show Less"
                                      : `Show More (${row.cards.length - 2})`}
                                  </button>
                                )}
                              </div>
                            ) : (
                              get(row, col.value, "-")
                            )}
                          </td>
                        ))}
                    </tr>

                    {/* ======================= EXPENDED ELEMENT BOX PANEL ========================== */}
                    {expandedRow === rowIndex && (
                      <tr className="bg-gray-50 dark:bg-zinc-700/20">
                        <td
                          colSpan={
                            columns.filter((col) =>
                              visibleColumns.includes(col.value),
                            ).length
                          }
                          className="px-5 py-4"
                        >
                          <div
                            className="rounded-lg p-4 bg-white dark:bg-zinc-800 shadow-md animate-expand transition-colors duration-300"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-gray-900 dark:text-zinc-100 font-semibold text-sm">
                                  {row.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">
                                  {row.email}
                                </p>
                              </div>

                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                                Detail Info
                              </span>
                            </div>

                            <div className="border-t border-gray-100 dark:border-zinc-700 my-4"></div>

                            {/* GRID DETAIL */}
                            <div className="grid grid-cols-2 gap-5 text-gray-800 dark:text-zinc-200">
                              <div>
                                <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                                  Address
                                </p>
                                <p>{row.address || "-"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                                  Joined
                                </p>
                                <p>{row.joined || "-"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                                  Company
                                </p>
                                <p>{row.company}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-1">
                                  Phone
                                </p>
                                <p>{row.phone}</p>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-zinc-700 my-4"></div>

                            {/* CARDS DETAIL */}
                            <div>
                              <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium mb-2">
                                Cards
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {row.cards.map((card: any, i: number) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs rounded-md"
                                  >
                                    {card}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
    </div>
  );
}

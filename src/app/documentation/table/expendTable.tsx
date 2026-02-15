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

  return (
    <div className="grid grid-cols-1 items-center">
      {/* =========================== TABLE WRAPPER ============================ */}
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-100">
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-white sticky top-0 z-10">
              <tr className="text-sm">
                {columns
                  .filter((col) => visibleColumns.includes(col.value))
                  .map((col, index) => (
                    <th
                      key={index}
                      className="py-2 px-3 font-bold cursor-pointer select-none"
                    >
                      {col.value === "*" ? (
                        <>
                          {/* CUSTOM CHECKBOX CSS */}
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
                            className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 checked:bg-blue-600 checked:border-blue-600 relative transition-all hover:border-blue-500 hover:shadow-md"
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
              {data.map((row, rowIndex) => (
                <Fragment key={rowIndex}>
                  <tr
                    className={`transition text-sm hover:cursor-pointer ${
                      rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                    onClick={() => toggleExpand(rowIndex)}
                  >
                    {columns
                      .filter((col) => visibleColumns.includes(col.value))
                      .map((col, indexCol) => (
                        <td key={indexCol} className="py-3 px-3 text-gray-700">
                          {/* ======================= CHECKBOX SELECT COLUMN ========================== */}
                          {col.value === "*" ? (
                            <>
                              {/* CUSTOM CHECKBOX CSS */}
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
                                checked={selectedNames.includes(row.name)}
                                onChange={() => toggleSelectName(row.name)}
                                className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 checked:bg-blue-600 checked:border-blue-600 relative transition-all hover:border-blue-500 hover:shadow-md"
                              />
                            </>
                          ) : col.value === "action" ? (
                            <div>
                              <button className="cursor-pointer me-3">
                                <FaEye size={18} />
                              </button>
                              <button className="cursor-pointer text-blue-700 me-3">
                                <FaEdit size={18} />
                              </button>
                              <button className="text-red-500 cursor-pointer">
                                <FaTrash size={16} />
                              </button>
                            </div>
                          ) : col.value === "cards" ? (
                            <div className="flex flex-col gap-1">
                              {/* Expand cards */}
                              <div
                                className={`overflow-hidden transition-all duration-300 ${
                                  expandedRow === rowIndex
                                    ? "max-h-40"
                                    : "max-h-12"
                                }`}
                              >
                                {(expandedRow === rowIndex
                                  ? row.cards
                                  : row.cards.slice(0, 2)
                                ).map((card: string, i: number) => (
                                  <div
                                    key={i}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded mb-1"
                                  >
                                    {card}
                                  </div>
                                ))}
                              </div>

                              {/* Show more / less */}
                              {row.cards.length > 2 && (
                                <button
                                  onClick={() => toggleRow(rowIndex)}
                                  className="text-blue-600 text-xs cursor-pointer italic hover:underline mt-1 text-left"
                                >
                                  {expandedRow === rowIndex
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

                  {expandedRow === rowIndex && (
                    <tr className="bg-gray-50">
                      <td
                        colSpan={
                          columns.filter((col) =>
                            visibleColumns.includes(col.value),
                          ).length
                        }
                        className="px-5 py-4"
                      >
                        <div
                          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm animate-expand"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {/* HEADER */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-gray-900 font-semibold text-sm">
                                {row.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {row.email}
                              </p>
                            </div>

                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium border border-blue-200">
                              Detail Info
                            </span>
                          </div>

                          <div className="border-t border-gray-200 my-4"></div>

                          {/* GRID DETAIL */}
                          <div className="grid grid-cols-2 gap-5">
                            {/* ADDRESS */}
                            <div>
                              <p className="text-gray-500 text-xs font-medium mb-1">
                                Address
                              </p>
                              <p className="text-gray-800">{row.address}</p>
                            </div>

                            {/* JOINED */}
                            <div>
                              <p className="text-gray-500 text-xs font-medium mb-1">
                                Joined
                              </p>
                              <p className="text-gray-800">{row.joined}</p>
                            </div>

                            {/* COMPANY */}
                            <div>
                              <p className="text-gray-500 text-xs font-medium mb-1">
                                Company
                              </p>
                              <p className="text-gray-800">{row.company}</p>
                            </div>

                            {/* PHONE */}
                            <div>
                              <p className="text-gray-500 text-xs font-medium mb-1">
                                Phone
                              </p>
                              <p className="text-gray-800">{row.phone}</p>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 my-4"></div>

                          {/* CARDS */}
                          <div>
                            <p className="text-gray-500 text-xs font-medium mb-2">
                              Cards
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {row.cards.map((card: any, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================== PAGINATION ============================ */}
      <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <span>
            Showing {page} - {limit} of {totalData}
          </span>

          {/* LIMIT SELECTOR */}
          <select
            className="border-[1.5px] border-gray-300 outline-none px-2 py-1 rounded bg-white"
            value={limit}
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

        <div className="flex hover:cursor-pointer items-center gap-1">
          {/* Previous */}
          {page > 1 && (
            <button
              className="p-1 hover:cursor-pointer rounded hover:text-blue-600"
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
                className="lucide lucide-arrow-left-icon lucide-arrow-left"
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
              onClick={() => setPage(p)}
              className={`hover:cursor-pointer px-3 duration-300 py-1 hover:bg-gray-200 border border-white text-gray-900 rounded ${
                p === page
                  ? "font-bold bg-blue-100 text-blue-500 rounded-md"
                  : ""
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          {page < totalPage && (
            <button
              className="p-1 hover:cursor-pointer rounded hover:text-blue-600"
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
                className="lucide lucide-arrow-right-icon lucide-arrow-right"
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

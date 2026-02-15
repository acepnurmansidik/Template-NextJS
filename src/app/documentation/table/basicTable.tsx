import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { get } from "lodash";

interface DataProps {
  columns: { title: string; value: string }[];
  data: any[];
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
}

const BasicTable = ({
  columns,
  data,
  visibleColumns,
  selectedNames,
  handleSelectAll,
  toggleRow,
  toggleSelectName,
  totalData,
  totalPage,
  expandedRow,
  page,
  limit,
  setPage,
  setLimit,
  windowPages,
}: DataProps) => {
  return (
    <div className="grid grid-cols-1 items-center">
      {/* =========================== TABLE WRAPPER ============================ */}
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-100">
          <table className="w-full text-left">
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
                <tr
                  key={rowIndex}
                  className={`transition text-sm ${
                    rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
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
};

export default BasicTable;

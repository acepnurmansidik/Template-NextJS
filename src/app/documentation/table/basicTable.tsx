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
      <div className="overflow-x-auto transition-all">
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
              <tr
                key={rowIndex}
                className="group hover:bg-slate-50/30 transition-colors"
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
                          <div className="relative flex items-center">
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
                        <div className="flex flex-col gap-1.5 min-w-50">
                          <div
                            className={`flex flex-wrap gap-1 overflow-hidden transition-all duration-300 ${expandedRow === rowIndex ? "max-h-40" : "max-h-14"}`}
                          >
                            {(expandedRow === rowIndex
                              ? row.cards
                              : row.cards.slice(0, 2)
                            ).map((card: string, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-md whitespace-nowrap"
                              >
                                {card}
                              </span>
                            ))}
                          </div>
                          {row.cards.length > 2 && (
                            <button
                              onClick={() => toggleRow(rowIndex)}
                              className="text-indigo-600 text-[10px] font-black hover:underline mt-1 text-left w-fit cursor-pointer uppercase tracking-tighter"
                            >
                              {expandedRow === rowIndex
                                ? "Less"
                                : `+${row.cards.length - 2} more`}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-600 whitespace-nowrap">
                          {get(row, col.value, "-")}
                        </span>
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================== PAGINATION ============================ */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Showing {page} - {limit} of {totalData}
          </span>
          <select
            className="border border-slate-200 outline-none px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-slate-600 focus:border-indigo-500 transition-all cursor-pointer"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 100, 200, 1000].map((n) => (
              <option key={n} value={n}>
                {n} rows
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {page > 1 && (
            <button
              className="p-2 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              onClick={() => setPage(page - 1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          {windowPages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${p === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "text-slate-400 hover:bg-slate-50 cursor-pointer"}`}
            >
              {p}
            </button>
          ))}
          {page < totalPage && (
            <button
              className="p-2 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              onClick={() => setPage(page + 1)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicTable;

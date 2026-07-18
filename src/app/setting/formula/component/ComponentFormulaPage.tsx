"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  ComponentFormulaApiDaum,
  BodyComponentFormulaResponseApiDaum,
} from "@/types/componentFormula";
import { apiGet } from "@/utils/api";
import CreateComponentFormulaModal from "@/components/atoms/modals/create/CreateComponentFormulaModal";
import { TableComponentFormula } from "@/components/atoms/table/tableComponentFormula";

const columns = [
  { title: "Name", value: "name" },
  { title: "Rate Type", value: "rate_type" },
  { title: "Rate", value: "rate" },
  { title: "Decimal", value: "decimal_place" },
  { title: "Used By", value: "used_by" },
  { title: "Action", value: "action" },
];

interface DataProps {
  title: string;
  subtitle: string;
}

export const ComponentFormulaPage = ({ title, subtitle }: DataProps) => {
  const currentUser = useAppSelector((state) => state.iam.data);
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<Record<string, boolean>>({});

  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);

  /* ===================== PAGINATION & SEARCH STATE ===================== */
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 3000),
    [],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const [totalData, setTotalData] = useState<number>(0);
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

  /* ============================ DATA STATE ============================ */
  const [initiateData, setInitiateData] = useState<ComponentFormulaApiDaum[]>(
    [],
  );
  const [, setIsLoading] = useState<boolean>(true);

  const fetchingData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiGet<BodyComponentFormulaResponseApiDaum>(
        "/component-formula",
        { page, limit, search },
        false,
      );
      setInitiateData(result.data ?? []);
      setTotalData(result.page_size ?? 0);
      setIsLoading(false);
    } catch {
      setInitiateData([]);
      setTotalData(0);
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData, isModalCreateOpen]);

  useEffect(() => {
    if (currentUser) {
      const matched = currentUser.role_id.path_access.find(
        (item) => item.path === pathname,
      );
      setHasAccess(matched?.actions ?? {});
    }
  }, [currentUser, pathname]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(1);
    }
  }, [totalPage, page]);

  const windowPages = (() => {
    if (totalData === 0) return [1];
    if (page === 1) return [1, 2, 3].filter((p) => p <= totalPage);
    if (page === totalPage)
      return [totalPage - 2, totalPage - 1, totalPage].filter((p) => p > 0);
    return [page - 1, page, page + 1].filter((p) => p <= totalPage);
  })();

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.value),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column],
    );
  };

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const handleSelectAll = () => {
    const allIds = initiateData.map((item) => item._id);
    const isAllSelected =
      selectedNames.length === allIds.length && allIds.length > 0;
    setSelectedNames(isAllSelected ? [] : allIds);
  };

  const toggleSelectName = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasAccess.create && (
              <button
                onClick={() => setIsModalCreateOpen(true)}
                className="h-8.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer px-4 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
              >
                <FaPlus size={10} className="text-gray-500 dark:text-zinc-400" />
                <span>Create New</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================== CARD ============================ */}
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white dark:bg-zinc-800 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-700">
            <div className="flex flex-col space-y-1.5">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    debouncedSearch(value);
                  }}
                  className="w-full py-1.5 px-1 text-sm border-b-2 border-gray-200 dark:border-zinc-700 outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-500 bg-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 select-none">
                <span className="font-semibold text-gray-500 dark:text-zinc-400">
                  Search
                </span>{" "}
                in name
              </span>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-7.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer px-4 pr-10 outline-none text-gray-700 dark:text-zinc-200 relative transition-all shadow-sm"
                >
                  <span>Select Columns</span>
                  <svg
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 fill-current pointer-events-none transition-transform duration-200 ${
                      isDropdownOpen
                        ? "rotate-180 text-blue-600 dark:text-blue-400"
                        : ""
                    }`}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                      <div className="px-2.5 py-1.5 mb-1 border-b border-gray-100 dark:border-zinc-700 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                        Toggle Visibility
                      </div>
                      {columns.map((col, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2.5 text-xs px-2.5 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-lg cursor-pointer transition-colors text-gray-700 dark:text-zinc-300"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.value)}
                            onChange={() => toggleColumnVisibility(col.value)}
                            className="h-4 w-4 rounded-md border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                          />
                          <span className="font-medium">{col.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================== TABLE ============================ */}
          <TableComponentFormula
            hasAccess={hasAccess}
            columns={columns}
            data={initiateData}
            visibleColumns={visibleColumns}
            selectedNames={selectedNames}
            handleSelectAll={handleSelectAll}
            toggleSelectName={toggleSelectName}
            expandedRow={expandedRow}
            toggleRow={toggleRow}
            page={page}
            limit={limit}
            totalData={totalData}
            totalPage={totalPage}
            setPage={setPage}
            setLimit={setLimit}
            windowPages={windowPages}
            onRefresh={fetchingData}
          />
        </div>
      </div>

      {isModalCreateOpen && (
        <CreateComponentFormulaModal
          isOpen={isModalCreateOpen}
          onClose={() => setIsModalCreateOpen(false)}
          onSuccess={() => {
            setIsModalCreateOpen(false);
            fetchingData();
          }}
        />
      )}
    </CMSLayout>
  );
};

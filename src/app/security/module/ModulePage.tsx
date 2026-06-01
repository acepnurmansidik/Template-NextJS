"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import CreateModuleModal from "@/components/atoms/modals/create/CreateModuleModal";
import { TableModule } from "@/components/atoms/table/tableModule";
import { USER_IAM } from "@/utils/permission";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const columns = [
  { title: "Mark All", value: "*" },
  { title: "Code", value: "name" },
  { title: "Title", value: "title" },
  { title: "Action", value: "action" },
];

export const ModulePage = () => {
  /* ============================= MODALS ============================= */
  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
  /* ============================= PAGINATION STATE ============================= */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // UBAH BAGIAN INI AGAR DINAMIS
  const totalData = USER_IAM.length;
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

  // Pastikan jika page saat ini lebih besar dari totalPage akibat filter, reset ke halaman 1
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
    const allNames = USER_IAM.map((item: any) => item.name);
    const isAllSelected = selectedNames.length === allNames.length;
    setSelectedNames(isAllSelected ? [] : allNames);
  };

  const toggleSelectName = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleDeleteAll = () => {
    setSelectedNames([]);
  };
  return (
    <CMSLayout>
      {/* Container utama: Ditambahkan warna text judul dinamis */}
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          {/* SISI KIRI: Judul dan Deskripsi Dashboard */}
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Module
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Real-time analytics and management for your contacts database.
            </p>
          </div>

          {/* SISI KANAN: Tombol Asli (Tidak Diubah) */}
          <button
            onClick={() => setIsModalCreateOpen(true)}
            className="h-8.5 text-xs font-medium border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer rounded-xs px-4 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-xs"
          >
            <FaPlus size={10} className="text-gray-500 dark:text-zinc-400" />
            <span>Create New</span>
          </button>
        </div>

        {/* Card wrapper tabel: Ditambahkan bg-white dark:bg-zinc-800 */}
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white dark:bg-zinc-800 transition-colors duration-300">
          {/* =========================== TOP FILTER + SEARCH + BUTTON ============================ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-700">
            {/* KIRI: Search Input Component */}
            <div className="flex flex-col space-y-1.5">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-1.5 px-1 text-sm border-b-2 border-gray-200 dark:border-zinc-700 outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-500 bg-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 select-none">
                <span className="font-semibold text-gray-500 dark:text-zinc-400">
                  Search
                </span>{" "}
                in name, phone number, contact
              </span>
            </div>

            {/* KANAN: Action Buttons & Dropdown */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              {/* BUTTON: Delete All */}
              {selectedNames.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="h-7.5 duration-200 font-semibold hover:cursor-pointer text-xs flex gap-2 justify-center text-white items-center bg-red-500 hover:bg-red-600 px-3.5 rounded-xs shadow-xs active:scale-95 transition-all"
                >
                  <FaTrash size={13} />
                  <span>Delete All</span>
                </button>
              )}

              {/* DROPDOWN CONTAINER */}
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-7.5 text-xs font-medium border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer rounded-xs px-4 pr-10 outline-none text-gray-700 dark:text-zinc-200 relative transition-all shadow-xs"
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

                {/* DROPDOWN MENU PANEL */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-sm shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
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
          <TableModule
            columns={columns}
            data={USER_IAM}
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
          />
        </div>
      </div>

      {isModalCreateOpen && (
        <CreateModuleModal
          isOpen={isModalCreateOpen}
          onClose={() => setIsModalCreateOpen(false)}
        />
      )}

      {/* =========================== MODAL CREATE ============================ */}
    </CMSLayout>
  );
};

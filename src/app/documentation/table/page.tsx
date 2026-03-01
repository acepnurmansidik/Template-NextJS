"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import BasicTable from "./basicTable";
import ExpendTable from "./expendTable";

const columns = [
  { title: "Mark All", value: "*" },
  { title: "Contact Name", value: "name" },
  { title: "Company", value: "company" },
  { title: "Cards", value: "cards" },
  { title: "Email", value: "email" },
  { title: "Phone", value: "phone" },
  { title: "Last Contacted", value: "time" },
  { title: "Action", value: "action" },
];
const data = [
  {
    name: "Daniel Moore",
    tag: "Prospect",
    tagColor: "bg-gray-200 text-gray-700",
    company: "Globex",
    email: "DanielMore887@yahoo.com",
    phone: "+(234) 708724513",
    time: "2 days ago",
    cards: [
      "Visa Debit",
      "Mastercard Credit",
      "American Express Credit",
      "JCB Debit",
    ],
  },
  {
    name: "Anna Daniels",
    tag: "Customer",
    tagColor: "bg-green-100 text-green-700",
    company: "Indigo",
    email: "Anna-Dan@hotmail.com",
    phone: "+1(563) 708 724 513",
    time: "1 days ago",
    cards: ["Mastercard Debit", "Visa Credit", "Discover Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Debit",
      "Mastercard Credit",
      "Diners Club Credit",
      "UnionPay Debit",
      "American Express Credit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: ["Visa Credit", "Mastercard Debit", "UnionPay Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Debit",
      "Mastercard Credit",
      "JCB Credit",
      "Discover Credit",
      "American Express Credit",
      "UnionPay Debit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Credit",
      "Mastercard Credit",
      "Diners Club Credit",
      "UnionPay Debit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Debit",
      "Mastercard Debit",
      "American Express Credit",
      "UnionPay Credit",
      "JCB Debit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Credit",
      "Mastercard Credit",
      "Discover Debit",
      "UnionPay Debit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Debit",
      "Mastercard Credit",
      "American Express Credit",
      "Diners Club Credit",
      "UnionPay Debit",
      "JCB Credit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: ["Visa Debit", "Mastercard Debit", "UnionPay Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Mastercard Credit",
      "Visa Credit",
      "American Express Credit",
      "Discover Debit",
      "UnionPay Debit",
    ],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: ["Visa Debit", "Mastercard Credit", "UnionPay Debit", "JCB Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor: "bg-blue-100 text-blue-700",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: [
      "Visa Credit",
      "Mastercard Credit",
      "American Express Credit",
      "UnionPay Credit",
      "Discover Debit",
    ],
  },
];
const Page = () => {
  /* ============================= PAGINATION STATE ============================= */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalData = 42;
  const totalPage = Math.ceil(totalData / limit);

  const windowPages = (() => {
    if (page === 1) return [1, 2, 3];
    if (page === totalPage) return [totalPage - 2, totalPage - 1, totalPage];
    return [page - 1, page, page + 1];
  })();

  // Expand row
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Dropdown select column
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column],
    );
  };

  // Mark All
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const handleSelectAll = () => {
    const allNames = data.map((item) => item.name); // Semua nama
    const isAllSelected = selectedNames.length === allNames.length; // Sudah full select?

    if (isAllSelected) {
      // UNSELECT SEMUA
      setSelectedNames([]);
    } else {
      // SELECT SEMUA
      setSelectedNames(allNames);
    }
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
      {/* BASIC TABLE */}
      <div className="w-full px-6">
        <h5 className="text-3xl font-bold mb-7">Home</h5>
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white">
          {/* =========================== TOP FILTER + SEARCH + BUTTON ============================ */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            {/* Search + Filters */}
            <div className="flex flex-col">
              <div className="relative">
                <FaSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-7 pb-2 border-b-2 border-slate-200 outline-none w-72 focus:border-indigo-500 transition-all text-sm bg-transparent"
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">
                <span className="font-bold">Search</span> in name, phone number,
                contact
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Add New Contact */}
              <button className="bg-black flex gap-2 hover:cursor-pointer justify-center items-center text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition">
                <FaPlus /> Create
              </button>
            </div>
          </div>

          {/* COLUMN SELECTOR */}
          <div className="flex items-center gap-3">
            {/* COLUMN SELECTOR */}
            <div className="py-4 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-xs font-bold border cursor-pointer rounded-lg px-5 py-2 flex items-center gap-2 transition-all duration-200 group ${
                  isDropdownOpen
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-lg text-[10px] font-black transition-transform group-hover:scale-110 ${isDropdownOpen ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {visibleColumns.length}
                </div>
                <span className="tracking-wide">Columns</span>
                <FaChevronDown
                  className={`ml-1 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-indigo-500" : "text-slate-400"}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 z-50 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl overflow-hidden py-3 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                  <div className="px-4 pb-2 mb-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Select Columns
                    </p>
                  </div>

                  <div className="max-h-75 overflow-y-auto px-2">
                    {columns.map((col, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-indigo-50/50 rounded-lg cursor-pointer group transition-colors"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all focus:ring-2 focus:ring-indigo-500/20"
                            checked={visibleColumns.includes(col.value)}
                            onChange={() => toggleColumnVisibility(col.value)}
                          />
                          <svg
                            className="absolute h-3.5 w-3.5 mt-0.5 ml-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
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
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-700 transition-colors">
                          {col.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BULK DELETE ACTION */}
            {selectedNames.length > 0 && (
              <div className="py-4 animate-in fade-in zoom-in-95 slide-in-from-left-4">
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="text-xs font-bold border border-red-100 bg-white cursor-pointer rounded-lg px-5 py-[0.45rem] flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-lg text-[10px] font-black group-hover:scale-110 transition-transform shadow-sm">
                    {selectedNames.length}
                  </div>
                  <span className="tracking-wide">Delete Selected</span>
                  <FaTrash
                    size={12}
                    className="ml-1 text-red-400 group-hover:text-red-600 transition-colors"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 items-center">
            {/* =========================== TABLE ============================ */}
            <BasicTable
              columns={columns}
              data={data}
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
      </div>

      {/* EXPEND TABLE */}
      <div className="w-full px-6 mt-6">
        <h5 className="text-3xl font-bold mb-7">Home</h5>
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white">
          {/* =========================== TOP FILTER + SEARCH + BUTTON ============================ */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            {/* Search + Filters */}
            <div className="flex flex-col">
              <div className="relative">
                <FaSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-7 pb-2 border-b-2 border-slate-200 outline-none w-72 focus:border-indigo-500 transition-all text-sm bg-transparent"
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">
                <span className="font-bold">Search</span> in name, phone number,
                contact
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Add New Contact */}
              <button className="bg-black flex gap-2 hover:cursor-pointer justify-center items-center text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition">
                <FaPlus /> Create
              </button>
            </div>
          </div>

          {/* COLUMN SELECTOR */}
          <div className="flex items-center gap-3">
            {/* COLUMN SELECTOR */}
            <div className="py-4 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-xs font-bold border cursor-pointer rounded-lg px-5 py-2 flex items-center gap-2 transition-all duration-200 group ${
                  isDropdownOpen
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-lg text-[10px] font-black transition-transform group-hover:scale-110 ${isDropdownOpen ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {visibleColumns.length}
                </div>
                <span className="tracking-wide">Columns</span>
                <FaChevronDown
                  className={`ml-1 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-indigo-500" : "text-slate-400"}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 z-50 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl overflow-hidden py-3 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                  <div className="px-4 pb-2 mb-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Select Columns
                    </p>
                  </div>

                  <div className="max-h-75 overflow-y-auto px-2">
                    {columns.map((col, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-indigo-50/50 rounded-lg cursor-pointer group transition-colors"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all focus:ring-2 focus:ring-indigo-500/20"
                            checked={visibleColumns.includes(col.value)}
                            onChange={() => toggleColumnVisibility(col.value)}
                          />
                          <svg
                            className="absolute h-3.5 w-3.5 mt-0.5 ml-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
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
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-700 transition-colors">
                          {col.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BULK DELETE ACTION */}
            {selectedNames.length > 0 && (
              <div className="py-4 animate-in fade-in zoom-in-95 slide-in-from-left-4">
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="text-xs font-bold border border-red-100 bg-white cursor-pointer rounded-lg px-5 py-[0.45rem] flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-lg text-[10px] font-black group-hover:scale-110 transition-transform shadow-sm">
                    {selectedNames.length}
                  </div>
                  <span className="tracking-wide">Delete Selected</span>
                  <FaTrash
                    size={12}
                    className="ml-1 text-red-400 group-hover:text-red-600 transition-colors"
                  />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 items-center">
            {/* =========================== TABLE ============================ */}
            <ExpendTable
              columns={columns}
              data={data}
              visibleColumns={visibleColumns}
              toggleSelectName={toggleSelectName}
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
      </div>
    </CMSLayout>
  );
};

export default Page;

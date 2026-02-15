"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
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
      <div className="w-full px-6 ">
        <h5 className="text-3xl font-bold mb-7">Basic Table</h5>
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white">
          {/* =========================== TOP FILTER + SEARCH + BUTTON ============================ */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            {/* Search + Filters */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Search..."
                className="p-1 border-b border-gray-300 outline-none w-72"
              />
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

          <div className="flex gap-2">
            <div className="relative inline-block mb-4" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xs border-[1.5px] cursor-pointer rounded-md border-gray-300 px-4 py-1 outline-none text-black"
              >
                <span className="me-2">Select Columns</span>
                <svg
                  className={`absolute right-0 top-1/2 -translate-y-1/2 fill-current ${
                    isDropdownOpen ? "rotate-180" : ""
                  } `}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {columns.map((col, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 text-xs p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.value)}
                          onChange={() => toggleColumnVisibility(col.value)}
                        />
                        <span>{col.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedNames.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="relative duration-300 font-bold hover:cursor-pointer text-xs flex gap-2 justify-center text-white items-center bg-red-500 px-3 rounded-md mb-4"
              >
                <FaTrash size={14} /> Delete All
              </button>
            )}
          </div>

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
      <div className="w-full px-6 mt-5">
        <h5 className="text-3xl font-bold mb-7">Expend Table</h5>
        <div className="px-6 py-4 rounded-lg shadow-xs bg-white">
          {/* =========================== TOP FILTER + SEARCH + BUTTON ============================ */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            {/* Search + Filters */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Search..."
                className="p-1 border-b border-gray-300 outline-none w-72"
              />
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

          <div className="flex gap-2">
            <div className="relative inline-block mb-4" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xs border-[1.5px] cursor-pointer rounded-md border-gray-300 px-4 py-1 outline-none text-black"
              >
                <span className="me-2">Select Columns</span>
                <svg
                  className={`absolute right-0 top-1/2 -translate-y-1/2 fill-current ${
                    isDropdownOpen ? "rotate-180" : ""
                  } `}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {columns.map((col, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 text-xs p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.value)}
                          onChange={() => toggleColumnVisibility(col.value)}
                        />
                        <span>{col.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedNames.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="relative duration-300 font-bold hover:cursor-pointer text-xs flex gap-2 justify-center text-white items-center bg-red-500 px-3 rounded-md mb-4"
              >
                <FaTrash size={14} /> Delete All
              </button>
            )}
          </div>

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
    </CMSLayout>
  );
};

export default Page;

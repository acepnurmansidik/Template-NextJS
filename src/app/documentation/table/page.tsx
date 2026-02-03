"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";

const Page = () => {
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
      cards: [
        "Visa Debit",
        "Mastercard Credit",
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
      cards: [
        "Visa Credit",
        "Mastercard Credit",
        "American Express Credit",
        "UnionPay Credit",
        "Discover Debit",
      ],
    },
  ];

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
        <h5 className="text-3xl font-bold mb-7">Table</h5>
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
                            <td
                              key={indexCol}
                              className="py-3 px-3 text-gray-700"
                            >
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
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

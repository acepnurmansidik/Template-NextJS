"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { get } from "lodash";
import { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const Page = () => {
  const columns = [
    { title: "Contact Name", value: "name" },
    { title: "Company", value: "company" },
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
    },
    {
      name: "Anna Daniels",
      tag: "Customer",
      tagColor: "bg-green-100 text-green-700",
      company: "Indigo",
      email: "Anna-Dan@hotmail.com",
      phone: "+1(563) 708 724 513",
      time: "1 days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
    },
    {
      name: "Susan Bella",
      tag: "Lead",
      tagColor: "bg-blue-100 text-blue-700",
      company: "Xepta",
      email: "Sus7667@yahoo.com",
      phone: "+ 19 (67) 288 3825",
      time: "2days ago",
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

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.value),
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column],
    );
  };
  return (
    <CMSLayout>
      <div className="w-full px-6 ">
        <h5 className="text-3xl font-bold mb-7">Home</h5>
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
              <button className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition">
                + Add new
              </button>
            </div>
          </div>

          <div className="relative inline-block mb-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-xs border-[1.5px] cursor-pointer border-gray-300 px-4 py-1 outline-none text-black"
            >
              <span className="me-2">Select Columns</span>
              <div>
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
              </div>
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
                          <th key={index} className="py-2 px-3 font-bold">
                            {col.title}
                          </th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`transition text-sm ${
                          rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        {columns
                          .filter((col) => visibleColumns.includes(col.value))
                          .map((col, indexCol) => (
                            <td
                              key={indexCol}
                              className="py-3 px-3 text-gray-700"
                            >
                              {col.value == "action" ? (
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
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    onClick={() => setPage(page - 1)}
                  >
                    ‹
                  </button>
                )}

                {/* Dynamic Pages */}
                {windowPages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 hover:cursor-pointer border rounded ${
                      p === page ? "bg-gray-900 text-white font-bold" : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {/* Next */}
                {page < totalPage && (
                  <button
                    className="px-3 py-1 border hover:cursor-pointer rounded hover:bg-gray-200"
                    onClick={() => setPage(page + 1)}
                  >
                    ›
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

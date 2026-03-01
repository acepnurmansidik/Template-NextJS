"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

const columns = [
  { title: "Contact Person", value: "name" },
  { title: "Company", value: "company" },
  { title: "Payment Methods", value: "cards" },
  { title: "Email Address", value: "email" },
  { title: "Phone Number", value: "phone" },
  { title: "Activity", value: "time" },
  { title: "Action", value: "action" },
];

const data = [
  {
    name: "Alexander Wright",
    role: "Product Manager",
    tag: "Enterprise",
    tagColor: "bg-purple-50 text-purple-600 border-purple-100",
    company: "TechNova Solutions",
    email: "a.wright@technova.io",
    phone: "+1 (555) 012-3456",
    time: "3 hours ago",
    cards: ["Visa Business", "Amex Platinum"],
  },
  {
    name: "Sarah Jenkins",
    role: "Senior Buyer",
    tag: "Customer",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    company: "Global Logistics Co.",
    email: "s.jenkins@globallog.com",
    phone: "+44 20 7946 0123",
    time: "1 day ago",
    cards: ["Mastercard World", "Apple Pay"],
  },
  {
    name: "Michael Chen",
    role: "CEO",
    tag: "Prospect",
    tagColor: "bg-amber-50 text-amber-600 border-amber-100",
    company: "Stellar Venture",
    email: "m.chen@stellar.vc",
    phone: "+65 8123 4567",
    time: "2 days ago",
    cards: ["Visa Infinite", "Corporate Mastercard", "JCB Gold"],
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Lead",
    tag: "Lead",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    company: "Creative Pulse",
    email: "emily.r@creativepulse.agency",
    phone: "+34 912 345 678",
    time: "5 hours ago",
    cards: ["Visa Debit"],
  },
  {
    name: "David Hassel",
    role: "IT Consultant",
    tag: "Partner",
    tagColor: "bg-slate-50 text-slate-600 border-slate-100",
    company: "CloudBridge Systems",
    email: "david.h@cloudbridge.de",
    phone: "+49 30 123456",
    time: "Just now",
    cards: ["Mastercard Business", "Corporate Amex", "Wire Transfer"],
  },
  {
    name: "Jessica Wong",
    role: "Operations Specialist",
    tag: "Customer",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    company: "Oceanic Trade",
    email: "j.wong@oceanic.hk",
    phone: "+852 2123 4567",
    time: "4 days ago",
    cards: ["Visa Business", "UnionPay Gold"],
  },
  {
    name: "Marcus Thorne",
    role: "Accountant",
    tag: "Enterprise",
    tagColor: "bg-purple-50 text-purple-600 border-purple-100",
    company: "Thorne & Associates",
    email: "marcus@thorne-tax.com",
    phone: "+1 (212) 555-0198",
    time: "1 week ago",
    cards: ["Mastercard Debit", "Discover"],
  },
  {
    name: "Linda Belcher",
    role: "Store Manager",
    tag: "Lead",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    company: "Burger Designs",
    email: "linda@burgerdesigns.com",
    phone: "+1 (555) 987-6543",
    time: "2 hours ago",
    cards: ["Visa Gold", "Mastercard Platinum", "Amex Blue"],
  },
  {
    name: "Robert Kiyosaki",
    role: "Investor",
    tag: "Partner",
    tagColor: "bg-slate-50 text-slate-600 border-slate-100",
    company: "Rich Dad Corp",
    email: "robert@richdad.com",
    phone: "+1 (480) 555-0122",
    time: "3 days ago",
    cards: ["Visa Infinite", "Gold Card"],
  },
  {
    name: "Sonia Gupta",
    role: "Software Architect",
    tag: "Customer",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    company: "DataFlow India",
    email: "sonia.g@dataflow.in",
    phone: "+91 22 1234 5678",
    time: "6 hours ago",
    cards: ["Visa Platinum", "RuPay Corporate"],
  },
  {
    name: "Thomas Muller",
    role: "Regional Sales",
    tag: "Prospect",
    tagColor: "bg-amber-50 text-amber-600 border-amber-100",
    company: "Automotive GR",
    email: "t.mueller@autogr.de",
    phone: "+49 89 9876543",
    time: "12 hours ago",
    cards: ["Mastercard World Elite"],
  },
  {
    name: "Nina Simone",
    role: "Design Director",
    tag: "Enterprise",
    tagColor: "bg-purple-50 text-purple-600 border-purple-100",
    company: "Jazz Creative",
    email: "nina@jazzcreative.com",
    phone: "+33 1 23 45 67 89",
    time: "1 day ago",
    cards: ["Amex Corporate", "Apple Pay"],
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
  return (
    <CMSLayout>
      <div className="w-full px-6 ">
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
          <div className="py-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-xs font-bold border border-slate-200 cursor-pointer rounded-lg px-5 py-[0.4rem] flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600"
            >
              <div className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white rounded-lg text-[10px] font-black group-hover:scale-110 transition-transform">
                {visibleColumns.length}
              </div>
              <span className="tracking-wide mr-2">Columns</span>
              <FaChevronDown
                className={`ml-1 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-indigo-500" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-2 w-64 z-50 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg overflow-hidden py-3 animate-in fade-in zoom-in-95 slide-in-from-top-2"
              >
                <div className="px-4 pb-2 mb-2 border-bottom border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Select Columns
                  </p>
                </div>

                <div className="max-h-75 overflow-y-auto">
                  {columns.map((col, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-indigo-50/50 cursor-pointer group transition-colors"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                          checked={visibleColumns.includes(col.value)}
                          onChange={() => toggleColumnVisibility(col.value)}
                        />
                        <svg
                          className="absolute h-3.5 w-3.5 mt-0.5 ml-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
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
                          className={`py-4 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100 whitespace-nowrap ${col.value === "action" ? "sticky right-0 z-20 bg-slate-50 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]" : col.value === "*" ? "sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-10px_0_15px_rgba(0,0,0,0.011)]" : ""}`}
                        >
                          {col.title}
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
                            className={`py-5 px-6 text-sm border-b border-slate-50 transition-colors ${col.value === "action" ? "sticky right-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-10px_0_15px_rgba(0,0,0,0.011)]" : col.value === "*" ? "sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-10px_0_15px_rgba(0,0,0,0.011)]" : "bg-transparent"}`}
                          >
                            {col.value === "action" ? (
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
                                  ).map((card, i) => (
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
                            ) : col.value === "name" ? (
                              <div className="flex items-center gap-3 min-w-45">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 text-[15px] whitespace-nowrap">
                                    {row.name}
                                  </span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-md w-fit font-black uppercase tracking-widest mt-1 ${row.tagColor} border`}
                                  >
                                    {row.tag}
                                  </span>
                                </div>
                              </div>
                            ) : col.value === "email" ? (
                              <div className="flex items-center gap-2 text-slate-600 font-medium whitespace-nowrap min-w-55">
                                <FaEnvelope
                                  className="text-slate-300"
                                  size={12}
                                />
                                <span className="hover:text-indigo-600 transition-colors cursor-pointer">
                                  {row.email}
                                </span>
                              </div>
                            ) : (
                              <div className="min-w-37.5">
                                <span className="font-semibold text-slate-600 text-sm whitespace-nowrap">
                                  {get(row, col.value, "-")}
                                </span>
                              </div>
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =========================== PAGINATION ============================ */}
            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Showing {Math.min(totalData, 1)} -{" "}
                  {Math.min(limit, totalData)} of {totalData}
                </span>
                <select
                  className="border border-slate-200 outline-none px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-slate-600 focus:border-indigo-500 transition-all cursor-pointer"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} rows
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`p-2 rounded-xl border-2 transition-all ${page === 1 ? "border-slate-50 text-slate-200" : "border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white cursor-pointer"}`}
                >
                  <svg
                    width="16"
                    height="16"
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
                {windowPages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${p === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "text-slate-400 hover:bg-slate-50 cursor-pointer"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPage}
                  onClick={() => setPage(page + 1)}
                  className={`p-2 rounded-xl border-2 transition-all ${page === totalPage ? "border-slate-50 text-slate-200" : "border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white cursor-pointer"}`}
                >
                  <svg
                    width="16"
                    height="16"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

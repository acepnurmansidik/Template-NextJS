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
      <BasicTable
        columns={columns}
        data={data}
        visibleColumns={visibleColumns}
        toggleSelectName={toggleSelectName}
        handleSelectAll={handleSelectAll}
        selectedNames={selectedNames}
        toggleRow={toggleRow}
        expandedRow={expandedRow}
        page={page}
        limit={limit}
        totalData={totalData}
        totalPage={totalPage}
        setPage={setPage}
        setLimit={setLimit}
        windowPages={windowPages}
        toggleColumnVisibility={(val) => toggleColumnVisibility(val)}
        handleDeleteAll={handleDeleteAll}
      />

      {/* EXPEND TABLE */}
      <ExpendTable
        columns={columns}
        data={data}
        visibleColumns={visibleColumns}
        toggleSelectName={toggleSelectName}
        handleSelectAll={handleSelectAll}
        selectedNames={selectedNames}
        toggleRow={toggleRow}
        expandedRow={expandedRow}
        page={page}
        limit={limit}
        totalData={totalData}
        totalPage={totalPage}
        setPage={setPage}
        setLimit={setLimit}
        windowPages={windowPages}
        toggleColumnVisibility={(val) => toggleColumnVisibility(val)}
        handleDeleteAll={handleDeleteAll}
      />
    </CMSLayout>
  );
};

export default Page;

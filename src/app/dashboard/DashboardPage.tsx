"use client";

import BasicTable from "@/app/documentation/table/basic-table/basicTable";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useEffect, useRef, useState } from "react";
import {
  FaTrash,
  FaArrowUp,
  FaEllipsisH,
  FaEye,
  FaUsers,
  FaMousePointer,
  FaEnvelope,
} from "react-icons/fa";

// Import komponen lengkap dari recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts";

// Data points simulasi grafik utama
const chartData = [
  { name: "1 Jan", profit: 7000, revenue: 9500 },
  { name: "4 Jan", profit: 6500, revenue: 8800 },
  { name: "8 Jan", profit: 10500, revenue: 14000 },
  { name: "12 Jan", profit: 8000, revenue: 11000 },
  { name: "15 Jan", profit: 11000, revenue: 15000 },
  { name: "19 Jan", profit: 11200, revenue: 15500 },
  { name: "22 Jan", profit: 9500, revenue: 13000 },
  { name: "26 Jan", profit: 13000, revenue: 17500 },
  { name: "29 Jan", profit: 12000, revenue: 16000 },
];

// Data tambahan untuk Pie, Donut, Radar, dan Treemap
const categoryData = [
  { name: "Retailers", value: 2884 },
  { name: "Distributors", value: 1432 },
  { name: "Wholesalers", value: 562 },
];

const performanceData = [
  { title: "Sales", A: 120, B: 110, fullMark: 150 },
  { title: "Marketing", A: 98, B: 130, fullMark: 150 },
  { title: "Support", A: 86, B: 130, fullMark: 150 },
  { title: "Tech", A: 99, B: 100, fullMark: 150 },
  { title: "Operations", A: 85, B: 90, fullMark: 150 },
  { title: "Product", A: 65, B: 85, fullMark: 150 },
];

const treemapData = [
  {
    name: "Enterprise",
    children: [
      { name: "Globex", size: 4500 },
      { name: "Indigo", size: 3200 },
    ],
  },
  {
    name: "SME",
    children: [
      { name: "Xepta", size: 2100 },
      { name: "Acme", size: 1500 },
    ],
  },
];

const COLORS = ["#3b82f6", "#10b981", "#f97316"];

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

const data: any[] = [
  {
    name: "Daniel Moore",
    tag: "Prospect",
    tagColor: "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300",
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
    tagColor:
      "bg-green-100 text-green-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    company: "Indigo",
    email: "Anna-Dan@hotmail.com",
    phone: "+1(563) 708 724 513",
    time: "1 days ago",
    cards: ["Mastercard Debit", "Visa Credit", "Discover Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
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
    tagColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    company: "Xepta",
    email: "Sus7667@yahoo.com",
    phone: "+ 19 (67) 288 3825",
    time: "2days ago",
    cards: ["Visa Credit", "Mastercard Debit", "UnionPay Credit"],
  },
  {
    name: "Susan Bella",
    tag: "Lead",
    tagColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
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
];

const DashboardPage = () => {
  /* ============================= PAGINATION STATE ============================= */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalData = data.length;
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

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
    const allNames = data.map((item: any) => item.name);
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

  // Helper function untuk format angka curency murni (contoh: 12500 -> "12.500")
  const formatCurrencyPure = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Real-time analytics and management for your contacts database.
            </p>
          </div>
        </div>

        {/* =========================== WIDGET DASHBOARD DENGAN STYLE PRESISI SESUAI SCREENSHOT ============================ */}
        {/* 1. Top Mini Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            {
              title: "Page Views",
              value: "16.431",
              label: "vs. 14,653 last period",
              icon: <FaEye size={16} />,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              title: "Visitors",
              value: "6.225",
              label: "vs. 5,732 last period",
              icon: <FaUsers size={16} />,
              color: "text-emerald-500 bg-emerald-500/10",
            },
            {
              title: "Click",
              value: "2.832",
              label: "vs. 3,294 last period",
              icon: <FaMousePointer size={14} className="rotate-90" />,
              color: "text-purple-500 bg-purple-500/10",
            },
            {
              title: "Orders",
              value: "1.224",
              label: "vs. 1,186 last period",
              icon: <FaEnvelope size={14} />,
              color: "text-amber-500 bg-amber-500/10",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/50 p-5 rounded-2xl shadow-xs transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
                {card.value}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* 2. Middle Main Charts (Area Chart, Day Active & Repeat Rate) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="lg:col-span-2 p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400">
                    Total Profit (Area Chart)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                      446.700
                    </h3>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-1 rounded flex items-center gap-0.5">
                      <FaArrowUp size={7} /> 24.4%
                    </span>
                  </div>
                </div>
                <button className="text-gray-400">
                  <FaEllipsisH size={12} />
                </button>
              </div>

              <div className="h-36 w-full mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="profitGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: "#9ca3af" }}
                      dy={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: "#9ca3af" }}
                      tickFormatter={(v) => formatCurrencyPure(v)}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        formatCurrencyPure(Number(value || 0)),
                        "Profit",
                      ]}
                      contentStyle={{
                        fontSize: "11px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#profitGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-zinc-700/50 pt-4 mt-8">
              {[
                { label: "Customers", val: "2.884", left: "border-blue-500" },
                {
                  label: "Distributors",
                  val: "1.432",
                  left: "border-green-500",
                },
                { label: "Wholesalers", val: "562", left: "border-orange-400" },
              ].map((sg, sIdx) => (
                <div
                  key={sIdx}
                  className={`p-2 bg-gray-50 dark:bg-zinc-900/40 border-l-4 ${sg.left} rounded-r-md`}
                >
                  <span className="text-[10px] text-gray-400 block">
                    {sg.label}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-zinc-200">
                    {sg.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  Most Day Active
                </span>
                <button className="text-gray-400">
                  <FaEllipsisH size={11} />
                </button>
              </div>
              <div className="text-base font-bold mb-3">8.162</div>
              <div className="flex items-end justify-between h-14 px-1">
                {[
                  { d: "Sun", h: "h-[40%]" },
                  { d: "Mon", h: "h-[55%]" },
                  { d: "Tue", h: "h-[90%] bg-blue-500", a: true },
                  { d: "Wed", h: "h-[45%]" },
                  { d: "Thu", h: "h-[60%]" },
                  { d: "Fri", h: "h-[70%]" },
                  { d: "Sat", h: "h-[30%]" },
                ].map((b, bIdx) => (
                  <div key={bIdx} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-3 ${b.h} ${b.a ? "" : "bg-gray-200 dark:bg-zinc-700"} rounded-t-xs`}
                    ></div>
                    <span className="text-[9px] text-gray-400 mt-1">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  Repeat Customer Rate
                </span>
                <button className="text-gray-400">
                  <FaEllipsisH size={11} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center my-1">
                <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center">
                  <div className="absolute inset-0 border-8 border-gray-100 dark:border-zinc-700 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-green-500 rounded-full border-b-transparent border-r-transparent rotate-45"></div>
                  <span className="text-lg font-bold text-gray-900 dark:text-zinc-100 z-10">
                    68%
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">
                  On track for 80% target
                </span>
              </div>
              <button className="text-[10px] font-medium text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 w-full py-1 rounded-md mt-1">
                Show details
              </button>
            </div>
          </div>
        </div>

        {/* =========================== ROW TAMBAHAN: LINE CHART & BAR CHART ============================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Standar Line Chart */}
          <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
              Revenue Trend (Standard Line Chart)
            </span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    className="dark:stroke-zinc-700/50"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrencyPure(v)}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrencyPure(Number(value || 0)),
                      "Revenue",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="linear"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Standar Bar Chart */}
          <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
              Profit vs Revenue (Bar Chart)
            </span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ left: -10, right: 10 }}
                  barGap={0} // <-- TAMBAHKAN INI UNTUK MEMBUAT BAR BERDEMPETAN
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    className="dark:stroke-zinc-700/50"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrencyPure(v)}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrencyPure(Number(value || 0)),
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar
                    dataKey="profit"
                    fill="#3b82f6"
                    radius={[0, 0, 0, 0]}
                    name="Profit"
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#f97316"
                    radius={[0, 0, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =========================== ROW TAMBAHAN: PIE, DONUT, RADAR, TREEMAP ============================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Pie & Donut Chart Box */}
          <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-2">
              Segment Share (Pie & Donut)
            </span>
            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrencyPure(Number(value || 0)),
                    ]}
                  />
                  {/* Inner Pie (Pie biasa) */}
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  {/* Outer Pie (Donut style) */}
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-out-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-medium text-gray-500 mt-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
              Team Performance (Radar Chart)
            </span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={performanceData}
                >
                  {/* Komponen pembentuk grid & axis - Cukup ditulis satu kali */}
                  <PolarGrid
                    stroke="#e5e7eb"
                    className="dark:stroke-zinc-700"
                  />
                  <PolarAngleAxis
                    dataKey="title"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 150]}
                    tick={{ fontSize: 8 }}
                  />

                  {/* Dataset A (Biru) */}
                  <Radar
                    name="A"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />

                  {/* Dataset B (Hijau) */}
                  <Radar
                    name="B"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />

                  {/* Tooltip & Legend - Cukup satu kali */}
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatCurrencyPure(Number(value || 0)),
                      String(name || ""), // Memastikan nilainya selalu bertipe string aman
                    ]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treemap */}
          <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
              Account Matrix Size (Treemap)
            </span>
            <div className="h-56 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  stroke="#fff"
                  fill="#3b82f6"
                >
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrencyPure(Number(value || 0)),
                    ]}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =========================== DATA TABLE CONTAINER (STYLE KAMU TETAP ASLI) ============================ */}
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
    </CMSLayout>
  );
};

export default DashboardPage;

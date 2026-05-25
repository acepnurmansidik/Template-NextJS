"use client";

import { useRef } from "react";
import { formatCurrencyPure } from "@/utils/formatter";
import { CHART_COLORS } from "@/utils/utils"; // Pastikan path ini benar
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/80 p-3 rounded-xl shadow-lg transition-colors duration-200">
        <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5">
          {label}
        </p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.stroke }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              {item.name}:
            </span>
            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">
              {formatCurrencyPure(Number(item.value || 0))}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface DataProps {
  initiateData?: any[];
}

const StandartChartLine = ({ initiateData = [] }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Logic Drag-to-Scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 2; // Kecepatan scroll
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const defaultData = [
    { name: "1 Jan", profit: 7000, revenue: 9500 },
    { name: "4 Jan", profit: 6500, revenue: 8800 },
    { name: "8 Jan", profit: 10500, revenue: 14000 },
    { name: "12 Jan", profit: 8000, revenue: 11000 },
    { name: "15 Jan", profit: 11000, revenue: 15000 },
    { name: "19 Jan", profit: 11200, revenue: 15500 },
    { name: "22 Jan", profit: 9500, revenue: 13000 },
    { name: "23 Jan", profit: 13000, revenue: 17500 },
    { name: "24 Jan", profit: 13000, revenue: 17500 },
    { name: "25 Jan", profit: 13000, revenue: 17500 },
    { name: "26 Jan", profit: 13000, revenue: 17500 },
    { name: "27 Jan", profit: 13000, revenue: 17500 },
    { name: "28 Jan", profit: 13000, revenue: 17500 },
    { name: "29 Jan", profit: 13000, revenue: 17500 },
    { name: "30 Jan", profit: 13000, revenue: 17500 },
  ];

  const chartData = initiateData.length > 0 ? initiateData : defaultData;

  // Mendeteksi key untuk line chart (kecuali 'name')
  const lineKeys = Object.keys(chartData[0]).filter((key) => key !== "name");
  const minWidth = chartData.length * 70;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Financial Trend (Line Chart)
      </span>

      {/* 1. AREA CHART (Scrollable) */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div style={{ width: Math.max(minWidth, 400), height: "100%" }}>
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
                content={<CustomTooltip />}
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              />

              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  strokeDasharray={key === "profit" ? "5 5" : "0"}
                  activeDot={{ r: 6 }}
                  animationDuration={2000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. LEGEND STATIS (Di luar area scroll) */}
      <div className="flex justify-center gap-4 mt-4">
        {lineKeys.map((key, index) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-zinc-400"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandartChartLine;

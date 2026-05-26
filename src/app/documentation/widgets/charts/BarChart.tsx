"use client";

import { useRef } from "react";
import { formatCurrencyPure } from "@/utils/formatter";
import { CHART_COLORS } from "@/utils/utils";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
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
              style={{ backgroundColor: item.fill }}
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

const ChartBar = ({ initiateData = [] }: DataProps) => {
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

  const chartData =
    initiateData.length > 0
      ? initiateData
      : [
          { name: "1 Jan", profit: 7000, revenue: 9500 },
          { name: "4 Jan", profit: 6500, revenue: 8800 },
          { name: "8 Jan", profit: 10500, revenue: 14000 },
          { name: "12 Jan", profit: 8000, revenue: 11000 },
          { name: "15 Jan", profit: 11000, revenue: 15000 },
          { name: "19 Jan", profit: 11200, revenue: 15500 },
          { name: "22 Jan", profit: 9500, revenue: 13000 },
          { name: "26 Jan", profit: 13000, revenue: 17500 },
        ];

  // Mendeteksi semua key kecuali 'name' untuk dijadikan Bar dinamis
  const barKeys = Object.keys(chartData[0]).filter((key) => key !== "name");
  const minWidth = chartData.length * 70;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Financial Trend (Bar Chart)
      </span>

      {/* 1. AREA CHART (Hanya chart yang bisa di-scroll) */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div style={{ width: Math.max(minWidth, 400), height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
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
                cursor={{ fill: "transparent" }}
              />

              {/* LEGEND DIHAPUS DARI SINI */}
              {barKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. LEGEND DIPINDAHKAN KE LUAR (Posisi tetap/statis) */}
      <div className="flex justify-center gap-4 mt-4">
        {barKeys.map((key, index) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-zinc-400"
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

export default ChartBar;

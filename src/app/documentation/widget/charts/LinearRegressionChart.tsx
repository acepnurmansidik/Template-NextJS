"use client";

import { useRef } from "react";
import { formatCurrencyPure } from "@/utils/formatter";
import { CHART_COLORS } from "@/utils/utils";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataProps {
  initiateData?: any[];
}

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
              style={{ backgroundColor: item.fill || item.stroke }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              {item.name}:
            </span>
            <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
              {Number(item.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartLinearRegression = ({ initiateData = [] }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Logic Drag-to-Scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 2;
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Contoh data: Titik (x, y) dan nilai prediksi garis (trend)

  const chartData =
    initiateData.length > 0
      ? initiateData
      : [
          { x: 1, y: 14, trend: 14 },
          { x: 2, y: 17, trend: 18 },
          { x: 3, y: 23, trend: 22 },
          { x: 4, y: 25, trend: 26 },
          { x: 5, y: 32, trend: 30 },
          { x: 6, y: 33, trend: 34 },
          { x: 7, y: 40, trend: 38 },
          { x: 8, y: 41, trend: 42 },
          { x: 9, y: 48, trend: 46 },
          { x: 10, y: 52, trend: 50 },
          { x: 11, y: 53, trend: 54 },
          { x: 12, y: 60, trend: 58 },
          { x: 13, y: 64, trend: 62 },
          { x: 14, y: 65, trend: 66 },
          { x: 15, y: 72, trend: 70 },
          { x: 16, y: 76, trend: 74 },
          { x: 17, y: 77, trend: 78 },
          { x: 18, y: 85, trend: 82 },
          { x: 19, y: 88, trend: 86 },
          { x: 20, y: 92, trend: 90 },
        ];
  const minWidth = chartData.length * 70;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Linear Regression Trend
      </span>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div style={{ width: Math.max(minWidth, 400), height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                className="dark:stroke-zinc-700/50"
              />
              <XAxis
                dataKey="x"
                type="number"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Garis Regresi */}
              <Line
                type="linear"
                dataKey="trend"
                stroke={CHART_COLORS[0]}
                strokeWidth={3}
                dot={false}
                name="Regression Line"
              />

              {/* Titik Data Asli */}
              <Scatter dataKey="y" fill={CHART_COLORS[1]} name="Actual Data" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartLinearRegression;

"use client";

import { useRef } from "react";
import { CHART_COLORS } from "@/utils/utils";
import {
  LineChart,
  Line,
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
              style={{ backgroundColor: item.stroke }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              {item.name}:
            </span>
            <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartVector = ({ initiateData = [] }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = ["Revenue", "Profit", "Cost"];

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

  // Data default untuk representasi vector (garis tegas)
  const chartData =
    initiateData && initiateData.length > 0
      ? initiateData
      : Array.from({ length: 20 }, (_, i) => ({
          name: `Q${i + 1}`,
          Revenue: Math.floor(Math.random() * 500) + 500,
          Profit: Math.floor(Math.random() * 300) + 200,
          Cost: Math.floor(Math.random() * 200) + 100,
        }));

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Performance Vector Analysis
      </span>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      >
        <div style={{ width: 800, height: "100%", pointerEvents: "none" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              style={{ pointerEvents: "auto" }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-zinc-700"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#9ca3af",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              {categories.map((key, index) => (
                <Line
                  key={key}
                  type="linear" // Linear membuat garis vektor tegas
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false} // Dot false membuat tampilan vektor murni
                  activeDot={{ r: 4 }}
                  name={key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Statis */}
      <div className="flex justify-center gap-6 mt-4">
        {categories.map((cat, index) => (
          <div
            key={cat}
            className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-zinc-400"
          >
            <div
              className="w-5 h-0.5"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="font-medium">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartVector;

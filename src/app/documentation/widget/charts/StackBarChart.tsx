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
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              {item.name}:
            </span>
            <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
              {formatCurrencyPure(Number(item.value || 0))}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartStackedBar = ({ initiateData = [] }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
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
          { name: "Jan", profit: 4000, revenue: 2400, eps: 34 },
          { name: "Feb", profit: 3000, revenue: 1398, eps: 20 },
          { name: "Mar", profit: 2000, revenue: 9800, eps: 15 },
        ];
  const barKeys = Object.keys(chartData[0]).filter((key) => key !== "name");
  const minWidth = chartData.length * 70;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Stacked Financial Trend
      </span>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div style={{ width: Math.max(minWidth, 400), height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -10, right: 10 }}>
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

              {/* KUNCI UTAMA: stackId="a" membuat bar bertumpuk */}
              {barKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={
                    index === barKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                  }
                  animationDuration={1500}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Statis */}
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

export default ChartStackedBar;

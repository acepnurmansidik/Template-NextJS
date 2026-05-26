"use client";

import { useRef } from "react";
import { CHART_COLORS } from "@/utils/utils";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataProps {
  initiateData?: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/80 p-3 rounded-xl shadow-lg transition-colors duration-200">
        <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1">
          {data.name}
        </p>
        <div className="text-[10px] text-gray-500 dark:text-zinc-400">
          <p>
            X: {data.x} | Y: {data.y}
          </p>
          <p className="font-bold text-emerald-500">Weight: {data.z}</p>
        </div>
      </div>
    );
  }
  return null;
};

const ChartBubble = ({ initiateData }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = ["Enterprise", "SME", "Startup"];

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

  const generateData = () => {
    return Array.from({ length: 40 }, (_, i) => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      z: Math.floor(Math.random() * 600) + 100,
      name: categories[i % 3],
    }));
  };

  const chartData =
    initiateData && initiateData.length > 0 ? initiateData : generateData();

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Bubble Trend Analysis
      </span>

      {/* Area yang bisa di-drag */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      >
        <div style={{ width: 800, height: "100%", pointerEvents: "none" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 10, right: 10, bottom: 10, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-zinc-700"
              />
              <XAxis
                type="number"
                dataKey="x"
                name="x"
                tick={{ fontSize: 9 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="y"
                tick={{ fontSize: 9 }}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[100, 1000]}
                name="size"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />

              {categories.map((cat, index) => (
                <Scatter
                  key={cat}
                  name={cat}
                  data={chartData.filter((d) => d.name === cat)}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.6}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Statis (Terpisah dari scroll container) */}
      <div className="flex justify-center gap-6 mt-4">
        {categories.map((cat, index) => (
          <div
            key={cat}
            className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-zinc-400"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
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

export default ChartBubble;

"use client";

import { useRef } from "react";
import { CHART_COLORS } from "@/utils/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

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
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartStreamgraph = ({ initiateData = [] }: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = ["Enterprise", "SME", "Startup", "Global"];

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

  const defaultData =
    initiateData.length > 0
      ? initiateData
      : Array.from({ length: 20 }, (_, i) => ({
          name: `T${i + 1}`,
          Enterprise: Math.random() * 20 + 10,
          SME: Math.random() * 20 + 10,
          Startup: Math.random() * 20 + 10,
          Global: Math.random() * 20 + 10,
        }));

  //   //   SAMPLE DATA REAL
  //     const defaultData = [
  //       {
  //         name: "T1",
  //         Enterprise: 22.08318775762462,
  //         SME: 27.46910682217408,
  //         Startup: 12.234437245389852,
  //         Global: 25.18546702263371,
  //       },
  //       {
  //         name: "T2",
  //         Enterprise: 12.259239024524131,
  //         SME: 23.614705389100074,
  //         Startup: 14.555866333771199,
  //         Global: 25.38573807790164,
  //       },
  //       {
  //         name: "T3",
  //         Enterprise: 10.060146983959088,
  //         SME: 22.437359377280995,
  //         Startup: 13.895746874036108,
  //         Global: 25.118969502829597,
  //       },
  //     ];

  const chartData =
    initiateData && initiateData.length > 0 ? initiateData : defaultData;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Streamgraph Trend
      </span>

      {/* Container Drag-to-Scroll */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="h-56 w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      >
        <div style={{ width: 800, height: "100%", pointerEvents: "none" }}>
          <ResponsiveContainer width="100%" height="100%">
            {/* Tambahkan style pointer-events: auto di sini */}
            <AreaChart
              data={chartData}
              stackOffset="silhouette"
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              style={{ pointerEvents: "auto" }}
            >
              <Tooltip content={<CustomTooltip />} />
              {categories.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke="none"
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </AreaChart>
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

export default ChartStreamgraph;

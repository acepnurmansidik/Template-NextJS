"use client";

import { formatCurrencyPure } from "@/utils/formatter";
import { CHART_COLORS } from "@/utils/utils";
import {
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
              {formatCurrencyPure(Number(item.value || 0))}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartRadar = ({ initiateData = [] }: DataProps) => {
  const chartData =
    initiateData.length > 0
      ? initiateData
      : [
          { name: "Sales", A: 120, B: 110 },
          { name: "Marketing", A: 98, B: 130 },
          { name: "Support", A: 86, B: 130 },
          { name: "Tech", A: 99, B: 100 },
          { name: "Operations", A: 85, B: 90 },
          { name: "Product", A: 65, B: 85 },
        ];

  const dataKeys = Object.keys(chartData[0]).filter((key) => key !== "name");

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Team Performance (Radar Chart)
      </span>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" className="dark:stroke-zinc-700" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#9ca3af" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              tick={{ fontSize: 8, fill: "#9ca3af" }}
            />

            {/* Render Radar secara dinamis berdasarkan key yang ditemukan */}
            {dataKeys.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.3}
              />
            ))}

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartRadar;

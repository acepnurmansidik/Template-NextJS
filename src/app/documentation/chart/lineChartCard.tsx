"use client";

import { COLOR_PALETTE } from "@/utils/utility";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomLegend } from "./custom/CustomeLegend";

interface DataProps {
  data: any[];
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
}

export default function LineChartCard({
  data,
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
  legend = true,
}: DataProps) {
  const keys = Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-700">{title}</h3>
          <p className="text-xs text-slate-400">Last 6 Months</p>
        </div>

        {/* Small badge */}
        <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
          +12.5%
        </span>
      </div>

      {/* Chart */}
      <div className="w-full h-52 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              opacity={0.7}
            />
            {xAxis && (
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {yAxis && (
              <YAxis
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
            )}

            {/* Custom Tooltip */}
            {tooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#6366F1", strokeWidth: 1, opacity: 0.2 }}
              />
            )}

            {legend && <Legend content={<CustomLegend />} />}

            {/* Smooth Line */}
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                strokeWidth={3}
                // dot={false}
                // activeDot={{ r: 6 }}
                dot={{
                  stroke: "#6366F1",
                  strokeWidth: 2,
                  r: 4,
                  fill: "white",
                }}
                activeDot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

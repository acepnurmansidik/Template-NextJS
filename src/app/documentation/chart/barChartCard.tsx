"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";

interface DataProps {
  data: any[];
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
}

export default function BarChartCard({
  data,
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
}: DataProps) {
  const keys = Object.keys(data[0]).filter((key) => key !== "name");
  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          +8.4%
        </span>
      </div>

      <div className="h-56 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            {xAxis && (
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {yAxis && (
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {tooltip && <Tooltip content={<CustomTooltip />} />}

            {keys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

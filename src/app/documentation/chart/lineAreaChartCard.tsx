"use client";

import {
  AreaChart,
  Area,
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
}

export default function LineAreaChartCard({ data }: DataProps) {
  const keys = Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">User Growth</h3>

      <div className="h-56 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />
            {keys.map((key, idx) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                stroke={COLOR_PALETTE[idx]}
                fill={COLOR_PALETTE[idx]}
                fillOpacity={0.25}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

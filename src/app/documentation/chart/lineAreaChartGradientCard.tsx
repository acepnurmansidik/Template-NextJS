"use client";

import { COLOR_PALETTE } from "@/utils/utility";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomLegend } from "./custom/CustomeLegend";

const data = [
  { month: "Jan", revenue: 120, profit: 80 },
  { month: "Feb", revenue: 200, profit: 110 },
  { month: "Mar", revenue: 150, profit: 95 },
  { month: "Apr", revenue: 300, profit: 180 },
  { month: "May", revenue: 250, profit: 160 },
  { month: "Jun", revenue: 400, profit: 240 },
];

export default function LineAreaChartGradientCard() {
  const keys = Object.keys(data[0]).filter((k) => k !== "month");

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-3">Earnings Overview</h3>

      <div className="h-64 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {keys.map((k, idx) => (
                <linearGradient
                  key={k}
                  id={`gradient-${k}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLOR_PALETTE[idx]}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLOR_PALETTE[idx]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend content={<CustomLegend />} />

            {keys.map((k, idx) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stroke={COLOR_PALETTE[idx]}
                strokeWidth={2}
                fill={`url(#gradient-${k})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

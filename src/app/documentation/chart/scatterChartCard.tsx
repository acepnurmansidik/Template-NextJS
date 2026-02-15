"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";

interface DataProps {
  title: string;
}

export default function ScatterChartCard({ title }: DataProps) {
  const data = [
    { x: 10, y: 30 },
    { x: 15, y: 22 },
    { x: 20, y: 45 },
    { x: 25, y: 33 },
    { x: 30, y: 50 },
  ];

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="h-72 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              name="Age"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="y"
              name="Spend"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#6366F1", strokeWidth: 1, opacity: 0.2 }}
            />

            <Scatter
              name="Customers"
              data={data}
              fill={COLOR_PALETTE[2]}
              strokeWidth={2}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

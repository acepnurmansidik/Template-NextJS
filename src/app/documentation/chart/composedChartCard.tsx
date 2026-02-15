"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";
import { CustomLegend } from "./custom/CustomeLegend";

interface DataProps {
  data: any[];
  title: string;
}

export default function ComposedChartCard({ data, title }: DataProps) {
  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>

      <div className="h-60 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#6366F1", strokeWidth: 1, opacity: 0.2 }}
            />

            <Legend content={<CustomLegend />} />

            {/* Bar */}
            <Bar
              dataKey="pv"
              barSize={24}
              fill={COLOR_PALETTE[1]}
              radius={[6, 6, 0, 0]}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="uv"
              stroke={COLOR_PALETTE[0]}
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

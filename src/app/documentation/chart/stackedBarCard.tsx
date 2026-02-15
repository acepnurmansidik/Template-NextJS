"use client";

import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";

interface DataProps {
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
}

export default function StackedBarChartCard({
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
}: DataProps) {
  const data = [
    { name: "Mon", food: 300, drink: 180, snack: 90 },
    { name: "Tue", food: 280, drink: 160, snack: 110 },
    { name: "Wed", food: 350, drink: 200, snack: 140 },
  ];

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="h-72 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            {xAxis && (
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {yAxis && (
              <YAxis
                tick={{ fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}

            {tooltip && <Tooltip content={<CustomTooltip />} />}

            <Bar dataKey="food" stackId="a" fill={COLOR_PALETTE[0]} />
            <Bar dataKey="drink" stackId="a" fill={COLOR_PALETTE[1]} />
            <Bar dataKey="snack" stackId="a" fill={COLOR_PALETTE[2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

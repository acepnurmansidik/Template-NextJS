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

interface DataProps {
  data: any[];
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
}

export default function LineAreaChartGradientCard({
  data,
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
  legend = true,
}: DataProps) {
  const keys = Object.keys(data[0]).filter((k) => k !== "month");

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>

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

            {xAxis && (
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}

            {yAxis && (
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}

            {tooltip && <Tooltip content={<CustomTooltip />} />}

            {legend && <Legend content={<CustomLegend />} />}

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

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";

export default function StackedAreaChartCard() {
  const data = [
    { month: "Jan", mobile: 1200, desktop: 800, tablet: 400 },
    { month: "Feb", mobile: 1600, desktop: 1000, tablet: 500 },
    { month: "Mar", mobile: 1800, desktop: 1200, tablet: 600 },
  ];

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Traffic Overview</h3>

      <div className="h-72 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="mobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={COLOR_PALETTE[0]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor={COLOR_PALETTE[0]}
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="desktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={COLOR_PALETTE[1]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor={COLOR_PALETTE[1]}
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="tablet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={COLOR_PALETTE[2]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor={COLOR_PALETTE[2]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis dataKey="month" tick={{ fill: "#94a3b8" }} />
            <YAxis tick={{ fill: "#94a3b8" }} />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="mobile"
              stackId="1"
              stroke={COLOR_PALETTE[0]}
              fill="url(#mobile)"
            />
            <Area
              type="monotone"
              dataKey="desktop"
              stackId="1"
              stroke={COLOR_PALETTE[1]}
              fill="url(#desktop)"
            />
            <Area
              type="monotone"
              dataKey="tablet"
              stackId="1"
              stroke={COLOR_PALETTE[2]}
              fill="url(#tablet)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

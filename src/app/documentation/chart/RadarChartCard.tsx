"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomLegend } from "./custom/CustomeLegend";
import { COLOR_PALETTE } from "@/utils/utility";

interface RadarChartCardProps {
  data: Array<Record<string, number | string>>;
}

// =======================
export default function RadarChartCard({ data }: RadarChartCardProps) {
  if (!data || !data.length) return null;

  // dynamic keys except subject
  const keys = Object.keys(data[0]).filter((k) => k !== "subject");

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Traffic Sources</h3>

      <div className="h-64 chart-no-focus relative">
        <ResponsiveContainer width="100%" height="100%">
          <>
            <RadarChart data={data} outerRadius="80%">
              {/* smoother grid */}
              <PolarGrid stroke="#e5e7eb" strokeOpacity={0.9} />

              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#475569", fontSize: 12 }}
              />

              <PolarRadiusAxis
                angle={30}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                stroke="#cbd5e1"
              />

              <Tooltip content={<CustomTooltip />} />

              {keys.map((key, idx) => {
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];

                return (
                  <Radar
                    key={key}
                    name={key}
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    fill={color}
                    fillOpacity={0.25}
                    dot={{ r: 3, fill: color, stroke: "white", strokeWidth: 1 }}
                  />
                );
              })}
            </RadarChart>

            {/* Legend inside container */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-start">
              <CustomLegend
                payload={keys.map((k, i) => ({
                  value: k,
                  color: COLOR_PALETTE[i],
                }))}
              />
            </div>
          </>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomLegend } from "./custom/CustomeLegend";
import { COLOR_PALETTE } from "@/utils/utility";

interface DonutChartCardProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
}

export default function DonutChartCard({ data, title }: DonutChartCardProps) {
  if (!data || !data.length) return null;

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="h-64 chart-no-focus relative">
        <ResponsiveContainer width="100%" height="100%">
          <>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={6}
                cornerRadius={12}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            {/* Legend inside container */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-start">
              <CustomLegend
                payload={data.map((entry, index) => ({
                  value: entry.name,
                  color: COLOR_PALETTE[index % COLOR_PALETTE.length],
                }))}
              />
            </div>
          </>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

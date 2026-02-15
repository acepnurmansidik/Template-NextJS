"use client";

import { COLOR_PALETTE } from "@/utils/utility";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DataProps {
  data: { name: string; value: number }[];
  title: string;
}

export default function PieChartCard({ data, title }: DataProps) {
  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>

      <div className="h-56 flex items-center justify-center chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {data.map((entry: any, idx: number) => (
                <Cell
                  key={idx}
                  fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active) return null;

  return (
    <div className="custom-tooltip bg-white px-3 py-2 rounded-lg shadow-md border border-slate-200">
      {payload[0].name}: {payload[0].value}%
    </div>
  );
}

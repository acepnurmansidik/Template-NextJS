"use client";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

interface DataProps {
  title: string;
  tooltip?: boolean;
}

const data = [
  { name: "Jan", value: 30, fill: "#4f46e5" },
  { name: "Feb", value: 50, fill: "#6366F1" },
  { name: "Mar", value: 45, fill: "#818cf8" },
  { name: "Apr", value: 60, fill: "#a5b4fc" },
  { name: "Mei", value: 35, fill: "#c7d2fe" },
  { name: "Jun", value: 55, fill: "#e0e7ff" },
  { name: "Jul", value: 40, fill: "#4f46e5" },
  { name: "Agu", value: 65, fill: "#6366F1" },
  { name: "Sep", value: 50, fill: "#818cf8" },
  { name: "Okt", value: 70, fill: "#a5b4fc" },
  { name: "Nov", value: 45, fill: "#c7d2fe" },
  { name: "Des", value: 60, fill: "#e0e7ff" },
];

export default function RoseChartCard({ title, tooltip = true }: DataProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="90%"
            barSize={15}
            data={data}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#334155", fontSize: 12 }}
            />
            {tooltip && <Tooltip content={<CustomTooltip />} />}
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "#f3f4f6" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 min-w-25">
      <p className="text-sm text-slate-700 font-medium">{data.name}</p>
      <p className="text-xs text-slate-400">{data.value}</p>
    </div>
  );
}

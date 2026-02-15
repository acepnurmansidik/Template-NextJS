"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ReferenceArea,
  Customized,
} from "recharts";
import { useState } from "react";

interface DataProps {
  data: any[];
  title: string;
  tooltip?: boolean;
}

// =====================
// Tipe data task
// =====================
type Task = {
  name: string;
  start: number;
  end: number;
  range: [number, number];
};

// =====================
// Sample tasks
// =====================
const currentYear = new Date().getFullYear();

const minTime = new Date(`${currentYear}-01-01`).getTime();
const maxTime = new Date(`${currentYear}-12-31`).getTime();

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function MonthlyGanttChartCard({
  data,
  title,
  tooltip = true,
}: DataProps) {
  const [hoverX, setHoverX] = useState<number | null>(null);
  const tasks: Task[] = data.map((t: any) => ({
    ...t,
    range: [t.start, t.end],
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      {/* Header Bulanan */}
      <div className="grid grid-cols-12 text-center font-semibold text-slate-600 mb-2 ml-30">
        {monthNames.map((m, idx) => (
          <div key={idx}>{m}</div>
        ))}
      </div>

      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={tasks}
            barCategoryGap="20%"
            margin={{ top: 10, right: 40, left: 0, bottom: 10 }}
            onMouseMove={(state) => {
              if (state?.activeCoordinate?.x)
                setHoverX(state.activeCoordinate.x);
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

            {/* Background per bulan */}
            {Array.from({ length: 12 }, (_, i) => {
              const start = new Date(currentYear, i, 1).getTime();
              const end = new Date(currentYear, i + 1, 0).getTime();
              const fill = i % 2 === 0 ? "#f8fafc" : "#f1f5f9";
              return <ReferenceArea key={i} x1={start} x2={end} fill={fill} />;
            })}

            <XAxis
              type="number"
              domain={[minTime, maxTime]}
              tickFormatter={(tick: number) =>
                new Date(tick).toLocaleDateString("id-ID", { month: "short" })
              }
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#334155", fontSize: 13 }}
            />

            {tooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}

            {/* Vertical hover line */}
            <Customized
              component={({ height }: any) =>
                hoverX ? (
                  <line
                    x1={hoverX}
                    x2={hoverX}
                    y1={0}
                    y2={height}
                    stroke="#6366F1"
                    strokeWidth={1.5}
                    opacity={0.35}
                  />
                ) : null
              }
            />

            <Bar
              dataKey="range"
              fill="#4f46e5"
              barSize={30}
              radius={[6, 6, 6, 6]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// =====================
// Custom Tooltip
// =====================
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as Task;
  const formattedRange = `${new Date(data.start).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} - ${new Date(data.end).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 min-w-45">
      <p className="text-xs text-slate-400 mb-1">{data.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-700 font-medium">
          {formattedRange}
        </span>
      </div>
    </div>
  );
}

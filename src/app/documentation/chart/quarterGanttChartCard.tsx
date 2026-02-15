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
// Bisa diganti sesuai kebutuhan
// =====================
const currentYear = new Date().getFullYear();
const rawTasks = [
  {
    name: "Planning",
    start: new Date(`${currentYear}-01-10`).getTime(),
    end: new Date(`${currentYear}-02-20`).getTime(),
  },
  {
    name: "Research",
    start: new Date(`${currentYear}-02-15`).getTime(),
    end: new Date(`${currentYear}-04-10`).getTime(),
  },
  {
    name: "Development",
    start: new Date(`${currentYear}-04-01`).getTime(),
    end: new Date(`${currentYear}-07-15`).getTime(),
  },
  {
    name: "Testing",
    start: new Date(`${currentYear}-06-10`).getTime(),
    end: new Date(`${currentYear}-09-01`).getTime(),
  },
  {
    name: "Production",
    start: new Date(`${currentYear}-09-15`).getTime(),
    end: new Date(`${currentYear}-11-20`).getTime(),
  },
];

const tasks: Task[] = rawTasks.map((t) => ({
  ...t,
  range: [t.start, t.end],
}));

const minTime = new Date(`${currentYear}-01-01`).getTime();
const maxTime = new Date(`${currentYear}-12-31`).getTime();

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

// =====================
// Component utama
// =====================
export default function QuarterGanttChart({
  title,
  tooltip = true,
}: DataProps) {
  const [hoverX, setHoverX] = useState<number | null>(null);

  return (
    <div className="w-full bg-white rounded-xl shadow py-6 px-4">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      {/* Header Kuartal */}
      <div className="grid grid-cols-4 text-center font-semibold text-slate-600 mb-2 ml-30">
        <div>Q1 {currentYear}</div>
        <div>Q2 {currentYear}</div>
        <div>Q3 {currentYear}</div>
        <div>Q4 {currentYear}</div>
      </div>

      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={tasks}
            margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
            onMouseMove={(state) => {
              if (state?.activeCoordinate?.x) {
                setHoverX(state.activeCoordinate.x);
              }
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />

            {/* Background kuartal */}
            <ReferenceArea
              x1={new Date(`${currentYear}-01-01`).getTime()}
              x2={new Date(`${currentYear}-03-31`).getTime()}
              fill="#f8fafc"
            />
            <ReferenceArea
              x1={new Date(`${currentYear}-04-01`).getTime()}
              x2={new Date(`${currentYear}-06-30`).getTime()}
              fill="#f1f5f9"
            />
            <ReferenceArea
              x1={new Date(`${currentYear}-07-01`).getTime()}
              x2={new Date(`${currentYear}-09-30`).getTime()}
              fill="#f8fafc"
            />
            <ReferenceArea
              x1={new Date(`${currentYear}-10-01`).getTime()}
              x2={new Date(`${currentYear}-12-31`).getTime()}
              fill="#f1f5f9"
            />

            <XAxis
              type="number"
              domain={[minTime, maxTime]}
              tickFormatter={(tick: number) =>
                new Date(tick).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                })
              }
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#334155", fontSize: 13 }}
            />

            {tooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                wrapperStyle={{ outline: "none" }}
              />
            )}

            {/* ✅ Vertical highlight only */}
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

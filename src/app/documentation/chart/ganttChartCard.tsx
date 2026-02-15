"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Customized,
} from "recharts";
import { useState } from "react";

interface DataProps {
  data: any[];
  title: string;
}

type Task = {
  name: string;
  start: number;
  end: number;
  range: [number, number];
};

/* ===============================
   Component
================================ */
export default function GanttChartCard({ data, title }: DataProps) {
  const tasks: Task[] = data.map((t) => ({
    ...t,
    range: [t.start, t.end],
  }));

  const minTime = Math.min(...tasks.map((t) => t.start));
  const maxTime = Math.max(...tasks.map((t) => t.end));
  const [hoverX, setHoverX] = useState<number | null>(null);

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="h-72">
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

            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              wrapperStyle={{ outline: "none" }}
            />

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

/* ===============================
   Custom Tooltip
================================ */
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

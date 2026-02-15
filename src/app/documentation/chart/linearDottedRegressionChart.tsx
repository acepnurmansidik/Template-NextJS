"use client";

import {
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";

interface DataProps {
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
}

// ===== Generate dummy data (tanpa minus) =====
function generateData() {
  const data = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * 30;
    const rawY = 2 * x + 10 + noise;

    const y = Math.max(0, rawY); // pastikan tidak minus

    data.push({ x, y });
  }
  return data;
}

// ===== Hitung Linear Regression =====
function computeRegression(data: any[]) {
  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d.x, 0);
  const sumY = data.reduce((acc, d) => acc + d.y, 0);
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0);
  const sumXX = data.reduce((acc, d) => acc + d.x * d.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const minX = Math.min(...data.map((d) => d.x));
  const maxX = Math.max(...data.map((d) => d.x));

  return [
    { x: minX, y: Math.max(0, slope * minX + intercept) },
    { x: maxX, y: Math.max(0, slope * maxX + intercept) },
  ];
}

const scatterData = generateData();
const regressionLine = computeRegression(scatterData);

export default function LinearDottedRegressionScatterChart({
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
}: DataProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {xAxis && (
              <XAxis
                type="number"
                dataKey="x"
                name="X Value"
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
              />
            )}
            {yAxis && (
              <YAxis
                type="number"
                dataKey="y"
                name="Y Value"
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
              />
            )}

            {tooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3" }}
              />
            )}

            {/* TITIK SCATTER (soft red + opacity) */}
            <Scatter
              name="Data Points"
              data={scatterData}
              fill="#4f46e5"
              fillOpacity={0.7}
            />

            {/* GARIS REGRESI */}
            <Line
              type="linear"
              data={regressionLine}
              dataKey="y"
              stroke="#e11d48"
              strokeWidth={2}
              dot={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DataProps {
  title: string;
  xAxis?: boolean;
  yAxis?: boolean;
  tooltip?: boolean;
}

// === FUNCTION: Hitung regression line ===
function computeLinearRegression(data: any[], xKey: string, yKey: string) {
  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d[xKey], 0);
  const sumY = data.reduce((acc, d) => acc + d[yKey], 0);
  const sumXY = data.reduce((acc, d) => acc + d[xKey] * d[yKey], 0);
  const sumXX = data.reduce((acc, d) => acc + d[xKey] * d[xKey], 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((d) => ({
    ...d,
    regression: slope * d[xKey] + intercept,
  }));
}

// === DATA CONTOH ===
const rawData = [
  { day: 1, value: 5 },
  { day: 2, value: 9 },
  { day: 3, value: 7 },
  { day: 4, value: 14 },
  { day: 5, value: 11 },
  { day: 6, value: 18 },
];

const regressionData = computeLinearRegression(rawData, "day", "value");

export default function LinearRegressionChart({
  title,
  xAxis = true,
  yAxis = true,
  tooltip = true,
}: DataProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      {/* FIX: container height jelas + overflow hidden */}
      <div className="w-full h-75 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={regressionData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

            {xAxis && <XAxis dataKey="day" axisLine={false} tickLine={false} />}

            {yAxis && <YAxis axisLine={false} tickLine={false} />}

            {tooltip && <Tooltip />}

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={2}
              dot
            />

            <Line
              type="linear"
              dataKey="regression"
              stroke="#e11d48"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

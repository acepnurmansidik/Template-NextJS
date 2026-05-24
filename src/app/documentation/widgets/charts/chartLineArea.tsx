// Import komponen lengkap dari recharts
import { formatCurrencyPure } from "@/utils/formatter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartLineArea = () => {
  // Data points simulasi grafik utama
  const chartData = [
    { name: "1 Jan", profit: 7000, revenue: 9500 },
    { name: "4 Jan", profit: 6500, revenue: 8800 },
    { name: "8 Jan", profit: 10500, revenue: 14000 },
    { name: "12 Jan", profit: 8000, revenue: 11000 },
    { name: "15 Jan", profit: 11000, revenue: 15000 },
    { name: "19 Jan", profit: 11200, revenue: 15500 },
    { name: "22 Jan", profit: 9500, revenue: 13000 },
    { name: "26 Jan", profit: 13000, revenue: 17500 },
    { name: "29 Jan", profit: 12000, revenue: 16000 },
  ];
  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Revenue Trend (Standard Line Chart)
      </span>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickFormatter={(v) => formatCurrencyPure(v)}
            />
            <Tooltip
              formatter={(value: any) => [
                formatCurrencyPure(Number(value || 0)),
                "Profit",
              ]}
              contentStyle={{
                fontSize: "11px",
                borderRadius: "6px",
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #e5e7eb",
              }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartLineArea;

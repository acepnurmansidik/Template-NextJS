import { formatCurrencyPure } from "@/utils/formatter";

// Import komponen lengkap dari recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts";

const StandartChartLine = () => {
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
          <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              className="dark:stroke-zinc-700/50"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrencyPure(v)}
            />
            <Tooltip
              formatter={(value: any) => [
                formatCurrencyPure(Number(value || 0)),
                "Revenue",
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="linear"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StandartChartLine;

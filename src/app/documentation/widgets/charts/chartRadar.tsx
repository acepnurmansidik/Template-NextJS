import { formatCurrencyPure } from "@/utils/formatter";
// Import komponen lengkap dari recharts
import {
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const ChartRadar = () => {
  const performanceData = [
    { title: "Sales", A: 120, B: 110, fullMark: 150 },
    { title: "Marketing", A: 98, B: 130, fullMark: 150 },
    { title: "Support", A: 86, B: 130, fullMark: 150 },
    { title: "Tech", A: 99, B: 100, fullMark: 150 },
    { title: "Operations", A: 85, B: 90, fullMark: 150 },
    { title: "Product", A: 65, B: 85, fullMark: 150 },
  ];
  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Team Performance (Radar Chart)
      </span>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={performanceData}
          >
            {/* Komponen pembentuk grid & axis - Cukup ditulis satu kali */}
            <PolarGrid stroke="#e5e7eb" className="dark:stroke-zinc-700" />
            <PolarAngleAxis
              dataKey="title"
              tick={{ fontSize: 9, fill: "#9ca3af" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              tick={{ fontSize: 8 }}
            />

            {/* Dataset A (Biru) */}
            <Radar
              name="A"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />

            {/* Dataset B (Hijau) */}
            <Radar
              name="B"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
            />

            {/* Tooltip & Legend - Cukup satu kali */}
            <Tooltip
              formatter={(value: any, name: any) => [
                formatCurrencyPure(Number(value || 0)),
                String(name || ""), // Memastikan nilainya selalu bertipe string aman
              ]}
              contentStyle={{
                fontSize: "11px",
                borderRadius: "6px",
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartRadar;

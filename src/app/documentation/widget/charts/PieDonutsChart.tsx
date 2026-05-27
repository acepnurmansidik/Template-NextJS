import { formatCurrencyPure } from "@/utils/formatter";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/80 p-3 rounded-xl shadow-lg transition-colors duration-200">
        <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5">
          {data.name}
        </p>
        <div className="flex items-center gap-2">
          {/* Menggunakan item.fill untuk warna PieChart */}
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.payload.fill }}
          />
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Value:
          </span>
          <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
            {formatCurrencyPure(Number(data.value || 0))}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface DataProps {
  initiateData?: any[];
}

const ChartPieDonuts = ({ initiateData = [] }: DataProps) => {
  const COLORS = ["#3b82f6", "#10b981", "#f97316"];

  const categoryData =
    initiateData.length > 0
      ? initiateData
      : [
          { name: "Retailers", value: 2884 },
          { name: "Distributors", value: 1432 },
          { name: "Wholesalers", value: 562 },
        ];
  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-2">
        Segment Share (Pie & Donut)
      </span>
      <div className="h-52 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            />
            {/* Inner Pie (Pie biasa) */}
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={45}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* Outer Pie (Donut style) */}
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-out-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 text-[10px] font-medium text-gray-500 mt-2">
        {categoryData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[idx] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPieDonuts;

import { formatCurrencyPure } from "@/utils/formatter";

// Import komponen lengkap dari recharts
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";

const ChartTreeMap = () => {
  const treemapData = [
    {
      name: "Enterprise",
      children: [
        { name: "Globex", size: 4500 },
        { name: "Indigo", size: 3200 },
      ],
    },
    {
      name: "SME",
      children: [
        { name: "Xepta", size: 2100 },
        { name: "Acme", size: 1500 },
      ],
    },
  ];
  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Account Matrix Size (Treemap)
      </span>
      <div className="h-56 w-full text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            stroke="#fff"
            fill="#3b82f6"
          >
            <Tooltip
              formatter={(value: any) => [
                formatCurrencyPure(Number(value || 0)),
              ]}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartTreeMap;

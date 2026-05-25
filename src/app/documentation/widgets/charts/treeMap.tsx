"use client";

import { formatCurrencyPure } from "@/utils/formatter";
import { CHART_COLORS } from "@/utils/utils";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700/80 p-3 rounded-xl shadow-lg transition-colors duration-200">
        <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5">
          {data.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Size:
          </span>
          <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
            {formatCurrencyPure(Number(data.size || 0))}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, depth } = props;

  // Menggunakan index yang diambil dari properti komponen
  // Modulo CHART_COLORS agar tidak pernah undefined
  const fill = CHART_COLORS[index % CHART_COLORS.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fill,
          stroke: "#fff",
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 40 && height > 20 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          className="font-bold select-none"
          dominantBaseline="middle"
        >
          {name}
        </text>
      )}
    </g>
  );
};

const ChartTreeMap = ({ initiateData }: { initiateData?: any[] }) => {
  const defaultData = [
    { name: "Enterprise", size: 4500 },
    { name: "SME", size: 3500 },
    { name: "Xepta", size: 3277 },
    { name: "Global", size: 1200 },
  ];

  const treemapData =
    initiateData && initiateData.length > 0 ? initiateData : defaultData;

  return (
    <div className="p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs transition-colors duration-200">
      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 block mb-4">
        Account Matrix Size (Treemap)
      </span>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartTreeMap;

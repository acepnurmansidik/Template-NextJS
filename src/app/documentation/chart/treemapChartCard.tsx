"use client";

import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomTreemapCell } from "./custom/CustomTreemapCell";

interface DataProps {
  title: string;
}

export default function TreemapChartCard({ title }: DataProps) {
  const data = [
    { name: "Documents", size: 400 },
    { name: "Images", size: 800 },
    { name: "Videos", size: 1200 },
    { name: "Apps", size: 600 },
  ];

  return (
    <div className="p-5 rounded-2xl shadow-xs bg-white border border-slate-100 hover:shadow-md hover:cursor-pointer transition-all duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>

      <div className="h-64 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            width={400}
            height={200}
            data={data}
            dataKey="size"
            stroke="#fff"
            content={<CustomTreemapCell />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

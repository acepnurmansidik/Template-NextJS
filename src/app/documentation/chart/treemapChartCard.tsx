"use client";

import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { CustomTreemapCell } from "./custom/CustomTreemapCell";

export default function TreemapChartCard() {
  const data = [
    { name: "Documents", size: 400 },
    { name: "Images", size: 800 },
    { name: "Videos", size: 1200 },
    { name: "Apps", size: 600 },
  ];

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Storage Usage</h3>

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

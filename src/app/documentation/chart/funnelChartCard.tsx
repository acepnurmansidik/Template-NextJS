"use client";

import {
  FunnelChart,
  Funnel,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./custom/CustomTooltip";
import { COLOR_PALETTE } from "@/utils/utility";
interface DataProps {
  data: any[];
}

export default function FunnelChartCard({ data }: DataProps) {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-3">Sales Funnel</h3>

      <div className="h-72 chart-no-focus">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />

            <Funnel dataKey="value" data={data} isAnimationActive>
              <LabelList
                position="right"
                fill="#475569"
                stroke="none"
                dataKey="name"
                className="font-medium"
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface WaveformData {
  time: number;
  amplitude: number;
  average: number | null;
}

interface DataProps {
  initiateData: WaveformData[];
}

const WaveformAnalysis = ({ initiateData = [] }: DataProps) => {
  // Simulasi data gelombang (sinus)
  const data =
    initiateData.length > 0
      ? initiateData
      : Array.from({ length: 100 }, (_, i) => ({
          time: i * 3.5,
          amplitude: Math.sin(i * 0.4) * 4,
          average: i >= 50 && i <= 65 ? Math.sin(i * 0.4) * 4 : null,
        }));

  console.log(data);

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex gap-6">
        {/* Chart Area */}
        <div className="flex-1 h-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                opacity={0.1}
              />
              <XAxis dataKey="time" hide />
              <YAxis domain={[-4, 4]} />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="amplitude"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              {/* <Line
                type="monotone"
                dataKey="average"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sidebar Info */}
        <div className="w-64 space-y-4">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-[9px] text-zinc-500 font-bold uppercase">
              Measured Frequency
            </p>
            <div className="text-2xl font-mono font-bold mt-1">35.7 MHz</div>
          </div>
          <div className="text-[10px] text-zinc-500 space-y-1">
            <p>Highlighted Cycle (Cycle 3):</p>
            <p className="font-bold text-zinc-800 dark:text-zinc-300">
              Period (T): 28.0 ns
            </p>
            <p className="font-bold text-zinc-800 dark:text-zinc-300">
              Frequency (f = 1/T): 35.7 MHz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformAnalysis;

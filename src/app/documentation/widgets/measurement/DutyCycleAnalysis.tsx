"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

const DutyCycleAnalysis = () => {
  // Data simulasi gelombang kotak (Square Wave)
  const data = [
    { time: 0, amp: 2.5 },
    { time: 100, amp: 2.5 },
    { time: 100, amp: -2.5 },
    { time: 200, amp: -2.5 },
    { time: 200, amp: 2.5 },
    { time: 300, amp: 2.5 },
    { time: 300, amp: -2.5 },
    { time: 350, amp: -2.5 },
  ];

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex gap-6">
        {/* Area Grafik */}
        <div className="flex-1 h-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="5 5" stroke="#e4e4e7" />
              <XAxis
                dataKey="time"
                type="number"
                domain={[0, 350]}
                ticks={[0, 50, 100, 150, 200, 250, 300, 350]}
                fontSize={10}
              />
              <YAxis
                domain={[-5, 5]}
                ticks={[-5.0, -2.5, 0, 2.5, 5.0]}
                fontSize={10}
                label={{
                  value: "AMPLITUDE (V)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10 },
                }}
              />

              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />

              {/* Highlight Area untuk satu siklus */}
              {/* <ReferenceArea
                x1={200}
                x2={300}
                fill="#06b6d4"
                fillOpacity={0.2}
              /> */}

              {/* Garis Gelombang (StepAfter membuat sudut tegak lurus) */}
              <Line
                type="stepAfter"
                dataKey="amp"
                stroke="#1d4ed8"
                strokeWidth={4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Panel Pengukuran */}
        <div className="w-72 space-y-4">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <p className="text-[10px] font-bold text-zinc-400 text-center uppercase">
              Digital Waveform Measurement
            </p>
            <p className="text-[9px] font-bold text-zinc-500 mt-4 mb-1">
              MEASURED DUTY CYCLE:
            </p>
            <div className="text-3xl font-mono font-bold bg-white dark:bg-zinc-900 border rounded p-2 text-center">
              65.0 %
            </div>
          </div>

          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-2">
            <p>Highlighted Cycle (Cycle 2):</p>
            <p className="font-bold text-zinc-800 dark:text-zinc-100">
              High Duration: 16.25 ms;
            </p>
            <p className="font-bold text-zinc-800 dark:text-zinc-100">
              Period (T): 25.0 ms;
            </p>
            <p className="font-bold text-zinc-800 dark:text-zinc-100">
              Duty Cycle (High/T): 65.0 %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyCycleAnalysis;

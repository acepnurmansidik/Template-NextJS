"use client";

import React, { useRef } from "react";
import {
  format,
  addDays,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  differenceInDays,
} from "date-fns";

export interface TaskGanttChartCalendar {
  id: string;
  name: string;
  progress: number;
  status:
    | "Planning"
    | "Development"
    | "Testing"
    | "Deployment"
    | "Done"
    | "OnProgress";
  startIdx: number;
  duration: number;
}

const STATUS_COLORS: any = {
  Planning: "bg-zinc-400", // Netral
  Development: "bg-indigo-600", // Solid
  Testing: "bg-fuchsia-500", // Kontras kuat
  OnProgress: "bg-blue-500", // Terang & menyala
  Deployment: "bg-rose-500", // Bold & Urgent
  Done: "bg-emerald-500", // Calming
};

interface DataProps {
  initiateData: TaskGanttChartCalendar[];
  statusFilter: string[];
}

const GanttChartCalendar = ({
  initiateData = [],
  statusFilter = ["Done", "OnProgress"],
}: DataProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const startDate = startOfMonth(today);
  const totalDays = 90;
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, totalDays - 1),
  });

  // Mendapatkan daftar bulan yang unik untuk header
  const months = [
    {
      start: startDate,
      days: differenceInDays(endOfMonth(startDate), startDate) + 1,
    },
    { start: addDays(endOfMonth(startDate), 1), days: 30 },
    {
      start: addDays(endOfMonth(addDays(endOfMonth(startDate), 1)), 1),
      days: 30,
    },
  ];

  const tasks: TaskGanttChartCalendar[] =
    initiateData.length > 0
      ? initiateData
      : [
          {
            id: "1",
            name: "Market Research",
            status: "Planning",
            startIdx: 2,
            duration: 15,
            progress: 0,
          },
          {
            id: "2",
            name: "UI Design",
            status: "Development",
            startIdx: 17,
            duration: 20,
            progress: 20,
          },
          {
            id: "3",
            name: "UX Design",
            status: "Testing",
            startIdx: 30,
            duration: 14,
            progress: 75.1,
          },
          {
            id: "4",
            name: "Testing App",
            status: "Deployment",
            startIdx: 37,
            duration: 14,
            progress: 67.3,
          },
          {
            id: "5",
            name: "Launching App",
            status: "OnProgress",
            startIdx: 3,
            duration: 7,
            progress: 3,
          },
          {
            id: "6",
            name: "Release to production",
            status: "Done",
            startIdx: 3,
            duration: 7,
            progress: 99,
          },
        ];

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm transition-colors duration-200">
      {/* =========================== HEADER =========================== */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            Project Timeline: Q2 2026
          </h2>
          <p className="text-[10px] text-gray-400">May - July 2026 Overview</p>
        </div>
        <div className="flex gap-4">
          {Object.keys(STATUS_COLORS)
            .filter((status) => statusFilter.includes(status))
            .map((status) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`}
                />
                <span className="text-[10px] text-gray-500 uppercase font-semibold">
                  {status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* =========================== MAIN =========================== */}
      <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="h-20 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 font-bold text-[10px] text-zinc-400">
            TASK NAME
          </div>
          {tasks.map((t) => (
            <div
              key={t.id}
              className="h-12 flex items-center px-4 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800"
            >
              {t.name}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto scrollbar-hide">
          <div style={{ width: days.length * 35 }}>
            <div className="flex flex-col">
              {/* Header Bulan (Sejajar dengan jumlah hari) */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                {months.map((m, i) => (
                  <div
                    key={i}
                    className={`h-8 flex justify-center items-center px-3 font-bold text-[10px] text-zinc-500 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 ${i % 2 == 0 ? " bg-zinc-50 dark:bg-zinc-800" : " bg-zinc-100 dark:bg-zinc-900"}`}
                    style={{ width: m.days * 35 }}
                  >
                    {format(m.start, "MMMM yyyy")}
                  </div>
                ))}
              </div>

              {/* Header Tanggal */}
              <div className="flex h-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                {days.map((day, i) => (
                  <div
                    key={i}
                    className="w-8.75 shrink-0 flex flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="text-[9px] font-bold text-zinc-700 dark:text-zinc-200">
                      {format(day, "d")}
                    </span>
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-500">
                      {format(day, "EEE")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Baris Tugas */}
            <div className="relative">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="h-12 border-b border-zinc-100 dark:border-zinc-800 relative"
                >
                  {/* Container Bar Utama */}
                  <div
                    className={`absolute h-6 top-3 ${STATUS_COLORS[task.status]} rounded-md shadow-sm overflow-hidden flex items-center`}
                    style={{
                      left: task.startIdx * 35 + 2,
                      width: task.duration * 35 - 4,
                    }}
                  >
                    {/* Background Layer (Warna status dengan opacity lebih rendah) */}
                    <div className="absolute inset-0 bg-black/10" />
                    {/* Tampilkan angka progres hanya jika lebar cukup */}

                    <span className="text-[10px] pl-2 z-50 absolute font-bold text-white whitespace-nowrap">
                      {`${task.progress}%`}
                    </span>

                    {/* Progres Bar Layer (Warna yang lebih gelap/pekat) */}
                    {task.progress > 0 && (
                      <div
                        className={`h-full bg-black/20 backdrop-blur-sm ${task.progress <= 99 ? "rounded-l-md" : "rounded-md"} transition-all duration-500 ease-out flex items-center justify-end px-2`}
                        style={{ width: `${task.progress}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChartCalendar;

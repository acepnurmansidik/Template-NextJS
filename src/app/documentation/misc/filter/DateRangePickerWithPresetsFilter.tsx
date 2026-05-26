"use client";

import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const PRESETS = [
  { label: "Today", value: { start: new Date(), end: new Date() } },
  {
    label: "Yesterday",
    value: { start: subDays(new Date(), 1), end: subDays(new Date(), 1) },
  },
  {
    label: "This Week",
    value: { start: startOfWeek(new Date()), end: endOfWeek(new Date()) },
  },
  {
    label: "Last Week",
    value: {
      start: startOfWeek(subDays(new Date(), 7)),
      end: endOfWeek(subDays(new Date(), 7)),
    },
  },
  {
    label: "This Month",
    value: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
  },
];

export default function DateRangePickerWithPresetsFilter() {
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <div className="relative group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Date Range Picker With Presets
      </label>
      <div className="flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl w-fit">
        {/* Sidebar Presets */}
        <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-2 flex flex-col gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() =>
                setState([
                  {
                    startDate: p.value.start,
                    endDate: p.value.end,
                    key: "selection",
                  },
                ])
              }
              className="text-left px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Kalender */}
        <div className="dark">
          <DateRange
            onChange={(item) => setState([item.selection as Range])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            rangeColors={["#3b82f6"]}
            className="bg-transparent!"
          />
        </div>
      </div>
    </div>
  );
}

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
import { FaCheck, FaCopy } from "react-icons/fa";
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

const codeCopied = `import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import { startOfMonth, endOfMonth } from "date-fns";

const [state, setState] = useState<Range[]>([
  { startDate: new Date(), endDate: addDays(new Date(), 7), key: "selection" },
]);

// Sidebar preset → setState({ startDate, endDate, key })
<DateRange
  ranges={state}
  onChange={(item) => setState([item.selection as Range])}
  moveRangeOnFirstSelection={false}
  rangeColors={["#3b82f6"]}
/>`;

export default function DateRangePickerWithPresetsFilter() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Date Range Picker With Presets
        </label>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "code"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Content Here */}
      {activeTab === "preview" ? (
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
      ) : (
        <div className="relative group">
          {/* Tombol Copy */}
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 rounded-md text-zinc-400 hover:text-white z-10"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>

          {/* Simulasi Code Editor */}
          <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700 font-mono text-[13px]">
            <div className="flex p-4 overflow-x-auto">
              <div className="text-zinc-600 text-right pr-4 select-none">
                {codeCopied.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="text-blue-300">
                <code>{codeCopied}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function DateRangeFilter() {
  const [showPicker, setShowPicker] = useState(false);
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Close when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={pickerRef}>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Date Range
      </label>

      <div
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-3 w-full p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
      >
        <FaCalendarAlt className="text-zinc-400" />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          {format(state[0].startDate as Date, "MMM dd, yyyy")} -{" "}
          {format(state[0].endDate as Date, "MMM dd, yyyy")}
        </span>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-2 shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <DateRange
            onChange={(item) => setState([item.selection as Range])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            className="dark:bg-zinc-900 text-sm"
            rangeColors={["#3b82f6"]} // Warna biru Tailwind
          />
        </div>
      )}
    </div>
  );
}

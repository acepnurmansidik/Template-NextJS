"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "react-date-range"; // Ganti dari DateRange ke Calendar
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function SingleDateFilter() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative" ref={pickerRef}>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Select Date
      </label>

      <div
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-3 w-full p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-all text-sm"
      >
        <FaCalendarAlt className="text-zinc-400" />
        <span className="text-zinc-700 dark:text-zinc-200">
          {format(date, "MMM dd, yyyy")}
        </span>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-2 shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <Calendar
            date={date}
            onChange={(item) => {
              setDate(item as Date);
              setShowPicker(false); // Otomatis tutup setelah pilih tanggal
            }}
            color="#3b82f6"
            className="w-full!"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "react-date-range"; // Ganti dari DateRange ke Calendar
import { format } from "date-fns";
import { FaCalendarAlt, FaCheck, FaCopy } from "react-icons/fa";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const codeCopied = `import { useState } from "react";
import { Calendar } from "react-date-range";

const [date, setDate] = useState<Date>(new Date());

<Calendar
  date={date}
  onChange={(item) => setDate(item as Date)}
  color="#3b82f6"
/>`;

export default function SingleDateFilter() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
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
          Select Date
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
        <div className="relative" ref={pickerRef}>
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

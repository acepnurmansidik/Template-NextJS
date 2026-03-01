"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const dummyData = [
  "Naruto",
  "One Piece",
  "Bleach",
  "AOT",
  "Solo Leveling",
  "Jujutsu Kaisen",
  "Hunter x Hunter",
  "Demon Slayer",
];

export default function SearchInputCustom() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>(dummyData);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsTyping(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setIsTyping(false);

      if (!val.trim()) {
        setResults(dummyData);
        return;
      }

      const filtered = dummyData.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase()),
      );

      setResults(filtered.length ? filtered : ["__NOT_FOUND__"]);
    }, 500); // 0.5s debounce
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Bagian Return JSX
  return (
    <div className="relative w-full flex flex-col gap-1.5" ref={wrapperRef}>
      <label className="text-[13px] font-bold text-slate-700 ml-1">
        Search Custom
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
          placeholder="Search anime..."
        />
      </div>

      {showDropdown && (
        <div className="absolute z-30 w-full top-[calc(100%+8px)] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {isTyping ? (
            <div className="p-4 text-sm text-slate-400 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          ) : results[0] === "__NOT_FOUND__" ? (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <FaSearch className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                No results found
              </p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword</p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto p-1.5">
              {results.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setQuery(item);
                    setShowDropdown(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

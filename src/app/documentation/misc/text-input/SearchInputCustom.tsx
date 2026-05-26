"use client";
import React, { useEffect, useRef, useState } from "react";

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

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-sm font-semibold">Search Custom</label>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        className="w-full bg-white mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none placeholder:italic"
        placeholder="Search here..."
      />

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-20 duration-300 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-auto">
          {isTyping ? (
            <div className="p-3 text-sm text-slate-400 italic">Seaching...</div>
          ) : results[0] === "__NOT_FOUND__" ? (
            <div className="p-4 flex flex-col items-center text-center text-slate-500">
              {/* SVG Icon Not Found */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-2 opacity-60"
              >
                <path
                  d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                  fill="#9CA3AF"
                />
              </svg>
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs text-slate-400">Try a different keyword</p>
            </div>
          ) : (
            results.map((item, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                onClick={() => {
                  setQuery(item);
                  setShowDropdown(false);
                }}
              >
                {item}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

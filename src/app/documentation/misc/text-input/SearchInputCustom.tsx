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
      const filtered = val.trim()
        ? dummyData.filter((item) =>
            item.toLowerCase().includes(val.toLowerCase()),
          )
        : dummyData;
      setResults(filtered.length ? filtered : ["__NOT_FOUND__"]);
    }, 500);
  };

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
    <div className="relative w-full group" ref={wrapperRef}>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        Search Custom
      </label>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        placeholder="Search anime..."
      />

      {showDropdown && (
        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-40 overflow-auto">
          {isTyping ? (
            <div className="p-3 text-sm text-zinc-400 animate-pulse">
              Searching...
            </div>
          ) : results[0] === "__NOT_FOUND__" ? (
            <div className="p-6 text-center text-zinc-400 text-xs">
              No results found
            </div>
          ) : (
            results.map((item, i) => (
              <div
                key={i}
                className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300 transition-colors"
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

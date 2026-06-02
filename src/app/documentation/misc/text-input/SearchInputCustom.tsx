"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

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
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
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

  const codeCopied = `<input
  type="text"
  value={query}
  onChange={handleChange}
  onFocus={() => setShowDropdown(true)}
  className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
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
      ["Naruto", "One Piece", "Jujutsu Kaisen"].map((item, i) => (
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
)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  return (
    <div className="relative w-full group" ref={wrapperRef}>
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Search Custom
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

      <div className="">
        {activeTab === "preview" ? (
          <>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
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
                  ["Naruto", "One Piece", "Jujutsu Kaisen"].map((item, i) => (
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
          </>
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
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";

interface SearchItem {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  genres: string[];
}

interface DataProps {
  os: string;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>;
  results: SearchItem[];
  history: string[];
  onSelect: (title: string) => void;
  onClose: () => void;
}

export default function SearchPanelInput({
  os,
  searchQuery,
  isLoading,
  setSearchQuery,
  results,
  history,
  onSelect,
  onClose,
  setSearchHistory,
}: DataProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* CLOSE WHEN CLICK OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* AUTO FOCUS */
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const deleteHistory = (item: string) => {
    setSearchHistory((prev) => prev.filter((h) => h !== item));
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      onSelect(searchQuery);
      setSearchHistory((prev: string[]) => {
        const cleaned = searchQuery.trim();
        if (prev.includes(cleaned)) return prev;
        return [...prev, cleaned];
      });
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative flex gap-2 flex-col w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* SEARCH INPUT */}
        <div className="relative p-4 border-b border-zinc-100 dark:border-zinc-800">
          <span className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-400">
            <FaSearch size={16} />
          </span>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            className="w-full bg-zinc-50 dark:bg-zinc-950 pl-10 pr-24 py-3 border border-zinc-200 dark:border-zinc-700 outline-none rounded-xl text-sm placeholder:text-zinc-400 dark:text-zinc-100 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Search here..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleEnterSearch}
          />

          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <IoIosClose size={22} />
            </button>
          )}

          <span className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-2 select-none">
            <span className="hidden md:inline bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              {os === "mac" ? "⌘ + K" : "Ctrl + K"}
            </span>
          </span>
        </div>

        {/* SEARCH RESULT PANEL */}
        <div className="max-h-100 overflow-y-auto p-4">
          {/* HISTORY */}
          {searchQuery.trim() === "" && history.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Recent Searches
                </h4>
                <button
                  onClick={() => setSearchHistory([])}
                  className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {history
                  .slice(-4)
                  .reverse()
                  .map((item, i) => (
                    <div
                      key={i}
                      className="flex px-2 py-1.5 justify-between items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <p
                        onClick={() => onSelect(item)}
                        className="text-sm dark:text-zinc-300 w-full"
                      >
                        {item}
                      </p>
                      <button
                        onClick={() => deleteHistory(item)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <IoIosClose size={20} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* RESULTS */}
          <div className="flex flex-col gap-2">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse"
                />
              ))
            ) : results.length === 0 && searchQuery.trim() !== "" ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-500">
                {/* --- Custom SVG Icon --- */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 200 200"
                  fill="none"
                  className="mb-4 opacity-50 dark:opacity-40"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="6 10"
                    className="text-zinc-300 dark:text-zinc-700"
                  />
                  <path
                    d="M130 130 L160 160"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="text-zinc-400 dark:text-zinc-600"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-zinc-400 dark:text-zinc-600"
                  />
                </svg>

                {/* Title */}
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  No Results Found
                </p>

                {/* Subtitle */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-60 leading-relaxed">
                  We couldn’t find any matches for
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                    {" "}
                    "{searchQuery}"
                  </span>
                  . Try checking the spelling or using different keywords.
                </p>
              </div>
            ) : (
              results.map((dataItem) => (
                <div
                  key={dataItem.id}
                  onClick={() => onSelect(dataItem.title)}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-all"
                >
                  <div className="w-12 h-16 rounded-md overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-700">
                    <Image
                      src={dataItem.thumbnail}
                      alt={dataItem.title}
                      width={48}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold dark:text-zinc-100">
                      {dataItem.title}
                    </p>
                    <p className="text-xs text-zinc-500">{dataItem.category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dataItem.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-1.5 py-0.5 text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded uppercase font-bold"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

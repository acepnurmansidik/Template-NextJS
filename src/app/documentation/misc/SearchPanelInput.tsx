"use client";

import { FaSearch, FaHistory, FaRegFrown } from "react-icons/fa";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { IoIosClose, IoMdReturnRight } from "react-icons/io";
import { HiOutlineArrowRight } from "react-icons/hi2";

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
  }, [onClose]);

  /* AUTO FOCUS */
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const deleteHistory = (item: string) => {
    setSearchHistory((prev) => prev.filter((h: any) => h !== item));
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      onSelect(searchQuery);
      setSearchHistory((prev) => {
        const cleaned = searchQuery.trim();
        if (prev.includes(cleaned)) return prev;
        return [...prev, cleaned];
      });
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[12vh] px-4 overflow-hidden animate-in fade-in duration-300">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* SEARCH PANEL */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-top-8 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* SEARCH INPUT AREA */}
        <div className="relative border-b border-slate-100 bg-white p-2">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <FaSearch size={16} />
            </span>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              className="w-full bg-transparent pl-12 pr-36 py-4 outline-none text-base text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
              placeholder="Search anything..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnterSearch}
            />

            <div className="absolute right-4 flex items-center gap-3">
              {searchQuery.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <IoIosClose size={24} />
                </button>
              )}

              <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-400 tracking-tighter select-none uppercase">
                {os === "mac" ? "⌘ + K" : "Ctrl + K"}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 max-h-[65vh] overflow-y-auto custom-scrollbar p-2 bg-slate-50/30">
          {/* HISTORY SECTION */}
          {searchQuery.trim() === "" && history.length > 0 && (
            <div className="p-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex justify-between items-center px-2 mb-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FaHistory size={10} /> Recent Searches
                </h4>
                <button
                  onClick={() => setSearchHistory([])}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {history
                  .slice(-6)
                  .reverse()
                  .map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-center justify-between px-3 py-2.5 hover:bg-white hover:border-slate-200 border border-transparent rounded-xl transition-all cursor-pointer"
                    >
                      <div
                        onClick={() => onSelect(item)}
                        className="flex items-center gap-3 flex-1"
                      >
                        <FaHistory
                          className="text-slate-300 group-hover:text-indigo-500"
                          size={12}
                        />
                        <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">
                          {item}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteHistory(item)}
                        className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoIosClose size={24} />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="h-px bg-slate-100 my-4 mx-2" />
            </div>
          )}

          {/* QUERY LABEL */}
          {searchQuery.trim() !== "" && (
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                <span>Searching for</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  "{searchQuery}"
                </span>
              </div>
            </div>
          )}

          {/* RESULTS LIST */}
          <div className="flex flex-col gap-1 p-2">
            {isLoading ? (
              /* SKELETON */
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 animate-pulse bg-white/50 rounded-xl"
                >
                  <div className="w-14 h-20 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-2/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/3 bg-slate-200 rounded" />
                    <div className="flex gap-2">
                      <div className="h-5 w-12 bg-slate-200 rounded-md" />
                      <div className="h-5 w-12 bg-slate-200 rounded-md" />
                    </div>
                  </div>
                </div>
              ))
            ) : results.length === 0 && searchQuery.trim() !== "" ? (
              /* NOT FOUND */
              <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-inner">
                  <FaRegFrown className="text-slate-300" size={32} />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  No matches found
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-70 text-center leading-relaxed font-medium">
                  We couldn't find any results for{" "}
                  <span className="text-slate-600 underline underline-offset-4 font-bold italic">
                    "{searchQuery}"
                  </span>
                </p>
              </div>
            ) : (
              /* DATA ITEMS */
              results.map((dataItem) => (
                <div
                  key={dataItem.id}
                  onClick={() => onSelect(dataItem.title)}
                  className="group flex items-center gap-4 p-3 bg-transparent hover:bg-white hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-200 rounded-2xl cursor-pointer transition-all duration-300"
                >
                  <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 shadow-sm transition-transform group-hover:scale-[1.02]">
                    <Image
                      src={dataItem.thumbnail}
                      alt={dataItem.title}
                      width={60}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate pr-4">
                        {dataItem.title}
                      </p>
                      <HiOutlineArrowRight className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {dataItem.category}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {dataItem.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-md whitespace-nowrap"
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

        {/* FOOTER ACTION */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <IoMdReturnRight className="text-indigo-500" /> Select
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-white border border-slate-200 px-1 rounded shadow-sm">
                ESC
              </span>{" "}
              Close
            </span>
          </div>
          <p className="italic lowercase font-normal tracking-normal text-[10px]">
            Results powered by your history
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

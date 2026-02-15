"use client";

import { FaSearch } from "react-icons/fa";
import { useEffect, useRef } from "react";
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
    <div className="w-full h-full top-0 left-0 right-0 bottom-0 absolute z-50">
      <div className="w-full h-full bg-gray-50 opacity-0"></div>

      <div
        ref={panelRef}
        className="absolute flex gap-2 flex-col top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl"
      >
        {/* SEARCH INPUT */}
        <div className="col-span-2">
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              <FaSearch />
            </span>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              className="w-full bg-white shadow-md pl-10 pr-24 py-3 border border-slate-300 outline-none rounded-xl text-sm placeholder:italic"
              placeholder="Search here..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnterSearch}
            />

            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-16 flex items-center text-gray-400 hover:text-black"
              >
                <IoIosClose size={22} />
              </button>
            )}

            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs gap-2 select-none">
              {os === "mac" ? (
                <span className="hidden md:inline bg-gray-100 px-2 py-0.5 rounded">
                  ⌘ + K
                </span>
              ) : (
                <span className="hidden md:inline bg-gray-100 px-2 py-0.5 rounded">
                  Ctrl / Win + K
                </span>
              )}
            </span>
          </div>
        </div>

        {/* SEARCH RESULT PANEL — ALWAYS SHOW */}
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-4 shadow-md max-h-96 overflow-y-auto duration-300">
          {/* HISTORY ONLY WHEN QUERY EMPTY */}
          {searchQuery.trim() === "" && history.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center hover:text-red-500">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">
                  Recent Searches
                </h4>
                <button
                  onClick={() => setSearchHistory([])}
                  className="p-1 rounded-full text-xs hover:cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {history
                  .slice(-6)
                  .reverse()
                  .map((item, i) => (
                    <div
                      key={i}
                      className="flex px-2 hover:bg-gray-100 py-0.5 justify-between items-center rounded-md"
                    >
                      <p
                        onClick={() => onSelect(item)}
                        className="cursor-pointer w-full"
                      >
                        {item}
                      </p>

                      <button
                        onClick={() => deleteHistory(item)}
                        className="p-1 rounded-full hover:text-red-500"
                      >
                        <IoIosClose size={30} />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="border-b mt-3 mb-3"></div>
            </div>
          )}

          {/* LABEL */}
          {searchQuery.trim() !== "" && (
            <label className="flex gap-1 mb-2">
              <p className="italic text-gray-500">Result for</p>
              <p className="font-bold">{searchQuery}</p>
            </label>
          )}

          {/* MAIN RESULT */}
          <div className="flex flex-col gap-3">
            {isLoading ? (
              /* LOADING SKELETON */
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 animate-pulse"
                  >
                    <div className="w-12.5 h-17.5 bg-gray-300 rounded-md" />
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                      <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : results.length === 0 && searchQuery.trim() !== "" ? (
              /* NOT FOUND */
              // STYLE 1: SIMPLE
              // <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              //   <svg
              //     xmlns="http://www.w3.org/2000/svg"
              //     className="h-14 w-14 text-gray-400 mb-3"
              //     fill="none"
              //     viewBox="0 0 24 24"
              //     strokeWidth="1.5"
              //     stroke="currentColor"
              //   >
              //     <path
              //       strokeLinecap="round"
              //       strokeLinejoin="round"
              //       d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z"
              //     />
              //   </svg>

              //   <p className="text-sm font-semibold">No Results Found</p>

              //   <p className="text-xs text-gray-400 mt-1">
              //     We couldn’t find any matches for{" "}
              //     <span className="font-semibold">{searchQuery}</span>.
              //   </p>
              // </div>

              // STYLE 2: CUSTOM SVG + BETTER TYPOGRAPHY
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 animate-fadeIn">
                {/* --- Custom SVG Icon (magnifier + dotted circle) --- */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 200 200"
                  fill="none"
                  className="mb-4 opacity-80"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                    strokeDasharray="6 10"
                  />
                  <path
                    d="M130 130 L160 160"
                    stroke="#94a3b8"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    stroke="#94a3b8"
                    strokeWidth="10"
                  />
                </svg>

                {/* Title */}
                <p className="text-base font-semibold text-gray-700">
                  No Results Found
                </p>

                {/* Subtitle */}
                <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
                  We couldn’t find any matches for
                  <span className="font-semibold text-gray-600">
                    {" "}
                    "{searchQuery}"
                  </span>
                  . Try checking the spelling or using different keywords.
                </p>
              </div>
            ) : (
              /* RESULT LIST */
              results.map((dataItem) => (
                <div
                  key={dataItem.id}
                  onClick={() => onSelect(dataItem.title)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div className="w-12.5 h-17.5 rounded-md overflow-hidden shrink-0 bg-gray-200">
                    <Image
                      src={dataItem.thumbnail}
                      alt={dataItem.title}
                      width={50}
                      height={70}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-bold">{dataItem.title}</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {dataItem.category}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                      {dataItem.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md whitespace-nowrap"
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

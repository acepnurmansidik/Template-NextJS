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

interface Props {
  os: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>;
  results: SearchItem[];
  history: string[];
  onSelect: (title: string) => void;
  onClose: () => void;
}

export default function SearchPanel({
  os,
  searchQuery,
  setSearchQuery,
  results,
  history,
  onSelect,
  onClose,
  setSearchHistory,
}: Props) {
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
      onSelect(searchQuery); // trigger pencarian

      // simpan ke history
      setSearchHistory((prev) => {
        const cleaned = searchQuery.trim();
        if (prev.includes(cleaned)) return prev; // hindari duplikat
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
        {/* INPUT SEARCH */}
        <div className="col-span-2">
          <div className="relative mt-1">
            {/* Icon Search */}
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              <FaSearch />
            </span>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              className="w-full bg-white shadow-md pl-10 pr-24 py-3 border border-slate-300 outline-none rounded-xl text-sm placeholder:italic"
              placeholder="Search here..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnterSearch}
            />

            {/* Tombol Clear (X) */}
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 hover:cursor-pointer right-16 flex items-center text-gray-400 hover:text-black"
              >
                <IoIosClose size={22} />
              </button>
            )}

            {/* Hotkey */}
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

        {/* SEARCH RESULT */}
        <div
          className={`col-span-2 rounded-xl border border-gray-200 bg-white p-4 shadow-md max-h-96 overflow-y-auto duration-300 ${results.length ? "block" : "hidden"}`}
        >
          {/* HISTORY SECTION */}
          {history.length > 0 && (
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

              <div className="flex flex-wrap flex-col gap-2">
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
                        className="p-1 rounded-full hover:text-red-500 hover:cursor-pointer"
                      >
                        <IoIosClose size={30} />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="border-b mt-3 mb-3"></div>
            </div>
          )}

          {/* SEARCH RESULT */}

          <label className="flex gap-1">
            <p className="italic">Result in</p>
            <p className="font-bold">{searchQuery}</p>
          </label>

          {results.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.map((search) => (
                <div
                  key={search.id}
                  onClick={() => onSelect(search.title)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  {/* Thumbnail 50x70 fix */}
                  <div className="w-12.5 h-17.5 rounded-md overflow-hidden shrink-0 bg-gray-200">
                    <Image
                      src={search.thumbnail}
                      alt={search.title}
                      width={50}
                      height={70}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-bold">{search.title}</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {search.category}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {search.genres.map((genre) => (
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
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

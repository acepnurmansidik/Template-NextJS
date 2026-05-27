"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import SearchPanelInput from "./SearchPanelInput";
import NumberSeparatorInput from "./NumberSeparatorInput";
import NumberCurrencyInput from "./NumberCurrencyInput";
import SearchInputCustom from "./SearchInputCustom";
import TextInput from "./textInput";
import NumberInput from "./numberInput";
import TextAreaInput from "./textAreaInput";
import MultiSelect from "./MultiSelect";
import SearchableSelect from "./SearchableSelect";
import AsyncGroupedSelect from "./AsyncGroupedSelect";
import MultiSelectWithDrag from "./MultiSelectWithDrag";

const animeList = [
  {
    id: 1,
    title: "Naruto Shippuden",
    category: "Anime",
    genres: ["Adventure"],
    thumbnail:
      "https://images.unsplash.com/photo-1594007759138-855170ec8dc0?q=80&w=776&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Attack on Titan",
    category: "Anime",
    genres: ["Adventure"],
    thumbnail:
      "https://images.unsplash.com/photo-1557343133-b5cf261ace6b?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    category: "Anime",
    genres: ["Adventure"],
    thumbnail:
      "https://images.unsplash.com/photo-1722573783570-9811ce67025e?q=80&w=654&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "One Piece",
    category: "Anime",
    genres: ["Adventure", "Sci-Fi"],
    thumbnail:
      "https://images.unsplash.com/photo-1621478374422-35206faeddfb?q=80&w=1740&auto=format&fit=crop",
  },
];

const Page = () => {
  /* =============== SEARCH PANEL LOGIC ===================== */
  const [showSearchOpen, setShowSearchOpen] = useState<boolean>(false);
  const [os, setOS] = useState<string>("unknown");
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("win")) setOS("windows");
    else if (userAgent.includes("mac")) setOS("mac");
    else if (userAgent.includes("linux")) setOS("linux");
    else if (userAgent.includes("android")) setOS("android");
    else if (userAgent.includes("iphone") || userAgent.includes("ipad"))
      setOS("ios");
  }, []);

  // Hotkey listener
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      const isMac = os === "mac";
      const isWin = os === "windows" || os === "linux";

      if (isMac && e.metaKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearchOpen(true);
      }

      if (isWin && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, [os]);

  /* ================== SEARCH STATE ====================== */
  const [filteredMovie, setFilteredMovie] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  useEffect(() => {
    // Jika user hapus input → reset data
    if (!searchQuery.trim()) {
      setFilteredMovie(animeList);
      setIsLoadingSearch(false);
      return;
    }

    setIsLoadingSearch(true);

    const timeout = setTimeout(() => {
      const results = animeList.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredMovie(results);
      setIsLoadingSearch(false);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [searchQuery, animeList]);

  /* ================== SELECT MOVIE ====================== */
  const handleSelectMovie = (title: string) => {
    setSearchQuery(title);

    setSearchHistory((prev) =>
      prev.includes(title) ? prev : [...prev, title],
    );
  };

  /* ======================================================= */

  return (
    <CMSLayout>
      <div className="w-full px-6 ">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Text Input
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              A comprehensive suite of form controls designed for consistent and
              efficient data entry across the platform.
            </p>
          </div>
        </div>

        {/* Scroll Navigation */}
        <div className="py-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            {/* MULTIPLE SELECT */}
            <MultiSelect />

            {/* MULTIPLE SELECT */}
            <SearchableSelect />

            <AsyncGroupedSelect />
            <MultiSelectWithDrag />
          </div>
          {/* Input Section */}
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div className="group">
              {/* Label/Tag yang Konsisten dengan Komponen Lain */}
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                Search Panel
              </label>

              <div
                className="relative flex items-center w-full cursor-pointer transition-all duration-200 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-full hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md"
                onClick={() => setShowSearchOpen(true)}
              >
                {/* Icon Search */}
                <span className="absolute left-4 text-zinc-400 dark:text-zinc-600">
                  <FaSearch size={14} />
                </span>

                {/* Input Dummy */}
                <input
                  type="text"
                  readOnly
                  className="w-full bg-transparent pl-12 pr-20 py-3 text-sm outline-none cursor-pointer placeholder:italic placeholder:text-zinc-400 dark:text-zinc-100"
                  placeholder="Search anything..."
                />

                {/* Shortcut Label */}
                <span className="absolute right-3 flex items-center gap-2 select-none">
                  <span className="hidden md:inline bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">
                    {os === "mac" ? "⌘ + K" : "Ctrl + K"}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* CUSTOM SEARCH INPUT WITH DROPDOWN */}
            <SearchInputCustom />

            {/* TEXT INPUT */}
            <TextInput />

            {/* NUMBER INPUT */}
            <NumberInput />

            {/* NUMBER INPUT WITH THOUSAND SEPARATOR */}
            <NumberSeparatorInput />

            {/* NUMBER INPUT WITH CURRENCY FORMAT */}
            <NumberCurrencyInput country={"en-US"} />

            {/* TEXT AREA */}
            <TextAreaInput />
          </div>
        </div>
      </div>

      {/* SEARCH PANEL (MODULAR) */}
      {showSearchOpen && (
        <SearchPanelInput
          os={os}
          isLoading={isLoadingSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          results={filteredMovie}
          history={searchHistory}
          setSearchHistory={setSearchHistory}
          onSelect={handleSelectMovie}
          onClose={() => setShowSearchOpen(false)}
        />
      )}
    </CMSLayout>
  );
};

export default Page;

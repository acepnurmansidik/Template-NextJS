"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ScrollNavigation from "./scrollNavigation";
import SearchPanelInput from "./SearchPanelInput";
import TextInput from "./textInput";
import NumberInput from "./numberInput";
import TextAreaInput from "./textAreaInput";
import NumberSeparatorInput from "./NumberSeparatorInput";
import NumberCurrencyInput from "./NumberCurrencyInput";
import SearchInputCustom from "./SearchInputCustom";
import SmallModal from "./modals/smallModal";
import MediumModal from "./modals/mediumModal";
import LargeModal from "./modals/largeModal";
import XLargeModal from "./modals/xLargeModal";

const dataMenus = [
  { key: "biodata", label: "🥳 Biodata" },
  { key: "skill", label: "🎁 Skill" },
  { key: "experience", label: `⚙️ Experience (3)` },
  { key: "education", label: `🎓 Education (4)` },
  { key: "showcase", label: `🌟 Show Case (10)` },
  { key: "contact", label: "📞 Contact" },
  { key: "testimonial", label: `🗣️ Testimonial (5)` },
];

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

  /* =============== MODALS LOGIC ===================== */
  const [smallModal, setSmallModal] = useState<boolean>(false);
  const [mediumModal, setMediumModal] = useState<boolean>(false);
  const [largeModal, setLargeModal] = useState<boolean>(false);
  const [xlargeModal, setXlargeModal] = useState<boolean>(false);

  const closeModal = () => {
    setSmallModal(false);
    setMediumModal(false);
    setLargeModal(false);
    setXlargeModal(false);
  };
  /* ======================================================= */

  return (
    <CMSLayout>
      <div className="w-full px-6 ">
        <h5 className="text-3xl font-bold mb-7">Misc</h5>
        <h5 className="text-2xl font-bold mb-4">Modals</h5>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSmallModal(true)}
            className="px-6 py-3 rounded-xl hover:cursor-pointer bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Small Modal
          </button>

          <button
            onClick={() => setMediumModal(true)}
            className="px-6 py-3 rounded-xl hover:cursor-pointer bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-all duration-300"
          >
            Medium Modal
          </button>

          <button
            onClick={() => setLargeModal(true)}
            className="px-6 py-3 rounded-xl hover:cursor-pointer bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300"
          >
            Large Modal
          </button>

          <button
            onClick={() => setXlargeModal(true)}
            className="px-6 py-3 rounded-xl hover:cursor-pointer bg-rose-600 text-white font-semibold shadow-lg hover:bg-rose-700 transition-all duration-300"
          >
            Extra Large Modal
          </button>
        </div>

        {/* Scroll Navigation */}
        <div className="py-4 rounded-lg">
          <h5 className="text-2xl font-bold mb-4 mt-2">Scroll Navigation</h5>
          <ScrollNavigation data={dataMenus} />

          {/* Input Section */}
          <h5 className="text-2xl font-bold mb-4 mt-2">Input</h5>
          <div className="grid grid-cols-1 gap-3">
            <div className="col-span-1">
              <h2 className="font-bold">
                <label className="text-sm font-semibold">
                  Search Panel Input
                </label>
              </h2>
              <div
                className="relative mt-1"
                onClick={() => setShowSearchOpen(true)}
              >
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  readOnly
                  className="w-full bg-white pl-10 pr-20 py-3 border border-slate-300 outline-none rounded-full text-sm placeholder:italic"
                  placeholder="Search here..."
                />

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

            {/* CUSTOM SEARCH INPUT WITH DROPDOWN */}
            <SearchInputCustom />

            {/* TEXT INPUT */}
            <TextInput />

            {/* NUMBER INPUT */}
            <NumberInput />

            {/* TEXT AREA */}
            <TextAreaInput />

            {/* NUMBER INPUT WITH THOUSAND SEPARATOR */}
            <NumberSeparatorInput />

            {/* NUMBER INPUT WITH CURRENCY FORMAT */}
            <NumberCurrencyInput country={"en-US"} />
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

      {/*  MODAL */}
      {smallModal && <SmallModal title="Small Modal" onClose={closeModal} />}
      {mediumModal && <MediumModal title="Medium Modal" onClose={closeModal} />}
      {largeModal && <LargeModal title="Large Modal" onClose={closeModal} />}
      {xlargeModal && (
        <XLargeModal title="Extra Large Modal" onClose={closeModal} />
      )}
    </CMSLayout>
  );
};

export default Page;

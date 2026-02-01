"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import SearchPanel from "@/components/atoms/sharedComponents/SearchResult";
import Tooltip from "@/components/atoms/sharedComponents/Tooltip";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

const Page = () => {
  /* ================= SCROLL NAVIGATION =================== */
  const menus = [
    { key: "biodata", label: "🥳 Biodata" },
    { key: "skill", label: "🎁 Skill" },
    { key: "experience", label: `⚙️ Experience (3)` },
    { key: "education", label: `🎓 Education (4)` },
    { key: "showcase", label: `🌟 Show Case (10)` },
    { key: "contact", label: "📞 Contact" },
    { key: "testimonial", label: `🗣️ Testimonial (5)` },
  ];

  const [selectedMenu, setSelectedMenu] = useState<string>("biodata");
  const [showLeft, setShowLeft] = useState<boolean>(false);
  const [showRight, setShowRight] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByOneItem = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const items = el.querySelectorAll(".menu-item");

    if (items.length === 0) return;

    const itemWidth = (items[0] as HTMLElement).offsetWidth + 12;

    const amount = dir === "left" ? -itemWidth : itemWidth;

    el.scrollBy({ left: amount, behavior: "smooth" });

    setTimeout(updateArrowVisibility, 300);
  };

  const updateArrowVisibility = () => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateArrowVisibility();
  }, []);

  /* ======================== INPUT ======================== */
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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

  const filteredMovie = animeList.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <h5 className="text-3xl font-bold mb-7">Misc</h5>

        {/* Scroll Navigation */}
        <div className="py-4 rounded-lg">
          <label className="text-sm font-semibold">Scroll Navigation</label>

          <div className="relative flex mt-3 justify-between items-center mb-5 py-1">
            <div className="relative flex items-center">
              {showLeft && (
                <div
                  className="h-6 w-6 flex items-center justify-center rounded-full bg-white shadow-sm cursor-pointer absolute left-0 z-10"
                  onClick={() => scrollByOneItem("left")}
                >
                  <FaChevronLeft />
                </div>
              )}

              <div
                id="menu-scroll"
                ref={scrollRef}
                onScroll={updateArrowVisibility}
                className="flex gap-3 items-center scrollbar-hide overflow-x-auto px-2"
                style={{ maxWidth: "calc(70vw - 150px)" }}
              >
                {menus.map((m) => (
                  <div
                    key={m.key}
                    onClick={() => setSelectedMenu(m.key)}
                    className={`menu-item px-4 py-2 rounded-lg cursor-pointer duration-300 shadow-xs text-sm bg-white whitespace-nowrap ${
                      selectedMenu === m.key ? "font-bold bg-gray-100" : ""
                    }`}
                  >
                    {m.label}
                  </div>
                ))}
              </div>

              {showRight && (
                <div
                  className="h-6 w-6 flex items-center justify-center rounded-full bg-white shadow-sm cursor-pointer absolute right-0 z-10"
                  onClick={() => scrollByOneItem("right")}
                >
                  <FaChevronRight />
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <h2 className="font-bold">
                <Tooltip text="Search Input" position="top">
                  Search Input
                </Tooltip>
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

            {/* TEXT INPUT */}
            <div>
              <label className="text-sm font-semibold">Text Input</label>
              <input
                type="text"
                className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic"
                placeholder="Input here..."
              />
            </div>

            {/* NUMBER INPUT */}
            <div>
              <label className="text-sm font-semibold">Number Input</label>
              <input
                type="number"
                className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Input here..."
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>

            {/* TEXT AREA */}
            <div>
              <label className="text-sm font-semibold">Text Area</label>
              <textarea
                className="w-full mt-1 p-2 border bg-white border-slate-300 outline-none rounded-lg text-sm"
                rows={4}
                placeholder="Short description about yourself"
                onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL (MODULAR) */}
      {showSearchOpen && (
        <SearchPanel
          os={os}
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

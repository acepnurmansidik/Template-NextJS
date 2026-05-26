"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ScrollNavigation() {
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

  return (
    <div className="group">
      {/* Label/Tag yang konsisten */}
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 ml-0.5">
        Scroll Navigation
      </label>

      <div className="relative flex justify-between items-center py-1">
        <div className="relative flex items-center w-full">
          {/* Arrow Left */}
          {showLeft && (
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg cursor-pointer absolute left-0 z-10 text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors"
              onClick={() => scrollByOneItem("left")}
            >
              <FaChevronLeft size={12} />
            </div>
          )}

          {/* Scroll Area */}
          <div
            id="menu-scroll"
            ref={scrollRef}
            onScroll={updateArrowVisibility}
            className="flex gap-3 items-center scrollbar-hide overflow-x-auto px-10 py-1"
            style={{ maxWidth: "100%" }}
          >
            {menus.map((m) => (
              <div
                key={m.key}
                onClick={() => setSelectedMenu(m.key)}
                className={`menu-item px-4 py-2 rounded-lg cursor-pointer duration-300 shadow-sm border border-zinc-200 dark:border-zinc-700 text-sm whitespace-nowrap transition-all ${
                  selectedMenu === m.key
                    ? "font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Arrow Right */}
          {showRight && (
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg cursor-pointer absolute right-0 z-10 text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors"
              onClick={() => scrollByOneItem("right")}
            >
              <FaChevronRight size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

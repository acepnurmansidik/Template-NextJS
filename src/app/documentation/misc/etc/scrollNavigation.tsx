"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ScrollNavigation() {
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
  return (
    <>
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
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { LuSun, LuMoon } from "react-icons/lu";
import Notification from "../button/Notification";
import LogOut from "../button/LogOut";

const Navbar = () => {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);

  // animasi matahari/bulan
  const [anim, setAnim] = useState<
    "sunrise" | "sunset" | "moonrise" | "moonset" | null
  >(null);

  /* Load theme */
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark = saved === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // animasi awal
    setAnim(isDark ? "moonrise" : "sunrise");
  }, []);

  /* Toggle theme with animation */
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    // Update class di html
    document.documentElement.classList.toggle("dark", newTheme);

    // Simpan ke localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    // Animasi icon
    if (newTheme) {
      setAnim("moonrise");
    } else {
      setAnim("sunrise");
    }
  };

  return (
    <div className="w-full py-3 px-5 flex gap-4 justify-between items-center relative transition-all duration-300">
      <div className="flex items-center gap-2 text-sm">
        {pathname
          .trim()
          .split("/")
          .map((itemPath, index) => {
            if (index !== 1) {
              const isLast = index === pathname.trim().split("/").length - 1;

              return (
                <div key={itemPath} className="flex items-center gap-2">
                  {/* Separator "/" kecuali item pertama */}
                  {index !== 0 && (
                    <span className="text-gray-400 dark:text-gray-500">
                      <FaChevronRight size={10} />
                    </span>
                  )}

                  {/* Label breadcrumb */}
                  <span
                    className={`
                capitalize transition-all duration-200
                ${
                  isLast
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500 cursor-pointer"
                }
              `}
                  >
                    {itemPath || "/"}
                  </span>
                </div>
              );
            }
          })}
      </div>

      {/* ========================== ICON ANIMASI TERBIT/TERBENAM =========================== */}
      {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {anim === "sunrise" && (
          <LuSun
            size={32}
            className="text-yellow-400 animate-[sunRise_0.7s_ease-out]"
          />
        )}
        {anim === "sunset" && (
          <LuSun
            size={32}
            className="text-yellow-400 animate-[sunSet_0.6s_ease-in]"
          />
        )}

        {anim === "moonrise" && (
          <LuMoon
            size={32}
            className="text-blue-300 animate-[moonRise_0.7s_ease-out]"
          />
        )}
        {anim === "moonset" && (
          <LuMoon
            size={32}
            className="text-blue-300 animate-[moonSet_0.6s_ease-in]"
          />
        )}
      </div> */}

      <div className="flex gap-3 items-center">
        {/* ========================== TOGGLE THEME =========================== */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 rounded-lg bg-white shadow-xs hover:bg-gray-200 cursor-pointer flex items-center justify-center transition-all duration-300"
        >
          <div
            className={`transition-transform duration-500 ${
              darkMode ? "rotate-360" : "rotate-0"
            }`}
          >
            {darkMode ? (
              <LuMoon size={22} className="text-blue-300" />
            ) : (
              <LuSun size={22} className="text-yellow-400" />
            )}
          </div>
        </button>

        {/* ========================== NOTIFICATION BUTTON  =========================== */}
        <Notification />

        {/* ========================== USER + LOGOUT =========================== */}
        <LogOut />
      </div>
    </div>
  );
};

export default Navbar;

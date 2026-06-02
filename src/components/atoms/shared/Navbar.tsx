"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { LuSun, LuMoon } from "react-icons/lu";
import Notification from "../button/Notification";
import LogOut from "../button/LogOut";

const Navbar = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [anim, setAnim] = useState<
    "sunrise" | "sunset" | "moonrise" | "moonset" | null
  >(null);

  /* Inisialisasi Tema */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
      setAnim("moonrise");
    } else {
      document.documentElement.classList.remove("dark");
      setAnim("sunrise");
    }
  }, []);

  /* Aksi klik Toggle Tema */
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    const root = window.document.documentElement;

    if (newTheme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setAnim("moonrise");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setAnim("sunrise");
    }
  };

  return (
    // PERUBAHAN 1: Ditambahkan bg-white & border bawah yang dinamis (dark:bg-zinc-800 dark:border-zinc-700)
    <div className="w-full py-3 px-5 flex gap-4 justify-between items-center relative  transition-all duration-300">
      {/* === BREADCRUMB SECTION === */}
      <div className="flex items-center gap-2 text-sm">
        {pathname
          .trim()
          .split("/")
          .map((itemPath, index) => {
            if (index !== 1) {
              const isLast = index === pathname.trim().split("/").length - 1;

              return (
                <div key={itemPath} className="flex items-center gap-2">
                  {/* Separator "/" */}
                  {index !== 0 && (
                    <span className="text-gray-400 dark:text-zinc-500">
                      <FaChevronRight size={10} />
                    </span>
                  )}

                  {/* Label breadcrumb */}
                  {/* PERUBAHAN 2: Penyesuaian warna teks aktif & pasif untuk dark mode */}
                  <span
                    className={`
                      capitalize transition-all duration-200
                      ${
                        isLast
                          ? "text-gray-900 dark:text-zinc-100 font-semibold"
                          : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 cursor-pointer"
                      }
                    `}
                  >
                    {itemPath.replaceAll("-", " ") || "/"}
                  </span>
                </div>
              );
            }
          })}
      </div>

      {/* === ACTION BUTTONS SECTION === */}
      <div className="flex gap-3 items-center">
        {/* ========================== TOGGLE THEME =========================== */}
        {/* PERUBAHAN 3: Tombol diubah warna dasarnya saat dark (dark:bg-zinc-700 dark:hover:bg-zinc-600) */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-700 shadow-xs dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer flex items-center justify-center transition-all duration-300"
        >
          <div
            className={`transition-transform duration-500 ${
              darkMode ? "rotate-360" : "rotate-0"
            }`}
          >
            {darkMode ? (
              // Ikon Bulan diubah warnanya menjadi kuning neon lembut agar kontras dan terbaca di dark mode
              <LuMoon size={22} className="text-yellow-300" />
            ) : (
              // Ikon Matahari tetap oranye hangat untuk light mode
              <LuSun size={22} className="text-orange-500" />
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

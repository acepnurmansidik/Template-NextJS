"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuSun, LuMoon } from "react-icons/lu";

const Navbar = () => {
  const pathname = usePathname();
  const [openLogout, setOpenLogout] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // animasi matahari/bulan
  const [anim, setAnim] = useState<
    "sunrise" | "sunset" | "moonrise" | "moonset" | null
  >(null);

  const logoutRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  /* Load theme */
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark = saved === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // animasi awal
    setAnim(isDark ? "moonrise" : "sunrise");
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setOpenLogout(false);
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                    {itemPath || "home"}
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
            className={`
      transition-transform duration-500
      ${darkMode ? "rotate-360" : "rotate-0"}
    `}
          >
            {darkMode ? (
              <LuMoon size={22} className="text-blue-300" />
            ) : (
              <LuSun size={22} className="text-yellow-400" />
            )}
          </div>
        </button>

        {/* ==========================
          NOTIFICATION BUTTON
      =========================== */}
        <div className="relative" ref={notifRef}>
          <div
            className="relative h-10 w-10 bg-white shadow-xs hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenLogout(false);
            }}
          >
            <IoNotificationsOutline fontSize={20} className="text-gray-700" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
              10
            </span>
          </div>

          {/* Notif dropdown */}
          {openNotif && (
            <div className="absolute top-12 right-0 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold ">Notifications</h2>

                <button className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Read All
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-md border border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm text-gray-700">
                        Pesan notifikasi ke-{i + 1}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        2 minutes ago
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ==========================
          USER + LOGOUT
      =========================== */}
        <div
          className="relative flex items-center gap-2 cursor-pointer"
          ref={logoutRef}
          onClick={() => {
            setOpenLogout(!openLogout);
            setOpenNotif(false);
          }}
        >
          <div className="h-10 w-10 rounded-lg text-center flex items-center justify-center bg-white shadow-xs font-semibold">
            AN
          </div>

          <h1 className="text-lg font-semibold ">Hola, acep</h1>

          {openLogout && (
            <div className="absolute top-12 shadow-xs right-0 bg-white rounded-md p-2 w-40 animate-fadeIn z-50">
              <button className="w-full flex gap-2 items-center p-2 rounded-md text-sm hover:bg-gray-100 ">
                <ImExit fontSize={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

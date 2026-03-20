"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // State untuk menyimpan status dark mode saat ini
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Saat komponen dimuat, cek apakah <html> memiliki class 'dark' (diset oleh script di layout.tsx)
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi Toggle manual murni tanpa package
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-slate-800"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6 md:px-12">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-extrabold text-xl flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="w-9 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md transition-colors">
            48
          </span>
          <span className="tracking-tight text-gray-900 dark:text-white transition-colors">
            Acep Nurman
          </span>
        </motion.div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 dark:text-gray-300 font-medium text-sm">
          <Link
            href="/"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="#skills"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Skills
          </Link>
          <Link
            href="#experience"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Experience
          </Link>
          <Link
            href="#projects"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Projects
          </Link>

          {/* THEME TOGGLE DESKTOP */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            className="text-2xl text-gray-800 dark:text-white focus:outline-none cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-xl absolute w-full"
          >
            <div className="flex flex-col gap-4 p-6 text-gray-700 dark:text-gray-300 font-medium">
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="#skills" onClick={() => setOpen(false)}>
                Skills
              </Link>
              <Link href="#experience" onClick={() => setOpen(false)}>
                Experience
              </Link>
              <Link href="#projects" onClick={() => setOpen(false)}>
                Projects
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

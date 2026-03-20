"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 z-10">
        {/* LEFT TEXT */}
        <div className="flex flex-col gap-6 max-w-2xl text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase text-sm"
          >
            Welcome to my portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight"
          >
            Hi, I'm Acep. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-700 to-black dark:from-gray-300 dark:to-white">
              Fullstack Developer.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed"
          >
            I build scalable, high-performance web applications and robust
            backend systems to solve real-world problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4"
          >
            <a href="#projects">
              <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Explore My Work
              </button>
            </a>
            <a href="#contact">
              <button className="bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-sm">
                Contact Me
              </button>
            </a>
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative w-72 h-72 md:w-96 md:h-96"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-white dark:from-slate-800 dark:to-slate-700 rounded-3xl transform rotate-3 scale-105 -z-10 shadow-xl"></div>
            <Image
              src="/assets/logo/splash.png"
              fill
              alt="Acep Nurman Sidik"
              className="rounded-3xl object-cover shadow-2xl"
              priority
            />
          </motion.div>

          {/* Floating Element */}
          <motion.div
            className="absolute -bottom-6 -left-6 md:-left-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg"
            >
              <Image
                src="/assets/icons/server_icon.png"
                width={30}
                height={30}
                alt="Server"
                // className="dark:invert" // Akan mengubah icon hitam jadi putih di dark mode
              />
            </motion.div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                DevOps & Backend
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Expertise
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

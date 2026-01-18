"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
      {/* LEFT TEXT */}
      <div className="flex flex-col gap-5 max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-7xl font-bold"
        >
          Hello. I am Acep, a Fullstack Developer.
        </motion.h1>

        <motion.div className="flex gap-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black text-white hover:cursor-pointer px-6 py-3 rounded-full w-fit hover:bg-gray-800 duration-300"
          >
            Explore My Work →
          </motion.button>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center justify-center"
          >
            <span className="px-4 py-3 cursor-pointer flex gap-3 bg-white shadow rounded-full text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"
              >
                <path d="M12 17V3" />
                <path d="m6 11 6 6 6-6" />
                <path d="M19 21H5" />
              </svg>
              Download Resume
            </span>
          </motion.div> */}
        </motion.div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 md:mt-0"
        >
          <Image
            src="/assets/logo/splash.png"
            width={550}
            height={550}
            alt="hero"
            className="rounded-2xl bg-gray-50 object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 md:mt-0"
        >
          <motion.img
            src="/assets/icons/server_icon.png"
            width={100}
            height={100}
            alt="hero"
            className="absolute bottom-8 -left-2 md:-left-8 object-cover"
            style={{ filter: "drop-shadow(2px 4px 16px rgba(255,255,255,1))" }}
            animate={{
              y: [0, -10, 0], // bergerak naik → turun → balik
            }}
            transition={{
              duration: 3, // kecepatan animasi
              repeat: Infinity, // putar terus
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

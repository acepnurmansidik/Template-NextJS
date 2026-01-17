"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
      {/* LEFT TEXT */}
      <div className="flex flex-col gap-5 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <span className="px-4 py-2 bg-white shadow rounded-full text-sm">
            ✨ Hello, I’m Acep
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Ultimate UI/UX Designer
          <br />
          and Web Designer
        </motion.h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black text-white hover:cursor-pointer px-6 py-3 rounded-full w-fit hover:bg-gray-800 duration-300"
        >
          Explore My Work →
        </motion.button>
      </div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 md:mt-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          width={420}
          height={420}
          alt="hero"
          className="rounded-2xl shadow-lg object-cover"
        />
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-xl flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            48
          </span>
          Acep Nurman Sidik
        </motion.div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="#about">About Me</Link>
          <Link href="#projects">Projects</Link>
        </div>

        {/* BUTTON CONTACT */}
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          className="hidden md:block hover:cursor-pointer bg-black text-white px-5 py-2 rounded-lg"
          onClick={() => router.push("/auth/login")}
        >
          <div className="flex gap-2">
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
              className="lucide lucide-key-square-icon lucide-key-square"
            >
              <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
              <path d="m14 7 3 3" />
              <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
            </svg>
            <span>Login</span>
          </div>
        </motion.button> */}

        {/* MOBILE BUTTON */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden flex flex-col gap-4 bg-white border-t p-6"
        >
          <Link href="/">Home</Link>
          <Link href="#about">About Me</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#faq">FAQ</Link>

          <button
            className="bg-black text-white px-5 py-2 rounded-lg w-max"
            onClick={() => router.push("/auth/login")}
          >
            <div className="flex gap-2">
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
                className="lucide lucide-key-square-icon lucide-key-square"
              >
                <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
                <path d="m14 7 3 3" />
                <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
              </svg>
              <span>Login</span>
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}

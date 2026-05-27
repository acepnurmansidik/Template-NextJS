"use client";

import { useState, useRef, useEffect } from "react"; // Tambahkan useRef
import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import dynamic from "next/dynamic";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { formatCurrencyPure } from "@/utils/formatter";

const WorldMap = dynamic(() => import("@/components/etc/WorldMap"), {
  ssr: false,
});

const Page = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [scale, setScale] = useState<number>(950);
  const [showScale, setShowScale] = useState(false); // State untuk visibilitas
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref untuk timer

  const handleScaleChange = (type: "plus" | "minus") => {
    // 1. Update Scale
    if (type === "plus") setScale((prev) => (prev >= 3000 ? prev : prev + 50));
    else setScale((prev) => (prev <= 950 ? prev : prev - 50));

    // 2. Tampilkan teks
    setShowScale(true);

    // 3. Clear timer sebelumnya jika user klik berulang kali
    if (timerRef.current) clearTimeout(timerRef.current);

    // 4. Set timer 3 detik untuk menyembunyikan
    timerRef.current = setTimeout(() => {
      setShowScale(false);
    }, 3000);
  };

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMapOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Map Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Real-time analytics and management for your contacts database.
            </p>
          </div>
        </div>

        <div className="flex mb-4">
          {/* Tombol RUN untuk membuka peta */}
          <button
            onClick={() => setIsMapOpen(true)}
            className="bg-blue-600 w-36 hover:cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/20"
          >
            OPEN MAP
          </button>
        </div>

        {isMapOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
            <div className="absolute top-4 flex flex-col items-end gap-2 right-6 z-10">
              {showScale && (
                <div className="absolute right-12 z-10 w-32 animate-in fade-in duration-300 rounded-md px-3 py-1 text-center text-xs font-mono text-gray-900 dark:text-white bg-white/80 dark:bg-black/70 backdrop-blur-sm border border-gray-200 dark:border-zinc-700">
                  Scale: {formatCurrencyPure(scale)}
                </div>
              )}
              <button
                onClick={() => setIsMapOpen(false)}
                className="size-10 flex hover:cursor-pointer items-center justify-center rounded-lg backdrop-blur-md transition-all bg-white/10 hover:bg-red-500/20 text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-500 border border-zinc-600/30 dark:border-transparent hover:border-red-500/50"
              >
                <IoClose size={20} />
              </button>

              {/* Tombol Plus */}
              <button
                onClick={() => handleScaleChange("plus")}
                className="size-10 flex hover:cursor-pointer items-center justify-center rounded-lg backdrop-blur-md transition-all bg-white/10 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-zinc-600/30 dark:border-transparent"
              >
                <FaPlus size={16} />
              </button>

              {/* Tombol Minus */}
              <button
                onClick={() => handleScaleChange("minus")}
                className="size-10 flex hover:cursor-pointer items-center justify-center rounded-lg backdrop-blur-md transition-all bg-white/10 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-zinc-600/30 dark:border-transparent"
              >
                <FaMinus size={16} />
              </button>
            </div>

            <WorldMap scale={scale} onReset={() => setScale(950)} />
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default Page;

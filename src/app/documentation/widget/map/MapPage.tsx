"use client";

import { useState, useRef, useEffect } from "react";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import dynamic from "next/dynamic";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { TbCurrentLocationFilled } from "react-icons/tb";

const WorldMap = dynamic(() => import("@/components/etc/WorldMap"), {
  ssr: false,
});

const zoomLevels = [1, 1.5, 2, 3, 4, 6, 8];

const MapPage = () => {
  const mapRef = useRef<any>(null); // Ref untuk akses WorldMap
  const [zoomIndex, setZoomIndex] = useState<number>(0);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [scale, setScale] = useState<number>(950);
  const [showScale, setShowScale] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const syncZoomIndex = (newZoom: number) => {
    // Cari index yang paling mendekati nilai zoom yang baru
    const index = zoomLevels.findIndex((val) => val === newZoom);
    if (index !== -1) {
      setZoomIndex(index);
    } else {
      // Jika zoom tidak pas di array, cari yang paling dekat
      const closest = zoomLevels.reduce((prev, curr) =>
        Math.abs(curr - newZoom) < Math.abs(prev - newZoom) ? curr : prev,
      );

      setZoomIndex(zoomLevels.indexOf(closest));
    }
  };

  const handleScaleChange = (type: "plus" | "minus") => {
    setShowScale(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowScale(false), 3000);
  };

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
        {/* =========================== DASHBOARD HEADER ============================ */}
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
        <button
          onClick={() => setIsMapOpen(true)}
          className="bg-blue-600 hover:cursor-pointer mt-4 px-6 py-2 rounded-lg text-white font-bold"
        >
          OPEN MAP
        </button>

        {isMapOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
            <div className="absolute top-4 flex flex-col items-end gap-2 right-6 z-10">
              {showScale && (
                <div className="absolute right-12 z-10 w-32 animate-in fade-in duration-300 rounded-md px-3 py-1 text-center text-xs font-mono text-gray-900 dark:text-white bg-white/80 dark:bg-black/70 backdrop-blur-sm border border-gray-200 dark:border-zinc-700">
                  Zoom: {zoomLevels[zoomIndex]}x
                </div>
              )}

              <button
                onClick={() => setIsMapOpen(false)}
                className="size-10 flex items-center hover:cursor-pointer justify-center rounded-lg backdrop-blur-md transition-all bg-white/10 hover:bg-red-500/20 text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-500 border border-zinc-600/30 dark:border-transparent hover:border-red-500/50"
              >
                <IoClose size={20} />
              </button>

              {/* Tombol Reset yang diperbaiki */}
              <button
                onClick={() => {
                  mapRef.current?.resetMap();
                  setZoomIndex(0);
                  mapRef.current?.setZoom(zoomLevels[0]);
                }}
                className="size-10 flex items-center justify-center  hover:cursor-pointer rounded-lg backdrop-blur-md transition-all bg-white/10 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-zinc-600/30 dark:border-transparent"
              >
                <TbCurrentLocationFilled size={20} />
              </button>

              <button
                onClick={() => {
                  const newIndex = Math.min(
                    Math.max(zoomIndex + 1, 0),
                    zoomLevels.length - 1,
                  );
                  setZoomIndex(newIndex);
                  mapRef.current?.setZoom(zoomLevels[newIndex]);
                  handleScaleChange("plus");
                }}
                className="size-10 flex items-center justify-center  hover:cursor-pointer rounded-lg backdrop-blur-md transition-all bg-white/10 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-zinc-600/30 dark:border-transparent"
              >
                <FaPlus size={16} />
              </button>
              <button
                onClick={() => {
                  const newIndex = Math.max(zoomIndex - 1, 0);
                  setZoomIndex(newIndex);
                  mapRef.current?.setZoom(zoomLevels[newIndex]);
                  handleScaleChange("minus");
                }}
                className="size-10 flex items-center justify-center  hover:cursor-pointer rounded-lg backdrop-blur-md transition-all bg-white/10 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-zinc-600/30 dark:border-transparent"
              >
                <FaMinus size={16} />
              </button>
            </div>
            <WorldMap
              ref={mapRef}
              scale={scale}
              onScaleMap={() => setScale(950)}
              onZoomChange={(zoom: number) => syncZoomIndex(zoom)}
            />
          </div>
        )}
      </div>
    </CMSLayout>
  );
};
export default MapPage;

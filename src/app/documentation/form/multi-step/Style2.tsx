"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = ["Setup Awal", "Konfigurasi", "Verifikasi"];

const Style2 = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-2 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-100">
      {/* Sidebar Navigasi (Vertical) */}
      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 md:w-64 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Proses Setup
        </h2>
        {steps.map((step, i) => (
          <div
            onClick={() => setCurrentStep(i)}
            key={step}
            className={`flex hover:cursor-pointer items-center gap-3 p-3 rounded-xl transition-all ${currentStep === i ? "bg-white dark:bg-zinc-900 shadow-sm" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentStep >= i ? "bg-blue-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm font-medium ${currentStep === i ? "text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Konten Form Tetap Sama, tapi layout sekarang lebih luas */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Pilih Kategori Kontak
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Tentukan target audiens agar data lebih akurat.
                  </p>
                  <select className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Target Audiens</option>
                    <option>Pelanggan Tetap</option>
                  </select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Action */}
        <div className="flex justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            className={`text-sm hover:cursor-pointer font-medium text-zinc-500 hover:text-zinc-900 ${currentStep == 0 ? "opacity-30" : ""}`}
          >
            Kembali
          </button>
          <button
            onClick={() =>
              setCurrentStep((p) => Math.min(steps.length - 1, p + 1))
            }
            className="px-6 py-3 hover:cursor-pointer bg-blue-700 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-lg hover:opacity-90"
          >
            {currentStep === steps.length - 1 ? "Aktifkan" : "Selanjutnya"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Style2;

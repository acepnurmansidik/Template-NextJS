"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = ["Setup Awal", "Konfigurasi", "Verifikasi"];

const Style3 = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Efek latar belakang dekoratif */}
      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/5 blur-3xl rounded-full" />

      {/* Kartu Utama */}
      <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] p-10 shadow-2xl">
        {/* Progress Bar Minimalist */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= i ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
          ))}
        </div>

        {/* Konten dengan Animasi "Pop" */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-60"
          >
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-6">
              {steps[currentStep]}
            </h2>

            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {["Customer", "Partner", "Investor", "Vendor"].map((cat) => (
                  <button
                    key={cat}
                    className="p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-blue-500 text-left transition-all"
                  >
                    <div className="font-bold text-sm">{cat}</div>
                    <div className="text-[10px] text-zinc-500">
                      Kategori profil
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigasi Modern */}
        <div className="mt-10 flex items-center justify-between">
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
            className="group flex items-center gap-2 px-8 py-4 bg-blue-700 hover:cursor-pointer dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold transition-all hover:pr-12"
          >
            {currentStep === steps.length - 1 ? "Selesai" : "Selanjutnya"}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Style3;

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = ["Setup Awal", "Konfigurasi", "Verifikasi"];

const Style4 = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="relative w-full max-w-lg mx-auto h-112.5">
      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => {
          // Hanya render kartu yang aktif atau yang akan datang
          if (index < currentStep) return null;

          const isVisible = index === currentStep;

          return (
            <motion.div
              key={step}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{
                y: (index - currentStep) * 20,
                opacity: isVisible ? 1 : 0.4,
                scale: isVisible ? 1 : 0.9,
                zIndex: steps.length - index,
              }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute w-full p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                  Step 0{index + 1}
                </span>
                <span className="text-xs text-zinc-400">{step}</span>
              </div>

              <div className="min-h-50">
                {index === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                      Pilih Kategori
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Tentukan klasifikasi kontak Anda.
                    </p>
                    <input
                      className="w-full bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:border-blue-500"
                      placeholder="Contoh: VIP Client"
                    />
                  </div>
                )}
                {/* Tambahkan isi step lainnya di sini */}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                <button
                  onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                  className={`text-sm hover:cursor-pointer font-medium text-zinc-500 hover:text-zinc-900 ${currentStep == 0 ? "opacity-30" : ""}`}
                >
                  Kembali
                </button>
                {isVisible && (
                  <button
                    onClick={() =>
                      setCurrentStep((prev) =>
                        Math.min(steps.length - 1, prev + 1),
                      )
                    }
                    className="px-6 py-3 bg-blue-700 hover:cursor-pointer dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-lg"
                  >
                    {index === steps.length - 1
                      ? "Simpan Perubahan"
                      : "Selanjutnya →"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Style4;

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = ["Setup Awal", "Konfigurasi", "Verifikasi"];

const Style1 = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
      <div className="max-w-xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-10 relative">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= i ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
              >
                {i + 1}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${currentStep >= i ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"}`}
              >
                {step}
              </span>
            </div>
          ))}
          {/* Connecting Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 z-0" />
        </div>

        {/* Form Content dengan AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {currentStep === 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Kategori Kontak
                </label>
                <p className="text-xs text-zinc-400 mb-2">
                  Pilih segmen utama untuk mengelompokkan data Anda.
                </p>
                <select className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Target Audiens</option>
                  <option>Pelanggan Tetap</option>
                  <option>Mitra Strategis</option>
                </select>
              </div>
            )}

            {currentStep === 1 && (
              <div className="text-center py-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Personalisasi Analitik
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Atur parameter pelacakan agar laporan lebih relevan.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center py-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Data Siap Diproses
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Tinjau kembali input Anda sebelum menekan tombol simpan.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-8">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={() =>
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
            }
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            {currentStep === steps.length - 1 ? "Simpan Data" : "Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Style1;

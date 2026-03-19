"use client";

import { useState } from "react";
import { z } from "zod";

// --- 1. Definisi Schema ---
const numberSchema = z
  .string()
  .min(1, "*Number is required.") // Cek apakah kosong
  .regex(/^\d+$/, "*Must be a valid number (digits only).") // Hanya angka 0-9
  .refine((val) => parseInt(val) > 0, {
    message: "Number must be greater than 0.",
  });

export default function NumberInputWithValidate() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Opsional: Mencegah user mengetik selain angka secara langsung
    const cleanValue = inputValue.replace(/\D/g, "");
    setValue(cleanValue);

    // --- 2. Proses Validasi Zod ---
    const result = numberSchema.safeParse(cleanValue);

    if (!result.success) {
      setError(result.error.issues[0].message);
    } else {
      setError(null);
    }
  };

  return (
    <div className="group flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1 flex gap-1">
        Age / Quantity <span className="text-red-500">*</span>
      </label>

      <input
        type="text" // Menggunakan text lebih stabil untuk kustom validasi daripada type="number"
        inputMode="numeric" // Memunculkan numpad di HP
        value={value}
        onChange={handleChange}
        className={`w-full bg-white px-4 py-2.5 border outline-none rounded-xl text-sm text-slate-900 transition-all duration-200 
          ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          }`}
        placeholder="e.g. 25"
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 italic font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

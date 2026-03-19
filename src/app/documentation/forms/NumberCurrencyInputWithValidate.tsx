"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";

interface NumberCurrencyInputProps {
  country?: "id-ID" | "en-US" | "de-DE";
}

// --- 1. Definisi Schema Zod ---
const currencySchema = z
  .string()
  .min(1, "*Amount is required.")
  .refine(
    (val) => {
      // Hilangkan semua karakter kecuali angka untuk pengecekan nilai
      const numericValue = parseInt(val.replace(/\D/g, ""), 10);
      return numericValue > 0;
    },
    { message: "*Amount must be greater than 0." },
  );

export default function NumberCurrencyInputWithValidate({
  country = "id-ID",
}: NumberCurrencyInputProps) {
  const [value, setValue] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatter = new Intl.NumberFormat(country, {
    minimumFractionDigits: 0,
  });

  useEffect(() => {
    const symbol = new Intl.NumberFormat(country, {
      style: "currency",
      currency:
        country === "id-ID" ? "IDR" : country === "en-US" ? "USD" : "EUR",
      minimumFractionDigits: 0,
    })
      .format(0)
      .replace(/\d/g, "")
      .trim();

    setCurrencySymbol(symbol);
  }, [country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");

    // --- 2. Proses Validasi ---
    const result = currencySchema.safeParse(raw);

    if (!result.success) {
      setError(result.error.issues[0].message);
    } else {
      setError(null);
    }

    if (!raw) {
      setValue("");
      return;
    }

    const formatted = formatter.format(Number(raw));
    setValue(`${currencySymbol} ${formatted}`);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1 flex gap-1">
        Currency Input <span className="text-red-500">*</span>
      </label>

      <div className="relative group">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder={currencySymbol ? `${currencySymbol} 0` : "Loading..."}
          className={`w-full bg-white px-4 py-2.5 border outline-none rounded-xl text-sm font-medium text-slate-900 transition-all duration-200 
            ${
              error
                ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            }`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 italic font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

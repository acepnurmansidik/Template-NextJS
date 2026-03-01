"use client";
import React, { useState, useEffect } from "react";

interface NumberCurrencyInputProps {
  country?: "id-ID" | "en-US" | "de-DE";
}

export default function NumberCurrencyInput({
  country = "id-ID",
}: NumberCurrencyInputProps) {
  const [value, setValue] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState(""); // <-- FIX HERE

  // Buat formatter angka
  const formatter = new Intl.NumberFormat(country, {
    minimumFractionDigits: 0,
  });

  // Hitung currency symbol hanya di client
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

    if (!raw) return setValue("");

    const formatted = formatter.format(Number(raw));
    setValue(`${currencySymbol} ${formatted}`);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1">
        Currency Input
      </label>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder={currencySymbol ? `${currencySymbol} 0` : "Loading..."}
          className="w-full bg-white px-4 py-2.5 border border-slate-200 outline-none rounded-xl text-sm font-medium text-slate-900 transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 placeholder:italic"
        />
      </div>
    </div>
  );
}

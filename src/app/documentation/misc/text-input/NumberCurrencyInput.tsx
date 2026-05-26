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
    <div>
      <label className="text-sm font-semibold">Number Currency Input</label>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.currentTarget.blur()}
        placeholder={
          currencySymbol ? `${currencySymbol} 0` : "Loading..." // aman SSR
        }
        className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic"
      />
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";

interface NumberCurrencyInputProps {
  country?: "id-ID" | "en-US" | "de-DE";
}

export default function NumberCurrencyInput({
  country = "id-ID",
}: NumberCurrencyInputProps) {
  const [value, setValue] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

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
    if (!raw) return setValue("");
    const formatted = formatter.format(Number(raw));
    setValue(`${currencySymbol} ${formatted}`);
  };

  return (
    <div className="group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        {currencySymbol} Amount
      </label>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.currentTarget.blur()}
        placeholder={`${currencySymbol} 0`}
        className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
      />
    </div>
  );
}

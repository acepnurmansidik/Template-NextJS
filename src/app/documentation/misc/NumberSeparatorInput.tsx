"use client";
import React, { useState } from "react";

export default function NumberSeparatorInput() {
  const [value, setValue] = useState("");

  const formatter = new Intl.NumberFormat("id-ID");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ambil angka mentah (harus gunakan replace untuk ekstraksi)
    const raw = e.target.value.replace(/\D/g, "");

    if (!raw) return setValue("");

    // format angka menggunakan Intl
    const formatted = formatter.format(Number(raw));
    setValue(formatted);
  };

  return (
    <div>
      <label className="text-sm font-semibold">Number Input (10.000)</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.currentTarget.blur()}
        placeholder="Input here..."
        className="w-full bg-white px-4 py-2.5 border border-slate-200 outline-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 placeholder:italic transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
    </div>
  );
}

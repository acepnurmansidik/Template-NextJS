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
        className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic"
      />
    </div>
  );
}

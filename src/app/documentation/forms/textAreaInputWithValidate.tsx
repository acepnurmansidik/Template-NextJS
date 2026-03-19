"use client";

import React, { useState } from "react";
import { z } from "zod";

// --- 1. Definisi Schema Zod ---
const textAreaSchema = z
  .string()
  .min(1, "This field is required.") // Wajib diisi
  .min(10, "Please tell us a bit more (min. 10 characters).") // Minimal karakter
  .max(200, "Too long! Maximum 200 characters."); // Maksimal karakter

export default function TextAreaInputWithValidate() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    autoResize(e.target);

    // --- 2. Proses Validasi ---
    const result = textAreaSchema.safeParse(val);

    if (!result.success) {
      setError(result.error.issues[0].message);
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center ml-1">
        <label className="text-[13px] font-bold text-slate-700">
          About Me <span className="text-red-500">*</span>
        </label>
        {/* Indikator jumlah karakter */}
        <span
          className={`text-[11px] font-medium ${text.length > 200 ? "text-red-500" : "text-slate-400"}`}
        >
          {text.length}/200
        </span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        className={`w-full bg-white px-4 py-3 border outline-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 min-h-30 resize-none
          ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          }`}
        placeholder="Tell us about yourself..."
      ></textarea>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 italic font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

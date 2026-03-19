"use client";

import { useState } from "react";
import { z } from "zod";

// --- 1. Definisi Schema ---
const formSchema = z
  .string()
  .min(1, "*This field is required.")
  .refine((val: string) => /^[a-z]+[A-Z][a-z]*$/.test(val), {
    message:
      "*Must be camelCase with exactly one uppercase letter (e.g., helloWorld).",
  });

export default function TextInputWithValidate() {
  const [form, setForm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(value);

    // --- 2. Proses Validasi ---
    const result = formSchema.safeParse(value);

    if (!result.success) {
      setError(result.error.issues[0].message);
    } else {
      setError(null);
    }
  };

  return (
    <div className="group flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1 flex gap-0.5">
        Text Input With Validate <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        value={form}
        onChange={handleChange}
        className={`w-full bg-white px-4 py-2.5 border outline-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 placeholder:italic transition-all duration-200 
          ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          }`}
        placeholder="e.g. helloWorld"
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 italic font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

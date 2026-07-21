"use client";

// Pemilih tipe perhitungan formula (SINGLE vs PER_COMPONENT) berupa segmented
// control. Dipakai di modal Create & Update Calculated Formula.

import { CalcType, CALC_TYPE_LABEL } from "@/types/calculatedFormula";

const OPTIONS: { value: CalcType; hint: string }[] = [
  { value: CalcType.SINGLE, hint: "Satu ekspresi utuh" },
  {
    value: CalcType.PER_COMPONENT,
    hint: "Banyak komponen, dijumlahkan",
  },
];

interface DataProps {
  value: CalcType;
  onChange: (v: CalcType) => void;
  disabled?: boolean;
}

export default function CalcTypeToggle({
  value,
  onChange,
  disabled,
}: DataProps) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
        Tipe Perhitungan
      </label>
      <div className="inline-flex w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60 p-1 gap-1">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`flex-1 rounded-md px-3 py-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                active
                  ? "bg-white dark:bg-zinc-950 shadow-sm"
                  : "hover:bg-white/60 dark:hover:bg-zinc-900/50 cursor-pointer"
              }`}
            >
              <span
                className={`block text-sm font-bold ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {CALC_TYPE_LABEL[opt.value]}
              </span>
              <span className="block text-[11px] text-zinc-400 dark:text-zinc-500">
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

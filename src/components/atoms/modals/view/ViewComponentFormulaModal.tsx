"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { ComponentFormulaApiDaum, RateType } from "@/types/componentFormula";
import { getComponentRate, formatRate } from "@/utils/formula";

interface DataProps {
  initialData: ComponentFormulaApiDaum;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewComponentFormulaModal({
  initialData,
  isOpen,
  onClose,
}: DataProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const isCalculated = initialData.rate_type === RateType.CALCULATED;
  const usedByCount = initialData.component_id?.length ?? 0;

  const field = (label: string, value: string) => (
    <div className="group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
        {label}
      </label>
      <input
        disabled
        value={value}
        className="w-full bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none dark:text-zinc-100"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          View Component Formula
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-full px-5 mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {field("Name", initialData.name ?? "-")}
            {field("Slug", initialData.slug ?? "-")}
            {field("Rate Type", initialData.rate_type ?? "-")}
            {field(
              isCalculated ? "Calculated Rate" : "Fixed Rate",
              String(
                isCalculated
                  ? initialData.calculated_rate
                  : initialData.fixed_rate,
              ),
            )}
            {field("Decimal Place", String(initialData.decimal_place ?? "-"))}
            {field(
              "Effective Rate",
              formatRate(getComponentRate(initialData), initialData.decimal_place),
            )}

            {/* USED BY */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Used By Calculated Formula
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                    usedByCount > 0
                      ? "border-blue-400 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {usedByCount} formula
                </span>
                {usedByCount > 0 && (
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Komponen ini sedang dipakai, sehingga tidak bisa dihapus
                    sampai dilepas dari semua calculated formula.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

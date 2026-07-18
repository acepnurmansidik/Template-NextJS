"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  CalculatedFormulaApiDaum,
  PopulatedComponent,
  isPopulatedComponent,
} from "@/types/calculatedFormula";
import {
  getComponentRate,
  formatRate,
  formatResult,
  computeExpressionResult,
  ROUND_MODES,
  RoundMode,
} from "@/utils/formula";

interface DataProps {
  initialData: CalculatedFormulaApiDaum;
  isOpen: boolean;
  onClose: () => void;
}

const opSymbol = (op: string) =>
  ({ "+": "+", "-": "−", "*": "×", "/": "÷" })[op] ?? op;

const roundLabel = (mode: string | undefined) =>
  ROUND_MODES.find((m) => m.value === (mode ?? "round"))?.label ?? "Normal";

export default function ViewCalculatedFormulaModal({
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

  const expression = initialData.expression ?? [];
  const finalRounding = (initialData.rounding ?? "round") as RoundMode;
  const computedResult = computeExpressionResult(
    expression,
    initialData.decimal_place,
    finalRounding,
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          View Calculated Formula
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {field("Name", initialData.name ?? "-")}
            {field("Slug", initialData.slug ?? "-")}
            {field("Decimal Place", String(initialData.decimal_place ?? "-"))}
            {field("Pembulatan Akhir", roundLabel(initialData.rounding))}
            {field(
              "Result (live)",
              computedResult === null
                ? "—"
                : formatResult(
                    computedResult,
                    initialData.decimal_place,
                    finalRounding,
                  ),
            )}
          </div>

          {/* EXPRESSION (read-only) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Expression
            </label>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 p-4">
              {expression.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">
                  Tidak ada ekspresi.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {expression.map((token, index) => {
                    if (token.type === "operator") {
                      return (
                        <span
                          key={index}
                          className="text-base font-bold text-blue-600 dark:text-blue-400"
                        >
                          {opSymbol(token.operator ?? "+")}
                        </span>
                      );
                    }
                    if (token.type === "paren") {
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-lg font-black text-amber-600 dark:text-amber-400"
                        >
                          {token.paren}
                          {token.paren === "(" && (
                            <span className="text-[9px] font-bold uppercase tracking-wide text-amber-500/80 normal-case">
                              {(token.rounding ?? "round") === "none"
                                ? "asli"
                                : `${roundLabel(token.rounding)} · ${
                                    token.decimal_place ??
                                    initialData.decimal_place
                                  }dp`}
                            </span>
                          )}
                        </span>
                      );
                    }
                    if (token.type === "constant") {
                      return (
                        <span
                          key={index}
                          className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300"
                        >
                          {token.value}
                        </span>
                      );
                    }
                    // component
                    const populated = isPopulatedComponent(token.component)
                      ? (token.component as PopulatedComponent)
                      : null;
                    return (
                      <div
                        key={index}
                        className="flex flex-col leading-tight rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5"
                      >
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                          {populated ? populated.name : "Unknown component"}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {populated
                            ? `${populated.rate_type} · ${formatRate(
                                getComponentRate(populated),
                                populated.decimal_place,
                              )}`
                            : "component telah dihapus"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">
              Prioritas × ÷ sebelum + −. Isi kurung dihitung lebih dulu; tiap
              &ldquo;(&rdquo; punya dp &amp; arah pembulatan sendiri. Hasil
              akhir: {roundLabel(initialData.rounding)} ·{" "}
              {initialData.decimal_place} angka di belakang koma.
            </p>
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

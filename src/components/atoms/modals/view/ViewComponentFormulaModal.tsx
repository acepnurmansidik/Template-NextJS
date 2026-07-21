"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  ComponentFormulaApiDaum,
  RateType,
  AccountRef,
} from "@/types/componentFormula";
import { getComponentRate, formatRate } from "@/utils/formula";

// Label akun ter-populate (atau id string bila belum populate).
const accountLabel = (a: AccountRef): string => {
  if (typeof a === "string") return a;
  const code = a.code ? `${a.code}` : "";
  const name = a.name ?? a._id;
  return code ? `${code} — ${name}` : name;
};

// Render daftar akun sebagai chip.
const AccountChips = ({ accounts }: { accounts?: AccountRef[] }) =>
  !accounts || accounts.length === 0 ? (
    <span className="text-sm text-zinc-400 italic">Tidak ada akun.</span>
  ) : (
    <div className="flex flex-wrap gap-1.5">
      {accounts.map((a, i) => (
        <span
          key={typeof a === "string" ? a : (a._id ?? i)}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
        >
          {accountLabel(a)}
        </span>
      ))}
    </div>
  );

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
  const isExternal = initialData.rate_type === RateType.EXTERNAL;
  const usedByCount = initialData.component_id?.length ?? 0;
  const dp = initialData.decimal_place ?? 2;

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
            {field(
              "Rate Type",
              isExternal ? "External (x)" : (initialData.rate_type ?? "-"),
            )}
            {field(
              isExternal ? "Rate" : isCalculated ? "Calculated Rate" : "Fixed Rate",
              formatRate(
                isCalculated || isExternal
                  ? (initialData.calculated_rate ?? 0)
                  : (initialData.fixed_rate ?? 0),
                dp,
              ),
            )}
            {field("Decimal Place", String(initialData.decimal_place ?? "-"))}
            {field(
              "Effective Rate",
              formatRate(getComponentRate(initialData), dp),
            )}

            {/* ACCOUNTS */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Accounts
              </label>
              <AccountChips accounts={initialData.accounts} />
            </div>
            {isExternal && (
              <div className="group md:col-span-2">
                <p className="text-[11px] text-zinc-400">
                  Tipe EXTERNAL: saat dipakai di Calculated Formula ia tampil
                  sebagai <b>x {"{operator}"} rate</b> (mis. <b>x + {formatRate(
                    initialData.calculated_rate ?? 0,
                    dp,
                  )}</b>). Nilai <b>x</b> adalah target dari perhitungan koleksi
                  lain; operator dipilih di formula.
                </p>
              </div>
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

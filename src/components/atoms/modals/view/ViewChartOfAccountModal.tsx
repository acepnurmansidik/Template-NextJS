"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ChartOfAccountApiDaum;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
      {label}
    </p>
    <div className="text-sm text-zinc-800 dark:text-zinc-100">{value}</div>
  </div>
);

export default function ViewChartOfAccountModal({
  isOpen,
  onClose,
  initialData,
}: DataProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Chart of Account Detail
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono font-bold border border-zinc-300 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600">
              {initialData.code}
            </span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {initialData.name}
            </span>
            {initialData.is_header && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700">
                HEADER
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Type" value={initialData.type} />
            <Field label="Normal Balance" value={initialData.normal_balance} />
            <Field label="Level" value={initialData.level} />
            <Field
              label="Path"
              value={
                <span className="font-mono text-xs">{initialData.path}</span>
              }
            />
            <div className="col-span-2">
              <Field
                label="Description"
                value={initialData.description?.trim() || "—"}
              />
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

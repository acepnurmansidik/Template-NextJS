"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  AR_AP_STATUS_LABEL,
  ArApApiDaum,
  ArApStatus,
  formatAmount,
} from "@/types/arAp";
import { STATUS_BADGE } from "@/utils/utils";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ArApApiDaum;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
      {label}
    </p>
    <div className="text-sm text-zinc-800 dark:text-zinc-100">{value}</div>
  </div>
);

const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function ViewAccountPayableModal({
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

  const remaining =
    Math.round(
      ((initialData.total_amount ?? 0) - (initialData.paid_amount ?? 0)) * 100,
    ) / 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Payable Detail
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
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
              {initialData.entry_no}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                STATUS_BADGE[initialData.status]
              }`}
            >
              {AR_AP_STATUS_LABEL[initialData.status]}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Field label="Date" value={fmtDate(initialData.date)} />
            <Field label="Due Date" value={fmtDate(initialData.due_date)} />
            <Field
              label="Vendor"
              value={initialData.party_name?.trim() || "—"}
            />
            <Field
              label="Reference"
              value={initialData.reference?.trim() || "—"}
            />
            <Field
              label="Description"
              value={initialData.description?.trim() || "—"}
            />
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <table className="w-full text-left min-w-[560px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                  <th className="py-2.5 px-3 font-bold">Account</th>
                  <th className="py-2.5 px-3 font-bold">Description</th>
                  <th className="py-2.5 px-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {initialData.lines.map((line, index) => (
                  <tr
                    key={index}
                    className="border-t border-zinc-100 dark:border-zinc-800 text-sm"
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400 mr-2">
                        {line.account_code}
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {line.account_name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">
                      {line.description?.trim() || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-800 dark:text-zinc-200">
                      {formatAmount(line.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 font-bold text-sm">
                  <td
                    className="py-3 px-3 text-right text-zinc-500"
                    colSpan={2}
                  >
                    Total
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-800 dark:text-zinc-100">
                    {formatAmount(initialData.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Total"
              value={formatAmount(initialData.total_amount)}
            />
            <Field label="Paid" value={formatAmount(initialData.paid_amount)} />
            <Field
              label="Remaining"
              value={formatAmount(remaining < 0 ? 0 : remaining)}
            />
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

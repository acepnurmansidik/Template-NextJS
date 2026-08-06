"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { StockPositionApiDaum, refLabel } from "@/types/stockPosition";
import { formatCurrencyPure } from "@/utils/formatter";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: StockPositionApiDaum;
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

export default function ViewStockPositionModal({
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

  const qty = Number(initialData.quantity) || 0;
  const reserved = Number(initialData.reserved_quantity) || 0;
  const available = qty - reserved;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Stock Position Detail
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
            <span className="font-medium text-base text-zinc-900 dark:text-zinc-100">
              {refLabel(initialData.product_id)}
            </span>
            <span className="text-sm text-zinc-500">
              @ {refLabel(initialData.warehouse_id)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Field label="Product" value={refLabel(initialData.product_id)} />
            <Field label="Warehouse" value={refLabel(initialData.warehouse_id)} />
            <Field label="UOM" value={refLabel(initialData.uom_id)} />
            <Field
              label="Quantity"
              value={<span className="font-mono">{formatCurrencyPure(qty)}</span>}
            />
            <Field
              label="Reserved"
              value={
                <span className="font-mono">{formatCurrencyPure(reserved)}</span>
              }
            />
            <Field
              label="Available"
              value={
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyPure(available)}
                </span>
              }
            />
            <Field
              label="Created At"
              value={fmtDate(initialData.created_at)}
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

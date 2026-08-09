"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { DeliveryOrderApiDaum, DO_STATUS_LABEL } from "@/types/deliveryOrder";
import { refLabel } from "@/types/purchaseItem";
import { formatAmount, STATUS_BADGE } from "@/utils/utils";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: DeliveryOrderApiDaum;
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

export default function ViewDeliveryOrderModal({
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

  const items = initialData.items ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Delivery Order Detail
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
              {initialData.delivery_no}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                STATUS_BADGE[initialData.status] ?? ""
              }`}
            >
              {DO_STATUS_LABEL[initialData.status] ?? initialData.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Field label="Date" value={fmtDate(initialData.date)} />
            <Field
              label="Delivery Date"
              value={fmtDate(initialData.delivery_date)}
            />
            <Field
              label="Source Warehouse"
              value={refLabel(initialData.warehouse_id)}
            />
            <Field
              label="Recipient"
              value={initialData.recipient?.trim() || "—"}
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
            <table className="w-full text-left min-w-[480px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                  <th className="py-2.5 px-3 font-bold">SKU/Code</th>
                  <th className="py-2.5 px-3 font-bold">Product</th>
                  <th className="py-2.5 px-3 font-bold">UOM</th>
                  <th className="py-2.5 px-3 font-bold text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500"
                    >
                      No items.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-zinc-100 dark:border-zinc-800 text-sm"
                    >
                      <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200">
                        {refLabel(item.product_id)}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200">
                        {refLabel(item.product_id)}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">
                        {refLabel(item.uom_id)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-700 dark:text-zinc-300">
                        {formatAmount(item.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { SupplierApiDaum } from "@/types/supplier";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: SupplierApiDaum;
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

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${isActive ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700" : "border-zinc-300 bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"}`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function ViewSupplierModal({
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

  const contact = initialData.contact_info;
  const address = initialData.address;
  const phone =
    contact?.phone && contact.phone.length > 0
      ? contact.phone.join(", ")
      : "—";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Supplier Detail
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
              {initialData.name}
            </span>
            <span className="text-sm text-zinc-500">{initialData.code}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Field label="Code" value={initialData.code} />
            <Field label="Name" value={initialData.name} />
            <Field
              label="Contact Person"
              value={contact?.contact_person || "—"}
            />
            <Field label="Email" value={contact?.email || "—"} />
            <Field label="Phone" value={phone} />
            <Field
              label="Status"
              value={<StatusBadge isActive={initialData.is_active} />}
            />
            <Field label="Created At" value={fmtDate(initialData.created_at)} />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              Address
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Field label="Street" value={address?.street || "—"} />
              <Field label="City" value={address?.city || "—"} />
              <Field
                label="State / Province"
                value={address?.state_province || "—"}
              />
              <Field label="Postal Code" value={address?.postal_code || "—"} />
              <Field label="Country" value={address?.country || "—"} />
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

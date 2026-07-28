"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BranchApiDaum } from "@/types/facility";

interface DataProps {
  isOpen: boolean;
  initialData: BranchApiDaum;
  onClose: () => void;
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
      {label}
    </p>
    <p className="text-sm text-zinc-800 dark:text-zinc-200">{value || "—"}</p>
  </div>
);

export default function ViewBranchModal({
  isOpen,
  initialData,
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

  const c = initialData;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {c.code}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {c.name}
          </h2>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              c.is_active
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
            }`}
          >
            {c.is_active ? "Active" : "Inactive"}
          </span>
        </div>
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
            <Field label="Slug" value={c.slug} />
            <Field label="Manager" value={c.contact_info?.manager_name} />
            <Field label="Email" value={c.contact_info?.email} />
            <Field label="Phone" value={c.contact_info?.phone?.join(", ")} />
            <Field label="Street" value={c.address?.street} />
            <Field label="City" value={c.address?.city} />
            <Field label="State / Province" value={c.address?.state_province} />
            <Field label="Postal Code" value={c.address?.postal_code} />
            <Field label="Country" value={c.address?.country} />
            <Field
              label="Coordinates (lat, lng)"
              value={
                c.location?.coordinates &&
                (c.location.coordinates[0] || c.location.coordinates[1])
                  ? `${c.location.coordinates[1]}, ${c.location.coordinates[0]}`
                  : undefined
              }
            />
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 grid grid-cols-1 gap-6">
            <Field label="Description" value={c.description} />
            <Field label="Notes" value={c.notes} />
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end bg-zinc-50 dark:bg-zinc-900/50">
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

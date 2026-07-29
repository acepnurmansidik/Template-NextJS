"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { LayoutComponentApiDaum } from "@/types/LayoutComponent";
import { imageUrl, refImagePath } from "@/types/facility";

interface DataProps {
  isOpen: boolean;
  initialData: LayoutComponentApiDaum;
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

export default function ViewLayoutComponentModal({
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
  const image = refImagePath(c.image_id);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {c.category}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {c.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl(image)}
                alt={c.name}
                className="w-full h-48 object-contain rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3"
              />
            ) : (
              <div className="w-full h-48 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                No image
              </div>
            )}
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <Field label="Name" value={c.name} />
            <Field label="Category" value={c.category} />
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

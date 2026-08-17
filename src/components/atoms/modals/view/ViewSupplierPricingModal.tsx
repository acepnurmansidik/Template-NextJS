"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  SupplierPricingApiDaum,
  refLabel,
  imageRefPath,
} from "@/types/supplierPricing";

interface DataProps {
  isOpen: boolean;
  initialData: SupplierPricingApiDaum;
  onClose: () => void;
}

const priceFmt = new Intl.NumberFormat("id-ID");

const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1";
const valueCls = "text-sm text-zinc-800 dark:text-zinc-100";

export default function ViewSupplierPricingModal({
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

  const imgPath = imageRefPath(initialData.product_image_id);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Supplier Pricing Detail
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
            <div>
              <span className={labelCls}>Name</span>
              <p className={valueCls}>{initialData.name}</p>
            </div>
            <div>
              <span className={labelCls}>Supplier</span>
              <p className={valueCls}>{refLabel(initialData.supplier_id)}</p>
            </div>
            <div>
              <span className={labelCls}>UOM</span>
              <p className={valueCls}>{refLabel(initialData.uom_id)}</p>
            </div>
            <div>
              <span className={labelCls}>Price</span>
              <p className={`${valueCls} tabular-nums`}>
                {priceFmt.format(initialData.price ?? 0)}
              </p>
            </div>
            <div>
              <span className={labelCls}>Barcode</span>
              <p className={`${valueCls} font-mono`}>
                {initialData.barcode || "—"}
              </p>
            </div>
            <div>
              <span className={labelCls}>Status</span>
              <p className={valueCls}>
                {initialData.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            {imgPath && (
              <div className="md:col-span-2">
                <span className={labelCls}>Product Image</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgPath}
                  alt={initialData.name}
                  className="mt-1 h-40 w-40 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            )}
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

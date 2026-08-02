"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import { ListResponse, SingleResponse } from "@/types/api";
import {
  MovementType,
  MOVEMENT_TYPE_LABEL,
  FormDataStockMovementProps,
  StockMovementApiDaum,
  StockMovementPayload,
} from "@/types/stockMovement";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

type UomRef = string | { _id: string; code?: string; name?: string } | null;

// Bentuk minimal record sumber dropdown (product membawa uom_id).
interface SourceDaum {
  _id: string;
  code?: string;
  name?: string;
  uom_id?: UomRef;
}

// { id, label } UOM dari sebuah ref (string id atau objek populate).
const labelUom = (u?: UomRef) => {
  if (!u) return { id: null as string | null, label: "" };
  if (typeof u === "object")
    return {
      id: u._id,
      label: `${u.code ?? ""}${u.code && u.name ? " — " : ""}${u.name ?? ""}`,
    };
  return { id: u, label: u };
};

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const readOnlyCls =
  "w-full bg-zinc-100 dark:bg-zinc-800/60 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const TYPE_OPTIONS: Option[] = Object.values(MovementType).map((t) => ({
  value: t,
  label: MOVEMENT_TYPE_LABEL[t],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const codeNameLabel = (d: SourceDaum) =>
  d.code ? `${d.code} — ${d.name ?? ""}`.trim() : (d.name ?? d._id);

export default function CreateStockMovementModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  // Daftar opsi dropdown di-fetch dari API — tetap terpisah dari formData.
  const [products, setProducts] = useState<SourceDaum[]>([]);
  const [warehouses, setWarehouses] = useState<SourceDaum[]>([]);

  const [formData, setFormData] = useState<FormDataStockMovementProps>(() => ({
    type: MovementType.IN,
    product_id: null,
    warehouse_id: null,
    destination_warehouse_id: null,
    quantity: 0,
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    note: "",
  }));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, whRes] = await Promise.all([
          apiGet<ListResponse<SourceDaum>>("/product", { limit: 1000 }, false),
          apiGet<ListResponse<SourceDaum>>(
            "/warehouse",
            { limit: 1000 },
            false,
          ),
        ]);
        setProducts(prodRes.data ?? []);
        setWarehouses(whRes.data ?? []);
      } catch {
        setProducts([]);
        setWarehouses([]);
      }
    })();
  }, []);

  const productOptions: Option[] = useMemo(
    () => products.map((p) => ({ value: p._id, label: codeNameLabel(p) })),
    [products],
  );
  const warehouseOptions: Option[] = useMemo(
    () => warehouses.map((w) => ({ value: w._id, label: codeNameLabel(w) })),
    [warehouses],
  );

  const selectedProductRow = products.find(
    (p) => p._id === formData.product_id,
  );
  const productUom = labelUom(selectedProductRow?.uom_id);

  const handleSubmit = async () => {
    const {
      type,
      product_id,
      warehouse_id,
      destination_warehouse_id,
      quantity,
      date,
      reference,
      note,
    } = formData;

    if (!product_id || !warehouse_id) {
      Swal.fire({
        icon: "warning",
        title: "Product & warehouse are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (type === MovementType.TRANSFER && !destination_warehouse_id) {
      Swal.fire({
        icon: "warning",
        title: "Destination warehouse is required for transfer",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: StockMovementPayload = {
        product_id,
        warehouse_id,
        destination_warehouse_id:
          type === MovementType.TRANSFER ? destination_warehouse_id : null,
        // UOM otomatis dari product terpilih.
        uom_id: productUom.id,
        type,
        quantity,
        reference: reference.trim(),
        date,
        note: note.trim(),
      };

      const result = await apiPost<SingleResponse<StockMovementApiDaum>>(
        "/stock-movement",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Stock movement created successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          timerProgressBar: true,
        });
        if (onSuccess) onSuccess();
        else onClose();
      }
    } catch (error) {
      setIsLoading(false);
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: serverMessage || "Failed to save data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  const selectedType =
    TYPE_OPTIONS.find((o) => o.value === formData.type) ?? null;
  const selectedProduct =
    productOptions.find((o) => o.value === formData.product_id) ?? null;
  const selectedWarehouse =
    warehouseOptions.find((o) => o.value === formData.warehouse_id) ?? null;
  const selectedDestination =
    warehouseOptions.find(
      (o) => o.value === formData.destination_warehouse_id,
    ) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Stock Movement
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
            <div className="group">
              <label className={labelCls}>
                Type<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="movement-type-create"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: (opt?.value as MovementType) ?? MovementType.IN,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Product<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="movement-product-create"
                classNamePrefix="rs"
                placeholder="Select product…"
                options={productOptions}
                value={selectedProduct}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_id: opt?.value ?? null,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Warehouse<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="movement-warehouse-create"
                classNamePrefix="rs"
                placeholder="Select warehouse…"
                options={warehouseOptions}
                value={selectedWarehouse}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    warehouse_id: opt?.value ?? null,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            {formData.type === MovementType.TRANSFER && (
              <div className="group">
                <label className={labelCls}>
                  Destination Warehouse
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="movement-destination-create"
                  classNamePrefix="rs"
                  placeholder="Select destination…"
                  options={warehouseOptions}
                  value={selectedDestination}
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      destination_warehouse_id: opt?.value ?? null,
                    }))
                  }
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={selectStyles}
                />
              </div>
            )}

            <div className="group">
              <label className={labelCls}>UOM (dari product)</label>
              <div className={readOnlyCls}>
                {productUom.label || "Pilih product dulu"}
              </div>
            </div>

            <div className="group">
              <label className={labelCls}>
                Quantity<span className="text-red-500">*</span>
              </label>
              <CurrencyInput
                value={formData.quantity}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, quantity: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Reference</label>
              <input
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="e.g. PO-0001"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={2}
                className={`${inputCls} resize-none`}
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
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed italic" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

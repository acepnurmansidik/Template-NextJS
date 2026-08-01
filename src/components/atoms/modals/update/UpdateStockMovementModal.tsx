"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import { ListResponse, SingleResponse } from "@/types/api";
import {
  MovementType,
  MOVEMENT_TYPE_LABEL,
  Ref,
  StockMovementApiDaum,
  StockMovementPayload,
} from "@/types/stockMovement";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  initialData: StockMovementApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

interface SourceDaum {
  _id: string;
  code?: string;
  name?: string;
  uom_id?: Ref | null;
}

// { id, label } UOM dari sebuah Ref.
const labelUom = (u?: Ref | null) => {
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

// Ekstrak id dari sebuah Ref (bisa string atau object populate).
const refId = (r?: Ref | null): string | null =>
  r ? (typeof r === "object" ? r._id : r) : null;

export default function UpdateStockMovementModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [products, setProducts] = useState<SourceDaum[]>([]);
  const [warehouses, setWarehouses] = useState<SourceDaum[]>([]);

  const [type, setType] = useState<MovementType>(initialData.type);
  const [productId, setProductId] = useState<string | null>(
    refId(initialData.product_id),
  );
  const [warehouseId, setWarehouseId] = useState<string | null>(
    refId(initialData.warehouse_id),
  );
  const [destinationWarehouseId, setDestinationWarehouseId] = useState<
    string | null
  >(refId(initialData.destination_warehouse_id));
  const [quantity, setQuantity] = useState(initialData.quantity ?? 0);
  const [date, setDate] = useState(initialData.date?.slice(0, 10) ?? "");
  const [reference, setReference] = useState(initialData.reference ?? "");
  const [note, setNote] = useState(initialData.note ?? "");
  const [isLoading, setIsLoading] = useState(false);

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

  const selectedProductRow = products.find((p) => p._id === productId);
  // UOM otomatis dari product; fallback ke UOM awal jika product belum termuat.
  const productUom = selectedProductRow
    ? labelUom(selectedProductRow.uom_id)
    : labelUom(initialData.uom_id);

  const handleSubmit = async () => {
    if (!productId || !warehouseId) {
      Swal.fire({
        icon: "warning",
        title: "Product & warehouse are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (type === MovementType.TRANSFER && !destinationWarehouseId) {
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
        product_id: productId,
        warehouse_id: warehouseId,
        destination_warehouse_id:
          type === MovementType.TRANSFER ? destinationWarehouseId : null,
        uom_id: productUom.id,
        type,
        quantity,
        reference: reference.trim(),
        date,
        note: note.trim(),
      };

      const result = await apiPut<SingleResponse<StockMovementApiDaum>>(
        `/stock-movement/${initialData._id}`,
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Your data has been updated successfully.",
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
        text: serverMessage || "Failed to update data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  const selectedType = TYPE_OPTIONS.find((o) => o.value === type) ?? null;
  const selectedProduct =
    productOptions.find((o) => o.value === productId) ?? null;
  const selectedWarehouse =
    warehouseOptions.find((o) => o.value === warehouseId) ?? null;
  const selectedDestination =
    warehouseOptions.find((o) => o.value === destinationWarehouseId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Stock Movement
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            {initialData._id}
          </p>
        </div>
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
                instanceId="movement-type-update"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setType((opt?.value as MovementType) ?? MovementType.IN)
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
                instanceId="movement-product-update"
                classNamePrefix="rs"
                placeholder="Select product…"
                options={productOptions}
                value={selectedProduct}
                onChange={(opt) => setProductId(opt?.value ?? null)}
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
                instanceId="movement-warehouse-update"
                classNamePrefix="rs"
                placeholder="Select warehouse…"
                options={warehouseOptions}
                value={selectedWarehouse}
                onChange={(opt) => setWarehouseId(opt?.value ?? null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            {type === MovementType.TRANSFER && (
              <div className="group">
                <label className={labelCls}>
                  Destination Warehouse
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="movement-destination-update"
                  classNamePrefix="rs"
                  placeholder="Select destination…"
                  options={warehouseOptions}
                  value={selectedDestination}
                  onChange={(opt) =>
                    setDestinationWarehouseId(opt?.value ?? null)
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
                value={quantity}
                onChange={setQuantity}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Reference</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. PO-0001"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}

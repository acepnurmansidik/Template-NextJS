"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import { ListResponse, SingleResponse } from "@/types/api";
import {
  FormDataStockPositionProps,
  StockPositionApiDaum,
  StockPositionPayload,
} from "@/types/stockPosition";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

// UOM bisa berupa id string atau objek populate.
type UomRef = string | { _id: string; code?: string; name?: string } | null;

// Product membawa uom_id (dari populate) supaya UOM bisa diturunkan otomatis.
interface RefSourceDaum {
  _id: string;
  code?: string;
  name?: string;
  uom_id?: UomRef;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const readOnlyCls =
  "w-full bg-zinc-100 dark:bg-zinc-800/60 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const toOptions = (rows: RefSourceDaum[]): Option[] =>
  rows.map((r) => ({
    value: r._id,
    label: `${r.code ?? "—"} — ${r.name ?? "—"}`,
  }));

// Ambil { id, label } UOM dari sebuah product row.
const uomOf = (row?: RefSourceDaum) => {
  const u = row?.uom_id;
  if (!u) return { id: null as string | null, label: "" };
  if (typeof u === "object")
    return {
      id: u._id,
      label: `${u.code ?? ""}${u.code && u.name ? " — " : ""}${u.name ?? ""}`,
    };
  return { id: u, label: u };
};

export default function CreateStockPositionModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  // FETCHED option lists — tetap state terpisah (product & warehouse rows).
  const [products, setProducts] = useState<RefSourceDaum[]>([]);
  const [warehouses, setWarehouses] = useState<RefSourceDaum[]>([]);

  const [formData, setFormData] = useState<FormDataStockPositionProps>({
    product_id: null,
    warehouse_id: null,
    quantity: 0,
    reserved_quantity: 0,
  });
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
          apiGet<ListResponse<RefSourceDaum>>(
            "/product",
            { limit: 1000 },
            false,
          ),
          apiGet<ListResponse<RefSourceDaum>>(
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

  const productOptions = useMemo(() => toOptions(products), [products]);
  const warehouseOptions = useMemo(() => toOptions(warehouses), [warehouses]);

  const selectedProductRow = products.find(
    (p) => p._id === formData.product_id,
  );
  const productUom = uomOf(selectedProductRow);

  const handleSubmit = async () => {
    const { product_id, warehouse_id, quantity, reserved_quantity } = formData;

    if (!product_id || !warehouse_id) {
      Swal.fire({
        icon: "warning",
        title: "Product & warehouse are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: StockPositionPayload = {
        product_id,
        warehouse_id,
        // UOM otomatis mengikuti UOM dari product terpilih.
        uom_id: productUom.id,
        quantity,
        reserved_quantity,
      };

      const result = await apiPost<SingleResponse<StockPositionApiDaum>>(
        "/stock-position",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Stock position created successfully.",
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

  const selectedProduct =
    productOptions.find((o) => o.value === formData.product_id) ?? null;
  const selectedWarehouse =
    warehouseOptions.find((o) => o.value === formData.warehouse_id) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Stock Position
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
                Product<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="stock-product-create"
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
                instanceId="stock-warehouse-create"
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

            <div className="group">
              <label className={labelCls}>UOM (dari product)</label>
              <div className={readOnlyCls}>
                {productUom.label || "Pilih product dulu"}
              </div>
            </div>

            <div className="group">
              <label className={labelCls}>Quantity</label>
              <CurrencyInput
                value={formData.quantity}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, quantity: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Reserved Quantity</label>
              <CurrencyInput
                value={formData.reserved_quantity}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, reserved_quantity: v }))
                }
                className={inputCls}
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

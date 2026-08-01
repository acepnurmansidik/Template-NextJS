"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import { ProductApiDaum, ProductPayload } from "@/types/product";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import { ListResponse, SingleResponse } from "@/types/api";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

interface CategoryDaum {
  _id: string;
  name: string;
  prefix?: string;
}
interface UomDaum {
  _id: string;
  name: string;
  code: string;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [categories, setCategories] = useState<CategoryDaum[]>([]);
  const [uoms, setUoms] = useState<UomDaum[]>([]);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [uomId, setUomId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
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
        const result = await apiGet<ListResponse<CategoryDaum>>(
          "/product-category",
          { limit: 1000 },
          false,
        );
        setCategories(result.data ?? []);
      } catch {
        setCategories([]);
      }
    })();
    (async () => {
      try {
        const result = await apiGet<ListResponse<UomDaum>>(
          "/uom",
          { limit: 1000 },
          false,
        );
        setUoms(result.data ?? []);
      } catch {
        setUoms([]);
      }
    })();
  }, []);

  const categoryOptions: Option[] = useMemo(
    () =>
      categories.map((c) => ({
        value: c._id,
        label: `${c.prefix ?? "—"} — ${c.name}`,
      })),
    [categories],
  );
  const uomOptions: Option[] = useMemo(
    () => uoms.map((u) => ({ value: u._id, label: `${u.code} — ${u.name}` })),
    [uoms],
  );

  const handleSubmit = async () => {
    if (!categoryId || !uomId || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Category, UOM & Name are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ProductPayload = {
        product_category_id: categoryId,
        uom_id: uomId,
        // Kosongkan → backend auto-generate kode per kategori.
        code: code.trim() || undefined,
        name: name.trim(),
        description: description.trim(),
        barcode: barcode.trim(),
        purchase_price: purchasePrice,
        selling_price: sellingPrice,
      };

      const result = await apiPost<SingleResponse<ProductApiDaum>>(
        "/product",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Product created successfully.",
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

  const selectedCategory =
    categoryOptions.find((o) => o.value === categoryId) ?? null;
  const selectedUom = uomOptions.find((o) => o.value === uomId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Product
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
                Category<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="product-category-create"
                classNamePrefix="rs"
                placeholder="Select category…"
                options={categoryOptions}
                value={selectedCategory}
                onChange={(opt) => setCategoryId(opt?.value ?? null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                UOM<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="product-uom-create"
                classNamePrefix="rs"
                placeholder="Select unit of measure…"
                options={uomOptions}
                value={selectedUom}
                onChange={(opt) => setUomId(opt?.value ?? null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Code / SKU</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Kosongkan untuk auto-generate"
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Otomatis dibuat dari prefix kategori bila dikosongkan.
              </p>
            </div>

            <div className="group">
              <label className={labelCls}>
                Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Barcode</label>
              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Barcode (optional)"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Purchase Price</label>
              <CurrencyInput
                value={purchasePrice}
                onChange={setPurchasePrice}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Selling Price</label>
              <CurrencyInput
                value={sellingPrice}
                onChange={setSellingPrice}
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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

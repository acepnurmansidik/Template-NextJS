"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import {
  FormDataProductProps,
  ProductApiDaum,
  ProductPayload,
  Ref,
  imageRefId,
  imageRefPath,
} from "@/types/product";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import ImageUpload from "@/components/atoms/shared/ImageUpload";
import { ListResponse, SingleResponse } from "@/types/api";

interface DataProps {
  isOpen: boolean;
  initialData: ProductApiDaum;
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

// Ambil id dari sebuah Ref: kalau object pakai `._id`, kalau string pakai apa adanya.
const refId = (r?: Ref): string | null =>
  r ? (typeof r === "object" ? r._id : r) : null;

export default function UpdateProductModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  // FETCHED option lists — tetap state terpisah (hanya daftar option-nya).
  const [categories, setCategories] = useState<CategoryDaum[]>([]);
  const [uoms, setUoms] = useState<UomDaum[]>([]);

  const [formData, setFormData] = useState<FormDataProductProps>(() => ({
    product_category_id: refId(initialData.product_category_id),
    uom_id: refId(initialData.uom_id),
    product_image_id: imageRefId(initialData.product_image_id),
    code: initialData.code ?? "",
    name: initialData.name ?? "",
    barcode: initialData.barcode ?? "",
    description: initialData.description ?? "",
    purchase_price: initialData.purchase_price ?? 0,
    selling_price: initialData.selling_price ?? 0,
    is_active: initialData.is_active,
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
    const {
      product_category_id,
      uom_id,
      code,
      name,
      description,
      barcode,
      purchase_price,
      selling_price,
      is_active,
    } = formData;

    if (!product_category_id || !uom_id || !code.trim() || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Category, UOM, Code & Name are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ProductPayload = {
        product_category_id,
        uom_id,
        product_image_id: formData.product_image_id,
        code: code.trim(),
        name: name.trim(),
        description: description.trim(),
        barcode: barcode.trim(),
        purchase_price,
        selling_price,
        is_active,
      };

      const result = await apiPut<SingleResponse<ProductApiDaum>>(
        `/product/${initialData._id}`,
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

  const selectedCategory =
    categoryOptions.find((o) => o.value === formData.product_category_id) ??
    null;
  const selectedUom =
    uomOptions.find((o) => o.value === formData.uom_id) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Product
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            {initialData.code}
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
                Category<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="product-category-update"
                classNamePrefix="rs"
                placeholder="Select category…"
                options={categoryOptions}
                value={selectedCategory}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_category_id: opt?.value ?? null,
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
                UOM<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="product-uom-update"
                classNamePrefix="rs"
                placeholder="Select unit of measure…"
                options={uomOptions}
                value={selectedUom}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    uom_id: opt?.value ?? null,
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
                Code<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.code}
                name="code"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Barcode</label>
              <input
                value={formData.barcode}
                name="barcode"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-3 cursor-pointer select-none mt-7">
                <input
                  type="checkbox"
                  checked={formData.is_active ?? false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Active
                </span>
              </label>
            </div>

            <div className="group">
              <label className={labelCls}>Purchase Price</label>
              <CurrencyInput
                value={formData.purchase_price}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, purchase_price: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Selling Price</label>
              <CurrencyInput
                value={formData.selling_price}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, selling_price: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={formData.description}
                name="description"
                onChange={handleChange}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/upload/single"
                label="Product Image"
                value={formData.product_image_id}
                imagePath={imageRefPath(initialData.product_image_id)}
                onChange={(imageId) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_image_id: imageId,
                  }))
                }
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import ImageUpload from "@/components/atoms/shared/ImageUpload";
import { ListResponse, SingleResponse } from "@/types/api";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import {
  FormDataSupplierPricingProps,
  SupplierPricingApiDaum,
  SupplierPricingPayload,
  imageRefId,
} from "@/types/supplierPricing";

interface DataProps {
  isOpen: boolean;
  initialData: SupplierPricingApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

interface UomDaum {
  _id: string;
  name: string;
  code: string;
}
interface SupplierDaum {
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

// Ambil id string dari sebuah Ref (string atau objek populate).
const refId = (r: unknown): string =>
  r && typeof r === "object" ? ((r as { _id?: string })._id ?? "") : (r as string) ?? "";

export default function UpdateSupplierPricingModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [uoms, setUoms] = useState<UomDaum[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataSupplierPricingProps>({
    uom_id: refId(initialData.uom_id) || null,
    product_image_id: imageRefId(initialData.product_image_id),
    supplier_id: initialData.supplier_id?._id ?? null,
    name: initialData.name ?? "",
    barcode: initialData.barcode ?? "",
    price: initialData.price ?? 0,
    is_active: initialData.is_active ?? true,
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Option | null>(
    initialData.supplier_id?._id
      ? {
          value: initialData.supplier_id._id,
          label: initialData.supplier_id.name ?? initialData.supplier_id._id,
        }
      : null,
  );

  const supplierOptions = useMemo(
    () =>
      debounce(
        (inputValue: string, callback: (options: Option[]) => void) => {
          apiGet<ListResponse<SupplierDaum>>(
            "/supplier",
            { page: 1, limit: 5, search: inputValue },
            false,
          )
            .then((result) =>
              callback(
                (result.data ?? []).map((s) => ({
                  value: s._id,
                  label: s.name,
                })),
              ),
            )
            .catch(() => callback([]));
        },
        3000,
        { leading: true },
      ),
    [],
  );

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

  const uomOptions: Option[] = useMemo(
    () => uoms.map((u) => ({ value: u._id, label: `${u.code} — ${u.name}` })),
    [uoms],
  );

  const handleSubmit = async () => {
    const { uom_id, name, barcode, price } = formData;
    if (!price || !uom_id || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Price, UOM & Name are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: SupplierPricingPayload = {
        uom_id,
        product_image_id: formData.product_image_id,
        supplier_id: formData.supplier_id,
        name: name.trim(),
        price,
        barcode,
        is_active: formData.is_active,
      };

      const result = await apiPut<SingleResponse<SupplierPricingApiDaum>>(
        `/supplier-pricing/${initialData._id}`,
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Supplier pricing updated successfully.",
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

  const selectedUom =
    uomOptions.find((o) => o.value === formData.uom_id) ?? null;

  const handleSelectedSupplier = (data: Option | null) => {
    setSelectedSupplier(data);
    setFormData((prev) => ({ ...prev, supplier_id: data?.value ?? null }));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Supplier Pricing
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
                UOM<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="supplier-pricing-uom-update"
                classNamePrefix="rs"
                placeholder="Select unit of measure…"
                options={uomOptions}
                value={selectedUom}
                onChange={(opt) =>
                  setFormData((prev) => ({ ...prev, uom_id: opt?.value ?? null }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
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
                placeholder="Product name"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Supplier</label>
              <AsyncSelect
                isSearchable
                cacheOptions
                defaultOptions={true}
                loadOptions={supplierOptions}
                instanceId="supplier-pricing-supplier-update"
                classNamePrefix="rs"
                placeholder="Ketik untuk mencari..."
                value={selectedSupplier}
                onChange={(vals) => handleSelectedSupplier(vals as Option | null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base: Record<string, unknown>) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Price<span className="text-red-500">*</span>
              </label>
              <CurrencyInput
                value={formData.price}
                onChange={(v) => setFormData((prev) => ({ ...prev, price: v }))}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Barcode</label>
              <input
                value={formData.barcode}
                name="barcode"
                onChange={handleChange}
                placeholder="Barcode (optional)"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Status</label>
              <Select
                instanceId="supplier-pricing-status-update"
                classNamePrefix="rs"
                options={[
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
                value={{
                  value: String(formData.is_active),
                  label: formData.is_active ? "Active" : "Inactive",
                }}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: opt?.value === "true",
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/upload/single"
                label="Product Image"
                value={formData.product_image_id}
                onChange={(imageId) =>
                  setFormData((prev) => ({ ...prev, product_image_id: imageId }))
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
          {isLoading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

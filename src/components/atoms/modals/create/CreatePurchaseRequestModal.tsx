"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { apiPost } from "@/utils/api";
import { SingleResponse } from "@/types/api";
import {
  FormDataPurchaseRequestProps,
  PurchaseRequestApiDaum,
  PurchaseRequestPayload,
} from "@/types/purchaseRequest";
import {
  ProcurementStatus,
  PurchaseItemForm,
  emptyPurchaseItem,
  formItemToPayload,
  refCodeName,
  refId,
} from "@/types/purchaseItem";
import {
  ProductOption,
  inputCls,
  readOnlyCls,
  labelCls,
} from "@/utils/procurement";
import ProductAsyncSelect from "@/components/atoms/shared/ProductAsyncSelect";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function CreatePurchaseRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  // Produk dicari server-side lewat ProductAsyncSelect (limit 5 + debounce).
  const [formData, setFormData] = useState<FormDataPurchaseRequestProps>(
    () => ({
      date: today(),
      needed_date: "",
      requested_by: "",
      reference: "",
      description: "",
      status: ProcurementStatus.DRAFT,
    }),
  );
  const [items, setItems] = useState<PurchaseItemForm[]>([
    { ...emptyPurchaseItem },
  ]);
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

  const addItem = () => setItems((prev) => [...prev, { ...emptyPurchaseItem }]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));
  const patchItem = (index: number, patch: Partial<PurchaseItemForm>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  // Saat produk dipilih dari AsyncSelect: set uom + label + prefill harga beli
  // dari master (bila baris masih 0). opt.data membawa product mentah.
  const handlePickProduct = (index: number, opt: ProductOption | null) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        if (!opt) {
          return {
            ...it,
            product_id: "",
            product_label: "",
            uom_id: null,
            uom_label: "",
          };
        }
        const data = opt.data;
        return {
          ...it,
          product_id: opt.value,
          product_label: opt.label,
          uom_id: refId(data?.uom_id ?? null),
          uom_label: refCodeName(data?.uom_id ?? null),
          price: it.price > 0 ? it.price : Number(data?.purchase_price) || 0,
        };
      }),
    );
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      Swal.fire({
        icon: "warning",
        title: "Date is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    const filled = items.filter((it) => it.product_id);
    if (filled.length < 1) {
      Swal.fire({
        icon: "warning",
        title: "At least 1 item required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    const productIds = filled.map((it) => it.product_id);
    if (new Set(productIds).size !== productIds.length) {
      Swal.fire({
        icon: "warning",
        title: "Produk tidak boleh duplikat",
        text: "Setiap produk hanya boleh muncul satu kali dalam satu request.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (filled.some((it) => (Number(it.quantity) || 0) <= 0)) {
      Swal.fire({
        icon: "warning",
        title: "Every item needs a quantity greater than 0",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { date, needed_date, requested_by, reference, description } =
        formData;
      const payload: PurchaseRequestPayload = {
        date,
        needed_date: needed_date || undefined,
        requested_by: requested_by.trim() || undefined,
        reference: reference.trim() || undefined,
        description: description.trim() || undefined,
        items: filled.map(formItemToPayload),
      };

      const result = await apiPost<SingleResponse<PurchaseRequestApiDaum>>(
        "/purchase-request",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Your data has been saved successfully.",
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Purchase Request
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
          {/* HEADER FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className={labelCls}>
                Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Needed Date</label>
              <input
                type="date"
                name="needed_date"
                value={formData.needed_date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Description / Memo</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this request for?"
                className={inputCls}
              />
            </div>
          </div>

          {/* ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="h-8 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-3 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FiPlus size={13} />
                Add item
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left min-w-[860px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[36%]">Product</th>
                    <th className="py-2.5 px-3 font-bold w-[14%]">UOM</th>
                    <th className="py-2.5 px-3 font-bold w-[14%] text-right">
                      Qty
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[6%]" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-t border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-2 px-3 align-top">
                          <ProductAsyncSelect
                            instanceId={`pr-item-product-${index}`}
                            value={item.product_id}
                            label={item.product_label}
                            onPick={(opt) => handlePickProduct(index, opt)}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <div className={readOnlyCls}>
                            {item.uom_label || "—"}
                          </div>
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={item.quantity}
                            placeholder="0"
                            aria-label={`Quantity item ${index + 1}`}
                            onChange={(v) => patchItem(index, { quantity: v })}
                            className={`${inputCls} text-right`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length <= 1}
                            title={
                              items.length <= 1
                                ? "At least 1 item is required"
                                : "Remove item"
                            }
                            className="h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
          {isLoading ? "Creating..." : "Save as Draft"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { apiPut } from "@/utils/api";
import { SingleResponse } from "@/types/api";
import {
  FormDataPurchaseOrderProps,
  PurchaseOrderApiDaum,
  PurchaseOrderPayload,
} from "@/types/purchaseOrder";
import {
  DetailItemStatus,
  ProcurementStatus,
  PurchaseItemForm,
  apiItemToForm,
  emptyPurchaseItem,
  formItemToPayload,
  refCodeName,
  refId,
  sumItems,
} from "@/types/purchaseItem";
import {
  ProductOption,
  PurchaseRequestOption,
  fetchPurchaseRequestOptionsByIds,
  inputCls,
  readOnlyCls,
  labelCls,
} from "@/utils/procurement";
import ProductAsyncSelect from "@/components/atoms/shared/ProductAsyncSelect";
import SupplierAsyncSelect from "@/components/atoms/shared/SupplierAsyncSelect";
import PurchaseRequestMultiSelect from "@/components/atoms/shared/PurchaseRequestMultiSelect";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import { formatAmount } from "@/utils/utils";

interface DataProps {
  isOpen: boolean;
  initialData: PurchaseOrderApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdatePurchaseOrderModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] = useState<FormDataPurchaseOrderProps>(() => ({
    date: initialData.date?.slice(0, 10) ?? "",
    expected_date: initialData.expected_date?.slice(0, 10) ?? "",
    reference: initialData.reference ?? "",
    description: initialData.description ?? "",
    status: initialData.status ?? ProcurementStatus.DRAFT,
  }));
  const [items, setItems] = useState<PurchaseItemForm[]>(() =>
    (initialData.items ?? []).map((it) =>
      apiItemToForm(it, refId(it.purchase_request_id)),
    ),
  );
  // PR terpilih. Seed awal dari pr_ids (label request_no bila di-populate);
  // data.items diisi belakangan via fetch by id agar diff item tetap benar.
  const [selectedPrs, setSelectedPrs] = useState<PurchaseRequestOption[]>(() =>
    (initialData.pr_ids ?? [])
      .map((r) => {
        const id = refId(r);
        if (!id) return null;
        const label =
          r && typeof r === "object" && "request_no" in r
            ? String((r as { request_no?: string }).request_no ?? id)
            : id;
        return {
          value: id,
          label,
          data: {
            _id: id,
            request_no: label,
            items: [],
          } as unknown as PurchaseRequestOption["data"],
        };
      })
      .filter((o): o is PurchaseRequestOption => o !== null),
  );
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

  // Lengkapi data.items untuk PR yang sudah terpilih (hanya PR terkait, sedikit)
  // supaya jika user melepas lalu memilih ulang, diff item tetap benar.
  useEffect(() => {
    const ids = (initialData.pr_ids ?? [])
      .map((r) => refId(r))
      .filter((v): v is string => !!v);
    if (ids.length < 1) return;
    let alive = true;
    fetchPurchaseRequestOptionsByIds(ids).then((opts) => {
      if (!alive || opts.length < 1) return;
      const byId = new Map(opts.map((o) => [o.value, o]));
      setSelectedPrs((prev) => prev.map((o) => byId.get(o.value) ?? o));
    });
    return () => {
      alive = false;
    };
    // initialData.pr_ids stabil selama modal terbuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = sumItems(items);

  const addItem = () =>
    setItems((prev) => [...prev, { ...emptyPurchaseItem }]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));
  const patchItem = (index: number, patch: Partial<PurchaseItemForm>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

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
          // Ganti produk -> reset supplier; supplier dipilih dari yang punya
          // produk ini (supplier-pricing).
          supplier_id: null,
          supplier_label: "",
        };
      }),
    );
  };

  // PR dipilih/dilepas (diff): baris dari PR yang DILEPAS dihapus; baris dari PR
  // yang DITAMBAH di-append (hanya item PENDING). Baris yang sudah ada (dari
  // initialData atau PR lain) tidak tersentuh. Tiap opsi PR membawa data.items.
  const handlePrChange = (nextOpts: PurchaseRequestOption[]) => {
    const prevIds = selectedPrs.map((o) => o.value);
    const nextIds = nextOpts.map((o) => o.value);
    const removed = prevIds.filter((id) => !nextIds.includes(id));
    const added = nextOpts.filter((o) => !prevIds.includes(o.value));

    setItems((prev) => {
      let result = prev.filter(
        (it) => !it.source_pr_id || !removed.includes(it.source_pr_id),
      );
      for (const opt of added) {
        for (const raw of opt.data.items ?? []) {
          const onThisPo = refId(raw.purchase_order_id) === initialData._id;
          if (raw.status && raw.status !== DetailItemStatus.PENDING && !onThisPo)
            continue;
          result = [...result, apiItemToForm(raw, opt.value)];
        }
      }
      return result;
    });
    setSelectedPrs(nextOpts);
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
    if (filled.some((it) => (Number(it.quantity) || 0) <= 0)) {
      Swal.fire({
        icon: "warning",
        title: "Every item needs a quantity greater than 0",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    // Setiap produk WAJIB punya supplier sebelum PO disimpan.
    const missingSupplier = filled.filter((it) => !it.supplier_id);
    if (missingSupplier.length > 0) {
      const names = missingSupplier
        .map((it, i) => it.product_label || `Item ${i + 1}`)
        .join(", ");
      Swal.fire({
        icon: "warning",
        title: "Supplier belum dipilih",
        text: `Produk berikut belum memiliki supplier: ${names}`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { date, expected_date, reference, description, status } = formData;
      const payload: PurchaseOrderPayload = {
        date,
        expected_date: expected_date || undefined,
        reference: reference.trim() || undefined,
        description: description.trim() || undefined,
        status,
        pr_ids: selectedPrs.map((o) => o.value),
        items: filled.map(formItemToPayload),
      };

      const result = await apiPut<SingleResponse<PurchaseOrderApiDaum>>(
        `/purchase-order/${initialData._id}`,
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Purchase Order
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            {initialData.order_no}
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
          {/* HEADER FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <label className={labelCls}>Expected Date</label>
              <input
                type="date"
                name="expected_date"
                value={formData.expected_date}
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
                placeholder="e.g. PO-001"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-3">
              <label className={labelCls}>
                Source Purchase Requests (optional)
              </label>
              <PurchaseRequestMultiSelect
                instanceId="po-pr-select-update"
                placeholder="Cari PR untuk mengisi item otomatis…"
                value={selectedPrs}
                onChange={handlePrChange}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Melepas PR akan menghapus item terkait secara otomatis.
              </p>
            </div>

            <div className="group md:col-span-3">
              <label className={labelCls}>Description / Memo</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this order for?"
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
              <table className="w-full text-left min-w-[880px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[24%]">Product</th>
                    <th className="py-2.5 px-3 font-bold w-[9%]">UOM</th>
                    <th className="py-2.5 px-3 font-bold w-[21%]">Supplier</th>
                    <th className="py-2.5 px-3 font-bold w-[12%] text-right">
                      Qty
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[16%] text-right">
                      Purchase Price
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[12%] text-right">
                      Subtotal
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[6%]" />
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500"
                      >
                        Belum ada item. Pilih PR di atas atau klik &quot;Add
                        item&quot; untuk menambah manual.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      // Harga efektif = new_price (hasil edit) bila ada, kalau
                      // tidak pakai price asal.
                      const unitPrice = Number(item.new_price ?? item.price) || 0;
                      const subtotal = (Number(item.quantity) || 0) * unitPrice;
                      const fromPr = (item.source_item_ids?.length ?? 0) > 0;
                      return (
                        <tr
                          key={index}
                          className="border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-2 px-3 align-top">
                            {fromPr ? (
                              <div className={readOnlyCls}>
                                {item.product_label || "—"}
                              </div>
                            ) : (
                              <ProductAsyncSelect
                                instanceId={`po-item-product-upd-${index}`}
                                value={item.product_id}
                                label={item.product_label}
                                onPick={(opt) => handlePickProduct(index, opt)}
                              />
                            )}
                            {fromPr && (
                              <span className="mt-1 inline-block text-[10px] font-medium text-indigo-500 dark:text-indigo-400">
                                from PR
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 align-top">
                            <div className={readOnlyCls}>
                              {item.uom_label || "—"}
                            </div>
                          </td>
                          <td className="py-2 px-3 align-top">
                            <SupplierAsyncSelect
                              instanceId={`po-item-supplier-upd-${index}`}
                              value={item.supplier_id}
                              label={item.supplier_label}
                              product={item.product_label}
                              isDisabled={!item.product_id}
                              onPick={(opt) =>
                                patchItem(index, {
                                  supplier_id: opt?.value ?? null,
                                  supplier_label: opt?.label ?? "",
                                })
                              }
                            />
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
                          <td className="py-2 px-3 align-top">
                            <CurrencyInput
                              value={item.new_price ?? item.price}
                              placeholder="0"
                              aria-label={`Purchase price item ${index + 1}`}
                              onChange={(v) =>
                                patchItem(index, { new_price: v })
                              }
                              className={`${inputCls} text-right`}
                            />
                          </td>
                          <td className="py-2 px-3 align-top text-right font-mono text-zinc-700 dark:text-zinc-300">
                            {formatAmount(subtotal)}
                          </td>
                          <td className="py-2 px-3 align-top text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              title="Remove item"
                              className="h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 font-bold text-sm">
                    <td
                      className="py-3 px-3 text-right text-zinc-500"
                      colSpan={5}
                    >
                      Total
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-800 dark:text-zinc-100 font-mono">
                      {formatAmount(total)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
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
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}

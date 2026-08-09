"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import { ImageRef, ListResponse, SingleResponse } from "@/types/api";
import {
  FormDataGoodReceiptProps,
  GoodReceiptApiDaum,
  GoodReceiptPayload,
  GR_STATUS_LABEL,
  WarehouseMode,
  deriveGrStatus,
} from "@/types/goodReceipt";
import {
  PurchaseItemForm,
  apiItemToForm,
  formItemToPayload,
  refId,
} from "@/types/purchaseItem";
import {
  Option,
  PurchaseOrderOption,
  WarehouseSource,
  warehouseOptionsFrom,
  fetchPurchaseOrderOptionsByIds,
  selectStyles,
  inputCls,
  readOnlyCls,
  labelCls,
} from "@/utils/procurement";
import PurchaseOrderMultiSelect from "@/components/atoms/shared/PurchaseOrderMultiSelect";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import MultiImageUpload from "@/components/atoms/shared/MultiImageUpload";
import { formatAmount, STATUS_BADGE } from "@/utils/utils";

interface DataProps {
  isOpen: boolean;
  initialData: GoodReceiptApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

const MODE_OPTIONS: Option[] = [
  { value: WarehouseMode.SINGLE, label: "Satu gudang (semua item)" },
  {
    value: WarehouseMode.MULTIPLE,
    label: "Per item (pilih gudang tiap baris)",
  },
];

export default function UpdateGoodReceiptModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [warehouses, setWarehouses] = useState<WarehouseSource[]>([]);

  const [formData, setFormData] = useState<FormDataGoodReceiptProps>(() => ({
    date: initialData.date?.slice(0, 10) ?? "",
    received_date: initialData.received_date?.slice(0, 10) ?? "",
    reference: initialData.reference ?? "",
    description: initialData.description ?? "",
  }));
  // PO terpilih. Seed awal dari po_ids (label order_no bila di-populate);
  // data.items diisi belakangan via fetch by id agar rebuild item tetap benar.
  const [selectedPos, setSelectedPos] = useState<PurchaseOrderOption[]>(() =>
    (initialData.po_ids ?? [])
      .map((r) => {
        const id = refId(r);
        if (!id) return null;
        const label =
          r && typeof r === "object" && "order_no" in r
            ? String((r as { order_no?: string }).order_no ?? id)
            : id;
        return {
          value: id,
          label,
          data: {
            _id: id,
            order_no: label,
            items: [],
          } as unknown as PurchaseOrderOption["data"],
        };
      })
      .filter((o): o is PurchaseOrderOption => o !== null),
  );
  const [warehouseMode, setWarehouseMode] = useState<WarehouseMode>(
    (initialData.warehouse_mode as WarehouseMode) ?? WarehouseMode.SINGLE,
  );
  const [warehouseId, setWarehouseId] = useState<string | null>(
    refId(initialData.warehouse_id),
  );
  const [items, setItems] = useState<PurchaseItemForm[]>(() =>
    (initialData.items ?? []).map((it) => {
      const form = apiItemToForm(it);
      // Reuse detail yang sama (shared doc) saat update.
      form.source_item_ids = it._id ? [String(it._id)] : [];
      return form;
    }),
  );
  const [receivedProofs, setReceivedProofs] = useState<ImageRef[]>(() =>
    (initialData.received_proof_id ?? []).map((img) => ({
      _id: img._id,
      path: img.path,
    })),
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

  useEffect(() => {
    (async () => {
      try {
        const whRes = await apiGet<ListResponse<WarehouseSource>>(
          "/warehouse",
          { limit: 1000 },
          false,
        );
        setWarehouses(whRes.data ?? []);
      } catch {
        setWarehouses([]);
      }
    })();
  }, []);

  // Lengkapi data.items untuk PO yang sudah terpilih (hanya PO terkait, sedikit)
  // supaya rebuild item saat pilihan PO diubah tetap benar.
  useEffect(() => {
    const ids = (initialData.po_ids ?? [])
      .map((r) => refId(r))
      .filter((v): v is string => !!v);
    if (ids.length < 1) return;
    let alive = true;
    fetchPurchaseOrderOptionsByIds(ids).then((opts) => {
      if (!alive || opts.length < 1) return;
      const byId = new Map(opts.map((o) => [o.value, o]));
      setSelectedPos((prev) => prev.map((o) => byId.get(o.value) ?? o));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const warehouseOptions = useMemo(
    () => warehouseOptionsFrom(warehouses),
    [warehouses],
  );

  const poIds = selectedPos.map((o) => o.value);

  const handlePoChange = (nextOpts: PurchaseOrderOption[]) => {
    setItems((prev) => {
      const prevBySrc = new Map<string, PurchaseItemForm>();
      prev.forEach((it) =>
        (it.source_item_ids ?? []).forEach((sid) => prevBySrc.set(sid, it)),
      );
      const next: PurchaseItemForm[] = [];
      for (const opt of nextOpts) {
        for (const raw of opt.data.items ?? []) {
          const srcId = raw._id ? String(raw._id) : "";
          const form = apiItemToForm(raw);
          form.source_item_ids = srcId ? [srcId] : [];
          const prevMatch = srcId ? prevBySrc.get(srcId) : undefined;
          form.received_qty = prevMatch?.received_qty ?? 0;
          form.warehouse_id = prevMatch?.warehouse_id ?? null;
          next.push(form);
        }
      }
      return next;
    });
    setSelectedPos(nextOpts);
  };

  const patchItem = (index: number, patch: Partial<PurchaseItemForm>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  const [totalQty, totalQtyReceived] = [
    useMemo(
      () => items.reduce((a, it) => a + (Number(it.quantity) || 0), 0),
      [items],
    ),
    useMemo(
      () => items.reduce((a, it) => a + (Number(it.received_qty) || 0), 0),
      [items],
    ),
  ];

  const derivedStatus = useMemo(() => deriveGrStatus(items), [items]);

  const handleSubmit = async () => {
    if (!formData.date) {
      Swal.fire({
        icon: "warning",
        title: "Date is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (poIds.length < 1) {
      Swal.fire({
        icon: "warning",
        title: "At least 1 purchase order is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (warehouseMode === WarehouseMode.SINGLE && !warehouseId) {
      Swal.fire({
        icon: "warning",
        title: "Warehouse is required for single-warehouse mode",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (
      warehouseMode === WarehouseMode.MULTIPLE &&
      items.some((it) => (Number(it.received_qty) || 0) > 0 && !it.warehouse_id)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Every received item needs a warehouse",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { date, received_date, reference, description } = formData;
      const payload: GoodReceiptPayload = {
        date,
        received_date: received_date || undefined,
        reference: reference.trim() || undefined,
        description: description.trim() || undefined,
        po_ids: poIds,
        warehouse_mode: warehouseMode,
        warehouse_id:
          warehouseMode === WarehouseMode.SINGLE ? warehouseId : null,
        received_proof_id: receivedProofs.map((p) => p._id),
        items: items.map(formItemToPayload),
      };

      const result = await apiPut<SingleResponse<GoodReceiptApiDaum>>(
        `/good-receipt/${initialData._id}`,
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

  const selectedMode =
    MODE_OPTIONS.find((o) => o.value === warehouseMode) ?? MODE_OPTIONS[0];
  const selectedWarehouse =
    warehouseOptions.find((o) => o.value === warehouseId) ?? null;
  const isMulti = warehouseMode === WarehouseMode.MULTIPLE;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Update Good Receipt
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              {initialData.receipt_no}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGE[derivedStatus] ?? ""}`}
          >
            {GR_STATUS_LABEL[derivedStatus]}
          </span>
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
            <div className="group md:col-span-3">
              <label className={labelCls}>
                Purchase Orders<span className="text-red-500">*</span>
              </label>
              <PurchaseOrderMultiSelect
                instanceId="gr-po-select-update"
                value={selectedPos}
                onChange={handlePoChange}
              />
            </div>

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
              <label className={labelCls}>Received Date</label>
              <input
                type="date"
                name="received_date"
                value={formData.received_date}
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
                placeholder="e.g. GR-001"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Warehouse Mode</label>
              <Select
                instanceId="gr-mode-update"
                classNamePrefix="rs"
                options={MODE_OPTIONS}
                value={selectedMode}
                onChange={(opt) =>
                  setWarehouseMode(
                    (opt?.value as WarehouseMode) ?? WarehouseMode.SINGLE,
                  )
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            {!isMulti && (
              <div className="group">
                <label className={labelCls}>
                  Warehouse<span className="text-red-500">*</span>
                </label>
                <Select
                  instanceId="gr-warehouse-update"
                  classNamePrefix="rs"
                  placeholder="Pilih gudang…"
                  options={warehouseOptions}
                  value={selectedWarehouse}
                  onChange={(opt) => setWarehouseId(opt?.value ?? null)}
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={selectStyles}
                />
              </div>
            )}

            <div className="group md:col-span-3">
              <label className={labelCls}>Description / Memo</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Catatan penerimaan"
                className={inputCls}
              />
            </div>
          </div>

          {/* ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Received Items
              </h3>
              <span className="text-[11px] text-zinc-400">
                Item mengikuti PO terpilih &amp; tidak bisa dihapus.
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left min-w-[820px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[35%]">Product</th>
                    <th className="py-2.5 px-3 font-bold w-[15%]">UOM</th>
                    <th className="py-2.5 px-3 font-bold w-[20%] text-right">
                      Ordered
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[30%] text-right">
                      Received
                    </th>
                    {isMulti && (
                      <th className="py-2.5 px-3 font-bold w-[25%]">
                        Warehouse
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isMulti ? 5 : 4}
                        className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500"
                      >
                        Pilih Purchase Order di atas untuk memuat item.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const selectedItemWh =
                        warehouseOptions.find(
                          (o) => o.value === item.warehouse_id,
                        ) ?? null;

                      return (
                        <tr
                          key={index}
                          className="border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-2 px-3 align-top text-sm text-zinc-800 dark:text-zinc-200">
                            {item.product_label || "—"}
                          </td>
                          <td className="py-2 px-3 align-top">
                            <div className={readOnlyCls}>
                              {item.uom_label || "—"}
                            </div>
                          </td>
                          <td className="py-2 px-3 align-top text-right font-mono text-zinc-600 dark:text-zinc-400">
                            {formatAmount(item.quantity)}
                          </td>
                          <td className="py-2 px-3 align-top">
                            <CurrencyInput
                              value={item.received_qty}
                              placeholder="0"
                              max={item.quantity}
                              aria-label={`Received qty item ${index + 1}`}
                              onChange={(v) =>
                                patchItem(index, { received_qty: v })
                              }
                              className={`${inputCls} text-right`}
                            />
                          </td>
                          {isMulti && (
                            <td className="py-2 px-3 align-top">
                              <Select
                                instanceId={`gr-item-wh-update-${index}`}
                                classNamePrefix="rs"
                                placeholder="Gudang…"
                                options={warehouseOptions}
                                value={selectedItemWh}
                                onChange={(opt) =>
                                  patchItem(index, {
                                    warehouse_id: opt?.value ?? null,
                                  })
                                }
                                menuPortalTarget={
                                  typeof document !== "undefined"
                                    ? document.body
                                    : null
                                }
                                styles={selectStyles}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 font-bold text-sm">
                    <td
                      className="py-3 px-3 text-right text-zinc-500"
                      colSpan={isMulti ? 3 : 3}
                    >
                      Total Received
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-800 dark:text-zinc-100 font-mono">
                      {formatAmount(totalQtyReceived)}/{formatAmount(totalQty)}
                    </td>
                    {isMulti && <td />}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* RECEIVED PROOF (opsional) */}
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-3">
              Received Proof
            </h3>
            <MultiImageUpload
              value={receivedProofs}
              onChange={setReceivedProofs}
              label="Bukti Penerimaan"
            />
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

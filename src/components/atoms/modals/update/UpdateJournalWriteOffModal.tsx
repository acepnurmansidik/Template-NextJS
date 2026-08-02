"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import {
  formatAmount,
  JournalWriteOffApiDaum,
  JournalWriteOffPayload,
  WriteOffLineForm,
  WriteOffSourceType,
  WriteOffStatus,
  WriteOffType,
  WRITE_OFF_SOURCE_LABEL,
  WRITE_OFF_SOURCE_PATH,
  WRITE_OFF_TYPE_LABEL,
  sumLines,
  FormDataJournalWriteOffProps,
} from "@/types/journalWriteOff";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

type Option = { value: string; label: string };

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: JournalWriteOffApiDaum;
}

const STATUS_OPTIONS: Option[] = [
  { value: WriteOffStatus.DRAFT, label: "Draft" },
  { value: WriteOffStatus.POSTED, label: "Posted" },
];
const TYPE_OPTIONS: Option[] = Object.values(WriteOffType).map((t) => ({
  value: t,
  label: WRITE_OFF_TYPE_LABEL[t],
}));
const SOURCE_TYPE_OPTIONS: Option[] = Object.values(WriteOffSourceType).map(
  (t) => ({ value: t, label: WRITE_OFF_SOURCE_LABEL[t] }),
);

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const emptyLine: WriteOffLineForm = {
  account_id: "",
  description: "",
  debit: 0,
  credit: 0,
};

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 disabled:opacity-60";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

// Picker dokumen sumber (JE/AR/AP) — fetch list sesuai tipe sumber.
function SourceDocSelect({
  sourceType,
  sourceId,
  setSourceId,
  disabled,
}: {
  sourceType: WriteOffSourceType;
  sourceId: string;
  setSourceId: (v: string) => void;
  disabled?: boolean;
}) {
  const [items, setItems] = useState<{ _id: string; entry_no: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const path = WRITE_OFF_SOURCE_PATH[sourceType];

  useEffect(() => {
    if (!path) {
      setItems([]);
      return;
    }
    (async () => {
      try {
        setIsLoading(true);
        const result = await apiGet<{
          data?: { _id: string; entry_no: string }[];
        }>(path, { page: 1, limit: 1000, search: "" }, false);
        setItems(result.data ?? []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [path]);

  const options: Option[] = useMemo(
    () => items.map((it) => ({ value: it._id, label: it.entry_no })),
    [items],
  );
  const selected = options.find((o) => o.value === sourceId) ?? null;

  return (
    <Select
      instanceId="wo-source-doc-update"
      classNamePrefix="rs"
      isClearable
      isDisabled={disabled}
      options={options}
      value={selected}
      isLoading={isLoading}
      onChange={(opt) => setSourceId((opt as Option | null)?.value ?? "")}
      placeholder={isLoading ? "Loading..." : "Pilih dokumen sumber..."}
      noOptionsMessage={() => "Tidak ada dokumen"}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

export default function UpdateJournalWriteOffModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  const isPosted = initialData.status === WriteOffStatus.POSTED;

  // State terpisah — daftar baris debit/credit (dinamis) & daftar akun COA
  // yang di-fetch untuk dropdown, tidak bisa jadi field scalar formData.
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [formData, setFormData] = useState<FormDataJournalWriteOffProps>(
    () => ({
      date: initialData.date.slice(0, 10),
      write_off_type: initialData.write_off_type ?? WriteOffType.OTHER,
      description: initialData.description ?? "",
      reference: initialData.reference ?? "",
      status: initialData.status,
      source_type:
        (initialData.source_type as WriteOffSourceType) ??
        WriteOffSourceType.NONE,
      source_id: initialData.source_id ?? "",
    }),
  );
  const [lines, setLines] = useState<WriteOffLineForm[]>(
    initialData.lines.map((l) => ({
      account_id: l.account_id,
      description: l.description ?? "",
      debit: l.debit,
      credit: l.credit,
    })),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataJournalWriteOffProps]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await apiGet<ListResponse<ChartOfAccountApiDaum>>(
          "/chart-of-account",
          {},
          false,
        );
        setAccounts(result.data ?? []);
      } catch {
        setAccounts([]);
      }
    })();
  }, []);

  const accountOptions: Option[] = useMemo(
    () =>
      accounts
        .filter((a) => !a.is_header)
        .map((a) => ({ value: a._id, label: `${a.code} — ${a.name}` })),
    [accounts],
  );

  const { totalDebit, totalCredit } = sumLines(lines);
  const balanced = totalDebit === totalCredit && totalDebit > 0;
  const diff = Math.round((totalDebit - totalCredit) * 100) / 100;

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }]);
  const removeLine = (index: number) =>
    setLines((prev) => prev.filter((_, i) => i !== index));
  const patchLine = (index: number, patch: Partial<WriteOffLineForm>) =>
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );

  const selectedStatus =
    STATUS_OPTIONS.find((o) => o.value === formData.status) ??
    STATUS_OPTIONS[0];
  const selectedType =
    TYPE_OPTIONS.find((o) => o.value === formData.write_off_type) ??
    TYPE_OPTIONS[0];
  const selectedSourceType =
    SOURCE_TYPE_OPTIONS.find((o) => o.value === formData.source_type) ??
    SOURCE_TYPE_OPTIONS[0];

  const handleSubmit = async () => {
    const {
      date,
      write_off_type: writeOffType,
      description,
      reference,
      status,
      source_type: sourceType,
      source_id: sourceId,
    } = formData;
    const filled = lines.filter(
      (l) => l.account_id || l.debit > 0 || l.credit > 0,
    );
    if (filled.length < 2) {
      Swal.fire({
        icon: "warning",
        title: "At least 2 lines required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (filled.some((l) => !l.account_id)) {
      Swal.fire({
        icon: "warning",
        title: "Every line needs an account",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    const { totalDebit: td, totalCredit: tc } = sumLines(filled);
    if (td !== tc || td === 0) {
      Swal.fire({
        icon: "warning",
        title: "Write off is not balanced",
        text: `Total debit (${td}) must equal total credit (${tc}).`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: JournalWriteOffPayload = {
        date,
        write_off_type: writeOffType,
        description: description.trim(),
        reference: reference.trim(),
        status,
        source_type: sourceType,
        source_id: sourceId || undefined,
        lines: filled.map((l) => ({
          account_id: l.account_id,
          description: l.description.trim(),
          debit: l.debit,
          credit: l.credit,
        })),
      };

      const result = await apiPut<SingleResponse<JournalWriteOffApiDaum>>(
        `/journal-write-off/${initialData._id}`,
        payload,
        false,
        false,
      );

      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text:
            result.message || "Your write off has been updated successfully.",
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Journal Write Off
          </h2>
          <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {initialData.entry_no}
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
          {isPosted && (
            <div className="px-4 py-3 rounded-lg text-sm border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
              This write off is <b>POSTED</b> and locked. Its content cannot be
              edited.
            </div>
          )}

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
                disabled={isPosted}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Write Off Type</label>
              <Select
                instanceId="wo-type-update"
                classNamePrefix="rs"
                isDisabled={isPosted}
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    write_off_type:
                      (opt?.value as WriteOffType) ?? WriteOffType.OTHER,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Status</label>
              <Select
                instanceId="wo-status-update"
                classNamePrefix="rs"
                options={STATUS_OPTIONS}
                value={selectedStatus}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    status:
                      (opt?.value as WriteOffStatus) ?? WriteOffStatus.DRAFT,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Source Type</label>
              <Select
                instanceId="wo-source-type-update"
                classNamePrefix="rs"
                isDisabled={isPosted}
                options={SOURCE_TYPE_OPTIONS}
                value={selectedSourceType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    source_type:
                      (opt?.value as WriteOffSourceType) ??
                      WriteOffSourceType.NONE,
                    source_id: "",
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Source Document</label>
              {formData.source_type === WriteOffSourceType.NONE ? (
                <input disabled value="—" className={inputCls} />
              ) : (
                <SourceDocSelect
                  sourceType={formData.source_type}
                  sourceId={formData.source_id}
                  setSourceId={(v) =>
                    setFormData((prev) => ({ ...prev, source_id: v }))
                  }
                  disabled={isPosted}
                />
              )}
            </div>

            <div className="group">
              <label className={labelCls}>Reference</label>
              <input
                name="reference"
                value={formData.reference}
                disabled={isPosted}
                onChange={handleChange}
                placeholder="e.g. AR-202607-0001"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Description / Reason</label>
              <input
                name="description"
                value={formData.description}
                disabled={isPosted}
                onChange={handleChange}
                placeholder="Reason for the write off"
                className={inputCls}
              />
            </div>
          </div>

          {/* LINES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Write Off Lines
              </h3>
              {!isPosted && (
                <button
                  type="button"
                  onClick={addLine}
                  className="h-8 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-3 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <FiPlus size={13} />
                  Add line
                </button>
              )}
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left min-w-[720px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[36%]">Account</th>
                    <th className="py-2.5 px-3 font-bold w-[28%]">
                      Description
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[15%] text-right">
                      Debit
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[15%] text-right">
                      Credit
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[6%]" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => {
                    const selectedAccount =
                      accountOptions.find((o) => o.value === line.account_id) ??
                      null;
                    return (
                      <tr
                        key={index}
                        className="border-t border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-2 px-3 align-top">
                          <Select
                            instanceId={`wo-line-account-update-${index}`}
                            classNamePrefix="rs"
                            isDisabled={isPosted}
                            placeholder="Select account..."
                            options={accountOptions}
                            value={selectedAccount}
                            onChange={(opt) =>
                              patchLine(index, { account_id: opt?.value ?? "" })
                            }
                            menuPortalTarget={
                              typeof document !== "undefined"
                                ? document.body
                                : null
                            }
                            styles={selectStyles}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <input
                            value={line.description}
                            disabled={isPosted}
                            onChange={(e) =>
                              patchLine(index, { description: e.target.value })
                            }
                            placeholder="(optional)"
                            className={inputCls}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={line.debit}
                            disabled={isPosted}
                            placeholder="0"
                            aria-label={`Debit line ${index + 1}`}
                            onChange={(v) =>
                              patchLine(index, {
                                debit: v,
                                ...(v > 0 ? { credit: 0 } : {}),
                              })
                            }
                            className={`${inputCls} text-right`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={line.credit}
                            disabled={isPosted}
                            placeholder="0"
                            aria-label={`Credit line ${index + 1}`}
                            onChange={(v) =>
                              patchLine(index, {
                                credit: v,
                                ...(v > 0 ? { debit: 0 } : {}),
                              })
                            }
                            className={`${inputCls} text-right`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top text-center">
                          {!isPosted && (
                            <button
                              type="button"
                              onClick={() => removeLine(index)}
                              disabled={lines.length <= 2}
                              title={
                                lines.length <= 2
                                  ? "A write off needs at least 2 lines"
                                  : "Remove line"
                              }
                              className="h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 font-bold text-sm">
                    <td
                      className="py-3 px-3 text-right text-zinc-500"
                      colSpan={2}
                    >
                      Total
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-800 dark:text-zinc-100 font-mono">
                      {formatAmount(totalDebit)}
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-800 dark:text-zinc-100 font-mono">
                      {formatAmount(totalCredit)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* BALANCE INDICATOR */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              {balanced ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
                  ● Balanced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700">
                  ● Not balanced
                  {diff !== 0 && (
                    <span className="font-mono font-normal">
                      (diff {formatAmount(Math.abs(diff))})
                    </span>
                  )}
                </span>
              )}
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
        {!isPosted && (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed italic" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        )}
      </div>
    </div>
  );
}

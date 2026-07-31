"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import {
  formatAmount,
  JournalEntryApiDaum,
  JournalEntryPayload,
  JournalLineForm,
  JournalStatus,
  sumLines,
} from "@/types/journalEntry";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: JournalEntryApiDaum;
}

type Option = { value: string; label: string };

const STATUS_OPTIONS: Option[] = [
  { value: JournalStatus.DRAFT, label: "Draft" },
  { value: JournalStatus.POSTED, label: "Posted" },
];

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

export default function UpdateJournalEntryModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  // Entry POSTED terkunci — seluruh field dinonaktifkan.
  const disabled = initialData.status === JournalStatus.POSTED;

  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [date, setDate] = useState(initialData.date.slice(0, 10));
  const [description, setDescription] = useState(initialData.description ?? "");
  const [reference, setReference] = useState(initialData.reference ?? "");
  const [status, setStatus] = useState<JournalStatus>(initialData.status);
  const [lines, setLines] = useState<JournalLineForm[]>(
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

  const addLine = () =>
    setLines((prev) => [
      ...prev,
      { account_id: "", description: "", debit: 0, credit: 0 },
    ]);
  const removeLine = (index: number) =>
    setLines((prev) => prev.filter((_, i) => i !== index));
  const patchLine = (index: number, patch: Partial<JournalLineForm>) =>
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );

  const selectedStatus =
    STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];

  const handleSubmit = async () => {
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
    const totals = sumLines(filled);
    if (totals.totalDebit !== totals.totalCredit || totals.totalDebit === 0) {
      Swal.fire({
        icon: "warning",
        title: "Journal is not balanced",
        text: `Total debit (${totals.totalDebit}) must equal total credit (${totals.totalCredit}).`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: JournalEntryPayload = {
        date,
        description: description.trim(),
        reference: reference.trim(),
        status,
        lines: filled.map((l) => ({
          account_id: l.account_id,
          description: l.description.trim(),
          debit: l.debit,
          credit: l.credit,
        })),
      };

      const result = await apiPut<SingleResponse<JournalEntryApiDaum>>(
        `/journal-entry/${initialData._id}`,
        payload,
        false,
        false,
      );

      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Your journal has been updated successfully.",
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
            Update Journal Entry
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
          {disabled && (
            <div className="px-4 py-3 rounded-lg text-sm border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
              This entry is <b>POSTED</b> and locked. Its content cannot be
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
                value={date}
                disabled={disabled}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls} disabled:opacity-60`}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Reference</label>
              <input
                value={reference}
                disabled={disabled}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. INV-001"
                className={`${inputCls} disabled:opacity-60`}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Status</label>
              <Select
                instanceId="journal-status-update"
                classNamePrefix="rs"
                isDisabled={disabled}
                options={STATUS_OPTIONS}
                value={selectedStatus}
                onChange={(opt) =>
                  setStatus(
                    (opt?.value as JournalStatus) ?? JournalStatus.DRAFT,
                  )
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group md:col-span-3">
              <label className={labelCls}>Description / Memo</label>
              <textarea
                value={description}
                disabled={disabled}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What is this journal for?"
                className={`${inputCls} resize-none disabled:opacity-60`}
              />
            </div>
          </div>

          {/* LINES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Journal Lines
              </h3>
              {!disabled && (
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
                            instanceId={`journal-line-account-update-${index}`}
                            classNamePrefix="rs"
                            isDisabled={disabled}
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
                            disabled={disabled}
                            onChange={(e) =>
                              patchLine(index, { description: e.target.value })
                            }
                            placeholder="(optional)"
                            className={`${inputCls} disabled:opacity-60`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={line.debit}
                            disabled={disabled}
                            placeholder="0"
                            aria-label={`Debit line ${index + 1}`}
                            onChange={(v) =>
                              patchLine(index, {
                                debit: v,
                                ...(v > 0 ? { credit: 0 } : {}),
                              })
                            }
                            className={`${inputCls} text-right disabled:opacity-60`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={line.credit}
                            disabled={disabled}
                            placeholder="0"
                            aria-label={`Credit line ${index + 1}`}
                            onChange={(v) =>
                              patchLine(index, {
                                credit: v,
                                ...(v > 0 ? { debit: 0 } : {}),
                              })
                            }
                            className={`${inputCls} text-right disabled:opacity-60`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top text-center">
                          {!disabled && (
                            <button
                              type="button"
                              onClick={() => removeLine(index)}
                              disabled={lines.length <= 2}
                              title={
                                lines.length <= 2
                                  ? "A journal needs at least 2 lines"
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
        {!disabled && (
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

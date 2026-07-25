"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import {
  BodyChartOfAccountResponseApiDaum,
  ChartOfAccountApiDaum,
} from "@/types/chartOfAccount";
import {
  AR_AP_STATUS_LABEL,
  ArApApiDaum,
  ArApLineForm,
  ArApPayload,
  ArApStatus,
  formatAmount,
  SingleArApResponseApiDaum,
  sumAmount,
} from "@/types/arAp";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

type Option = { value: string; label: string };

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: ArApApiDaum;
}

const STATUS_OPTIONS: Option[] = [
  ArApStatus.DRAFT,
  ArApStatus.OPEN,
  ArApStatus.PARTIAL,
  ArApStatus.PAID,
].map((s) => ({ value: s, label: AR_AP_STATUS_LABEL[s] }));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const emptyLine: ArApLineForm = { account_id: "", description: "", amount: 0 };

export default function UpdateAccountReceivableModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [date, setDate] = useState(initialData.date.slice(0, 10));
  const [dueDate, setDueDate] = useState(
    initialData.due_date ? initialData.due_date.slice(0, 10) : "",
  );
  const [partyName, setPartyName] = useState(initialData.party_name ?? "");
  const [reference, setReference] = useState(initialData.reference ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [status, setStatus] = useState<ArApStatus>(initialData.status);
  const [paidAmount, setPaidAmount] = useState(initialData.paid_amount ?? 0);
  const [lines, setLines] = useState<ArApLineForm[]>(
    initialData.lines.map((l) => ({
      account_id: l.account_id,
      description: l.description ?? "",
      amount: l.amount,
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
        const result = await apiGet<BodyChartOfAccountResponseApiDaum>(
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

  const total = sumAmount(lines);
  const remaining = Math.round((total - (Number(paidAmount) || 0)) * 100) / 100;

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }]);
  const removeLine = (index: number) =>
    setLines((prev) => prev.filter((_, i) => i !== index));
  const patchLine = (index: number, patch: Partial<ArApLineForm>) =>
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );

  // Status WRITE_OFF (dari proses write-off) tetap ditampilkan walau tak bisa dipilih manual.
  const statusOptions =
    status === ArApStatus.WRITE_OFF
      ? [
          ...STATUS_OPTIONS,
          {
            value: ArApStatus.WRITE_OFF,
            label: AR_AP_STATUS_LABEL[ArApStatus.WRITE_OFF],
          },
        ]
      : STATUS_OPTIONS;
  const selectedStatus =
    statusOptions.find((o) => o.value === status) ?? statusOptions[0];

  const handleSubmit = async () => {
    const filled = lines.filter((l) => l.account_id || l.amount > 0);
    if (filled.length < 1) {
      Swal.fire({
        icon: "warning",
        title: "At least 1 line required",
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
    if (sumAmount(filled) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Total amount must be greater than 0",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ArApPayload = {
        date,
        due_date: dueDate || undefined,
        party_name: partyName.trim(),
        reference: reference.trim(),
        description: description.trim(),
        status,
        paid_amount: paidAmount,
        lines: filled.map((l) => ({
          account_id: l.account_id,
          description: l.description.trim(),
          amount: l.amount,
        })),
      };

      const result = await apiPut<SingleArApResponseApiDaum>(
        `/account-receivable/${initialData._id}`,
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Receivable
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
          {/* HEADER FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={
                  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                }
              />
            </div>

            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={
                  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                }
              />
            </div>

            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Status
              </label>
              <Select
                instanceId="ar-status-update"
                classNamePrefix="rs"
                options={statusOptions}
                value={selectedStatus}
                onChange={(opt) =>
                  setStatus((opt?.value as ArApStatus) ?? ArApStatus.DRAFT)
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Customer
              </label>
              <input
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="e.g. Customer name"
                className={
                  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                }
              />
            </div>

            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Reference
              </label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. SO-001"
                className={
                  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                }
              />
            </div>

            <div className="group">
              <label
                className={
                  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                }
              >
                Description / Memo
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this for?"
                className={
                  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                }
              />
            </div>
          </div>

          {/* LINES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Lines
              </h3>
              <button
                type="button"
                onClick={addLine}
                className="h-8 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-3 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FiPlus size={13} />
                Add line
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left min-w-[640px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[40%]">Account</th>
                    <th className="py-2.5 px-3 font-bold w-[35%]">
                      Description
                    </th>
                    <th className="py-2.5 px-3 font-bold w-[19%] text-right">
                      Amount
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
                            instanceId={`ar-line-account-update-${index}`}
                            classNamePrefix="rs"
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
                            onChange={(e) =>
                              patchLine(index, { description: e.target.value })
                            }
                            placeholder="(optional)"
                            className={
                              "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                            }
                          />
                        </td>
                        <td className="py-2 px-3 align-top">
                          <CurrencyInput
                            value={line.amount}
                            placeholder="0"
                            aria-label={`Amount line ${index + 1}`}
                            onChange={(v) => patchLine(index, { amount: v })}
                            className={`${"w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"} text-right`}
                          />
                        </td>
                        <td className="py-2 px-3 align-top text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            disabled={lines.length <= 1}
                            title={
                              lines.length <= 1
                                ? "At least 1 line is required"
                                : "Remove line"
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
                <tfoot>
                  <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 font-bold text-sm">
                    <td
                      className="py-3 px-3 text-right text-zinc-500"
                      colSpan={2}
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

            {/* PAYMENT SUMMARY */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  className={
                    "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                  }
                >
                  Paid Amount
                </label>
                <CurrencyInput
                  value={paidAmount}
                  placeholder="0"
                  aria-label="Paid amount"
                  onChange={(v) => setPaidAmount(v > total ? total : v)}
                  className={`${"w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"} text-right`}
                />
              </div>
              <div className="sm:col-span-2 flex items-end justify-end gap-6">
                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Remaining
                  </span>
                  <span
                    className={`text-xl font-black tabular-nums ${
                      remaining <= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    {formatAmount(remaining < 0 ? 0 : remaining)}
                  </span>
                </div>
              </div>
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

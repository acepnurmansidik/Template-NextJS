"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import {
  JournalEntryApiDaum,
  JournalEntryPayload,
  JournalLineForm,
  JournalStatus,
  sumLines,
} from "@/types/journalEntry";
import JournalEntryFormBody from "@/components/atoms/shared/JournalEntryFormBody";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: JournalEntryApiDaum;
}

export default function UpdateJournalEntryModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  const isPosted = initialData.status === JournalStatus.POSTED;

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

  const accountOptions = useMemo(
    () =>
      accounts
        .filter((a) => !a.is_header)
        .map((a) => ({ value: a._id, label: `${a.code} — ${a.name}` })),
    [accounts],
  );

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
    const { totalDebit, totalCredit } = sumLines(filled);
    if (totalDebit !== totalCredit || totalDebit === 0) {
      Swal.fire({
        icon: "warning",
        title: "Journal is not balanced",
        text: `Total debit (${totalDebit}) must equal total credit (${totalCredit}).`,
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
        {isPosted && (
          <div className="max-w-full px-5 mx-auto mb-4">
            <div className="px-4 py-3 rounded-lg text-sm border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
              This entry is <b>POSTED</b> and locked. Its content cannot be
              edited.
            </div>
          </div>
        )}
        <JournalEntryFormBody
          date={date}
          setDate={setDate}
          description={description}
          setDescription={setDescription}
          reference={reference}
          setReference={setReference}
          status={status}
          setStatus={setStatus}
          lines={lines}
          setLines={setLines}
          accountOptions={accountOptions}
          disabled={isPosted}
        />
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

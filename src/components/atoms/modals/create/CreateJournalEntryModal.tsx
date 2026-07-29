"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import {
  JournalEntryPayload,
  JournalLineForm,
  JournalStatus,
  sumLines,
  JournalEntryApiDaum,
} from "@/types/journalEntry";
import JournalEntryFormBody from "@/components/atoms/shared/JournalEntryFormBody";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initialLines: JournalLineForm[] = [
  { account_id: "", description: "", debit: 0, credit: 0 },
  { account_id: "", description: "", debit: 0, credit: 0 },
];

export default function CreateJournalEntryModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<JournalStatus>(JournalStatus.DRAFT);
  const [lines, setLines] = useState<JournalLineForm[]>(initialLines);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Ambil COA; hanya akun POSTABLE (bukan header) yang bisa dijurnal.
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
    if (!date) {
      Swal.fire({
        icon: "warning",
        title: "Date is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
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

      const result = await apiPost<SingleResponse<JournalEntryApiDaum>>(
        "/journal-entry",
        payload,
        false,
        false,
      );

      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Your journal has been saved successfully.",
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
          Create Journal Entry
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
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
        />
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

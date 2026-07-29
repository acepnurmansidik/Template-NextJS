"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import {
  ComponentFormulaApiDaum,
  ComponentFormulaForm,
  RateType,
  refId,
} from "@/types/componentFormula";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import NumberInput from "@/components/atoms/shared/NumberInput";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import AccountsSelect, {
  AccountOption,
} from "@/components/atoms/shared/AccountsSelect";

type Option = { value: string; label: string };

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: ComponentFormulaApiDaum;
}

const RATE_TYPE_OPTIONS: Option[] = [
  { value: RateType.FIXED, label: "Fixed" },
  { value: RateType.CALCULATED, label: "Calculated" },
  { value: RateType.EXTERNAL, label: "External (x)" },
];

// Rate berformat currency (grup ribuan gaya en-US, boleh negatif & desimal).
const rateInputProps = {
  allowNegative: true,
  maxDecimals: 6,
  groupSeparator: ",",
  decimalSeparator: ".",
} as const;

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateComponentFormulaModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  const [formData, setFormData] = useState<ComponentFormulaForm>({
    name: "",
    rate_type: RateType.FIXED,
    fixed_rate: 0,
    calculated_rate: 0,
    decimal_place: 2,
    accounts: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [availableAccounts, setAvailableAccounts] = useState<
    ChartOfAccountApiDaum[]
  >([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoadingAccounts(true);
      const result = await apiGet<ListResponse<ChartOfAccountApiDaum>>(
        "/chart-of-account",
        { page: 1, limit: 1000, search: "", is_header: false },
        false,
      );
      setAvailableAccounts(result.data ?? []);
    } catch {
      setAvailableAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  const accountOptions: AccountOption[] = useMemo(
    () =>
      availableAccounts.map((a) => ({
        value: a._id,
        label: `${a.code} — ${a.name}`,
      })),
    [availableAccounts],
  );

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
      setFormData({
        name: initialData.name ?? "",
        rate_type: initialData.rate_type ?? RateType.FIXED,
        fixed_rate: initialData.fixed_rate ?? 0,
        calculated_rate: initialData.calculated_rate ?? 0,
        decimal_place: initialData.decimal_place ?? 2,
        accounts: (initialData.accounts ?? []).map(refId).filter(Boolean),
      });
    }
  }, [isOpen, initialData, fetchAccounts]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isCalculated = formData.rate_type === RateType.CALCULATED;
  const isExternal = formData.rate_type === RateType.EXTERNAL;

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (
      !Number.isInteger(formData.decimal_place) ||
      formData.decimal_place < 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Decimal place tidak valid",
        text: "Gunakan bilangan bulat >= 0.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ComponentFormulaForm = {
        ...formData,
        name: formData.name.trim(),
      };

      const result = await apiPut<SingleResponse<ComponentFormulaApiDaum>>(
        `/component-formula/${initialData._id}`,
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
        text: serverMessage || "Failed to save data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  const selectedRateType =
    RATE_TYPE_OPTIONS.find((o) => o.value === formData.rate_type) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Component Formula
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
            {/* NAME */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Base Tax"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Slug otomatis dibuat backend dari nama.
              </p>
            </div>

            {/* RATE TYPE */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Rate Type<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="component-rate-type-update"
                classNamePrefix="rs"
                options={RATE_TYPE_OPTIONS}
                value={selectedRateType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    rate_type: (opt?.value as RateType) ?? RateType.FIXED,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            {/* RATE VALUE (nominal, tanpa currency) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                {isExternal
                  ? "Rate"
                  : isCalculated
                    ? "Calculated Rate"
                    : "Fixed Rate"}
              </label>
              <CurrencyInput
                value={
                  isCalculated || isExternal
                    ? formData.calculated_rate
                    : formData.fixed_rate
                }
                onChange={(v) =>
                  setFormData((prev) =>
                    isCalculated || isExternal
                      ? { ...prev, calculated_rate: v }
                      : { ...prev, fixed_rate: v },
                  )
                }
                {...rateInputProps}
                aria-label="Rate"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 text-right"
              />
              {isExternal && (
                <p className="mt-1 text-[11px] text-zinc-400">
                  Tipe EXTERNAL: nilai luar <b>x</b> &amp; operator penggabung
                  (mis. <b>x + rate</b>) ditentukan saat komponen ini dipakai di
                  Calculated Formula — bukan di sini.
                </p>
              )}
            </div>

            {/* DECIMAL PLACE */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Decimal Place
              </label>
              <NumberInput
                value={formData.decimal_place}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, decimal_place: v }))
                }
                integer
                aria-label="Decimal place"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Jumlah desimal pembulatan rate (bilangan bulat).
              </p>
            </div>

            {/* ACCOUNTS */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Accounts
              </label>
              <AccountsSelect
                instanceId="component-accounts-update"
                value={formData.accounts}
                onChange={(ids) =>
                  setFormData((prev) => ({ ...prev, accounts: ids }))
                }
                options={accountOptions}
                isLoading={isLoadingAccounts}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Akun (Chart of Account) yang terkait komponen ini.
              </p>
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
          {isLoading ? "Updating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import { ComponentFormulaApiDaum } from "@/types/componentFormula";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import {
  AccountAssignment,
  ACCOUNT_ASSIGNMENT_LABEL,
  CalcType,
  CalculatedFormulaForm,
  PopulatedComponent,
  CalculatedFormulaApiDaum,
  FormDataCalculatedFormulaProps,
} from "@/types/calculatedFormula";

import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import { evaluateExpression, ROUND_MODES } from "@/utils/formula";
import AccountsSelect, {
  AccountOption,
} from "@/components/atoms/shared/AccountsSelect";
import FormulaBuilder, {
  BuilderToken,
  builderToPayload,
  builderToCalcTokens,
} from "@/components/atoms/shared/FormulaBuilder";
import PerComponentBuilder, {
  ComponentDraft,
  componentDraftToPayload,
} from "@/components/atoms/shared/PerComponentBuilder";
import NumberInput from "@/components/atoms/shared/NumberInput";
import CalcTypeToggle from "@/components/atoms/shared/CalcTypeToggle";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const defaultValue: FormDataCalculatedFormulaProps = {
  name: "",
  calc_type: CalcType.SINGLE,
  decimal_place: 2,
  rounding: "round",
  accounts: [],
  account_assignment: AccountAssignment.FORMULA_COMPONENT,
};

export default function CreateCalculatedFormulaModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] =
    useState<FormDataCalculatedFormulaProps>(defaultValue);
  // State terpisah — susunan token ekspresi (SINGLE) & daftar komponen
  // (PER_COMPONENT) bersifat dinamis, bukan field scalar formData.
  const [tokens, setTokens] = useState<BuilderToken[]>([]);
  const [perComponents, setPerComponents] = useState<ComponentDraft[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [availableComponents, setAvailableComponents] = useState<
    PopulatedComponent[]
  >([]);
  const [isLoadingComponents, setIsLoadingComponents] =
    useState<boolean>(false);

  const [availableAccounts, setAvailableAccounts] = useState<
    ChartOfAccountApiDaum[]
  >([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);

  const fetchComponents = useCallback(async () => {
    try {
      setIsLoadingComponents(true);
      const result = await apiGet<ListResponse<ComponentFormulaApiDaum>>(
        "/component-formula",
        { page: 1, limit: 1000, search: "" },
        false,
      );
      setAvailableComponents((result.data ?? []) as PopulatedComponent[]);
    } catch {
      setAvailableComponents([]);
    } finally {
      setIsLoadingComponents(false);
    }
  }, []);

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
      fetchComponents();
      fetchAccounts();
    }
  }, [isOpen, fetchComponents, fetchAccounts]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Native input/select (name, rounding, account_assignment) → satu handler.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataCalculatedFormulaProps]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      name,
      calc_type: calcType,
      decimal_place: decimalPlace,
      rounding,
      accounts,
      account_assignment: accountAssignment,
    } = formData;
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!Number.isInteger(decimalPlace) || decimalPlace < 0) {
      Swal.fire({
        icon: "warning",
        title: "Decimal place tidak valid",
        text: "Gunakan bilangan bulat >= 0.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    let payload: CalculatedFormulaForm;

    if (calcType === CalcType.PER_COMPONENT) {
      // Validasi tiap komponen: nama wajib + ekspresi valid.
      if (perComponents.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Minimal 1 komponen",
          text: "Tambahkan setidaknya satu komponen perhitungan.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }
      for (let i = 0; i < perComponents.length; i++) {
        const c = perComponents[i];
        if (!c.name.trim()) {
          Swal.fire({
            icon: "warning",
            title: `Komponen #${i + 1} belum punya nama`,
            confirmButtonColor: "#2563eb",
          });
          return;
        }
        const evaln = evaluateExpression(
          builderToCalcTokens(c.tokens),
          c.decimalPlace,
          c.rounding,
        );
        if (!evaln.ok) {
          Swal.fire({
            icon: "warning",
            title: `Ekspresi komponen #${i + 1} belum valid`,
            text: evaln.error || "Periksa kembali susunan ekspresi.",
            confirmButtonColor: "#2563eb",
          });
          return;
        }
      }
      payload = {
        name: name.trim(),
        calc_type: CalcType.PER_COMPONENT,
        decimal_place: decimalPlace,
        rounding,
        accounts,
        account_assignment: accountAssignment,
        expression: [],
        components: perComponents.map(componentDraftToPayload),
      };
    } else {
      // SINGLE: validasi struktur ekspresi tunggal sebelum kirim.
      const evaluation = evaluateExpression(
        builderToCalcTokens(tokens),
        decimalPlace,
        rounding,
      );
      if (!evaluation.ok) {
        Swal.fire({
          icon: "warning",
          title: "Formula belum valid",
          text: evaluation.error || "Periksa kembali susunan ekspresi.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }
      payload = {
        name: name.trim(),
        calc_type: CalcType.SINGLE,
        decimal_place: decimalPlace,
        rounding,
        accounts,
        account_assignment: accountAssignment,
        expression: builderToPayload(tokens),
      };
    }

    setIsLoading(true);
    try {
      const result = await apiPost<SingleResponse<CalculatedFormulaApiDaum>>(
        "/calculated-formula",
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
        setFormData(defaultValue);
        setTokens([]);
        setPerComponents([]);
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
          Create Calculated Formula
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          <CalcTypeToggle
            value={formData.calc_type}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, calc_type: v }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Total Tax"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>

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
                Untuk hasil akhir (kurung punya dp sendiri).
              </p>
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Pembulatan Akhir
              </label>
              <select
                name="rounding"
                value={formData.rounding}
                onChange={handleChange}
                aria-label="Arah pembulatan hasil akhir"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 cursor-pointer"
              >
                {ROUND_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-zinc-400">
                Arah pembulatan hasil akhir.
              </p>
            </div>
          </div>

          {/* ACCOUNTS HASIL AKHIR (diposisikan di atas komponen) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="group md:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Accounts (hasil akhir)
              </label>
              <AccountsSelect
                instanceId="calc-final-accounts-create"
                value={formData.accounts}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, accounts: v }))
                }
                options={accountOptions}
                isLoading={isLoadingAccounts}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                {formData.calc_type === CalcType.PER_COMPONENT
                  ? "Akun untuk hasil akhir. Tiap komponen punya akun sendiri di bawah."
                  : "Akun untuk hasil akhir formula."}
              </p>
            </div>

            {/* JENIS ASSIGN AKUN */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Assign Akun Ke
              </label>
              <select
                name="account_assignment"
                value={formData.account_assignment}
                onChange={handleChange}
                aria-label="Jenis assign akun"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 cursor-pointer"
              >
                {Object.entries(ACCOUNT_ASSIGNMENT_LABEL).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
              <p className="mt-1 text-[11px] text-zinc-400">
                {formData.account_assignment ===
                AccountAssignment.COMPONENT_DETAIL
                  ? "Nilai di-assign ke akun tiap komponen detail (Chart of Account yang di-set di koleksi Component Formula)."
                  : "Nilai di-assign hanya ke akun yang di-set pada formula ini / komponennya."}
              </p>
            </div>
          </div>

          {formData.calc_type === CalcType.PER_COMPONENT ? (
            <PerComponentBuilder
              components={perComponents}
              onChange={setPerComponents}
              availableComponents={availableComponents}
              accountOptions={accountOptions}
              masterDecimalPlace={formData.decimal_place}
              masterRounding={formData.rounding}
              isLoadingComponents={isLoadingComponents}
              isLoadingAccounts={isLoadingAccounts}
            />
          ) : (
            <FormulaBuilder
              tokens={tokens}
              onChange={setTokens}
              availableComponents={availableComponents}
              decimalPlace={formData.decimal_place}
              rounding={formData.rounding}
              isLoadingComponents={isLoadingComponents}
            />
          )}
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
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

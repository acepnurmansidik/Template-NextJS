"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import {
  CalculatedFormulaForm,
  PopulatedComponent,
  SingleCalculatedFormulaResponseApiDaum,
} from "@/types/calculatedFormula";
import { BodyComponentFormulaResponseApiDaum } from "@/types/componentFormula";
import { evaluateExpression } from "@/utils/formula";
import FormulaBuilder, {
  BuilderToken,
  builderToPayload,
  builderToCalcTokens,
} from "@/components/atoms/shared/FormulaBuilder";
import NumberInput from "@/components/atoms/shared/NumberInput";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCalculatedFormulaModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [name, setName] = useState<string>("");
  const [decimalPlace, setDecimalPlace] = useState<number>(2);
  const [tokens, setTokens] = useState<BuilderToken[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [availableComponents, setAvailableComponents] = useState<
    PopulatedComponent[]
  >([]);
  const [isLoadingComponents, setIsLoadingComponents] =
    useState<boolean>(false);

  const fetchComponents = useCallback(async () => {
    try {
      setIsLoadingComponents(true);
      const result = await apiGet<BodyComponentFormulaResponseApiDaum>(
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

  useEffect(() => {
    if (isOpen) fetchComponents();
  }, [isOpen, fetchComponents]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
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
    // Validasi struktur ekspresi sebelum kirim.
    const evaluation = evaluateExpression(
      builderToCalcTokens(tokens),
      decimalPlace,
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

    setIsLoading(true);
    try {
      const payload: CalculatedFormulaForm = {
        name: name.trim(),
        decimal_place: decimalPlace,
        expression: builderToPayload(tokens),
      };

      const result = await apiPost<SingleCalculatedFormulaResponseApiDaum>(
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
        setName("");
        setDecimalPlace(2);
        setTokens([]);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Total Tax"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Decimal Place
              </label>
              <NumberInput
                value={decimalPlace}
                onChange={setDecimalPlace}
                integer
                aria-label="Decimal place"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Dipakai untuk hasil tiap kurung &amp; hasil akhir.
              </p>
            </div>
          </div>

          <FormulaBuilder
            tokens={tokens}
            onChange={setTokens}
            availableComponents={availableComponents}
            decimalPlace={decimalPlace}
            isLoadingComponents={isLoadingComponents}
          />
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

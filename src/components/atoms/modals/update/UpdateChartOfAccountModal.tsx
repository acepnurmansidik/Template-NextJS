"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPut } from "@/utils/api";
import {
  ACCOUNT_TYPE_LABEL,
  AccountType,
  ChartOfAccountApiDaum,
  ChartOfAccountPayload,
  FormDataChartOfAccountProps,
  localSegment,
  normalBalanceForType,
  selectableParents,
} from "@/types/chartOfAccount";

type Option = { value: string; label: string };

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: ChartOfAccountApiDaum;
}

const TYPE_OPTIONS: Option[] = Object.values(AccountType).map((t) => ({
  value: t,
  label: ACCOUNT_TYPE_LABEL[t],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateChartOfAccountModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  // State terpisah — accounts adalah opsi dropdown hasil fetch (bukan field
  // payload), plus flag UI.
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  // State kode menyimpan SEGMEN LOKAL saja (prefix induk terkunci di UI).
  const [formData, setFormData] = useState<FormDataChartOfAccountProps>(() => ({
    code: localSegment(initialData.code),
    name: initialData.name,
    type: initialData.type,
    is_header: initialData.is_header,
    parent_id: initialData.parent_id,
    description: initialData.description ?? "",
  }));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => {
      if (type === "checkbox") return { ...prev, [name]: checked };
      return { ...prev, [name]: value };
    });
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

  // Kecualikan diri sendiri & turunannya dari opsi induk (cegah siklus).
  const parentOptions: Option[] = useMemo(
    () =>
      selectableParents(accounts, initialData._id).map((a) => ({
        value: a._id,
        label: `${a.code} — ${a.name}`,
      })),
    [accounts, initialData._id],
  );

  const selectedParent =
    accounts.find((a) => a._id === formData.parent_id) ?? null;
  const effectiveType = selectedParent ? selectedParent.type : formData.type;
  const normalBalance = normalBalanceForType(effectiveType);

  // Kode induk otomatis menjadi prefix terkunci; user hanya edit segmen lokal.
  const codePrefix = selectedParent ? `${selectedParent.code}.` : "";
  const fullCodePreview = `${codePrefix}${formData.code || "…"}`;

  const handleSubmit = async () => {
    if (!formData.code.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Account code is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Account name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { code, name, is_header, parent_id, description, type } = formData;
      const payload: ChartOfAccountPayload = {
        code: code.trim(),
        name: name.trim(),
        is_header,
        parent_id,
        description: description.trim(),
        ...(parent_id ? {} : { type }),
      };

      const result = await apiPut<SingleResponse<ChartOfAccountApiDaum>>(
        `/chart-of-account/${initialData._id}`,
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

  const selectedTypeOption =
    TYPE_OPTIONS.find((o) => o.value === effectiveType) ?? null;
  const selectedParentOption =
    parentOptions.find((o) => o.value === formData.parent_id) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Chart of Account
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
            {/* CODE */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Account Code<span className="text-red-500">*</span>
              </label>
              <div className="flex items-stretch w-full border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                {codePrefix && (
                  <span className="flex items-center px-2.5 bg-zinc-100 dark:bg-zinc-800 text-sm font-mono font-bold text-zinc-500 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-700 select-none">
                    {codePrefix}
                  </span>
                )}
                <input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.replace(/\./g, ""),
                    }))
                  }
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 p-2.5 text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                {codePrefix
                  ? "Kode induk terkunci sebagai prefix. Final: "
                  : "Kode akun root. Final: "}
                <span className="font-mono font-semibold text-zinc-500 dark:text-zinc-300">
                  {fullCodePreview}
                </span>
                {codePrefix && (
                  <> — mengubahnya ikut memperbarui kode seluruh sub-akun.</>
                )}
              </p>
            </div>

            {/* NAME */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Account Name<span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>

            {/* PARENT */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Parent Account
              </label>
              <Select
                instanceId="coa-parent-update"
                classNamePrefix="rs"
                isClearable
                placeholder="— Root account —"
                options={parentOptions}
                value={selectedParentOption}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    parent_id: opt?.value ?? null,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Memindahkan akun akan ikut memindahkan seluruh sub-akunnya.
              </p>
            </div>

            {/* TYPE (root only) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Type<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="coa-type-update"
                classNamePrefix="rs"
                isDisabled={!!formData.parent_id}
                options={TYPE_OPTIONS}
                value={selectedTypeOption}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: (opt?.value as AccountType) ?? AccountType.ASSET,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                {formData.parent_id
                  ? "Diturunkan otomatis dari induk."
                  : `Saldo normal: ${normalBalance}.`}
              </p>
            </div>

            {/* IS HEADER */}
            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_header"
                  checked={formData.is_header}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Header / group account
                </span>
              </label>
              <p className="mt-1 text-[11px] text-zinc-400">
                Header tidak bisa dimatikan selama masih memiliki sub-akun.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 resize-none"
              />
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

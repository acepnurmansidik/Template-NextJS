"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import {
  ACCOUNT_TYPE_LABEL,
  AccountType,
  BodyChartOfAccountResponseApiDaum,
  ChartOfAccountApiDaum,
  ChartOfAccountPayload,
  normalBalanceForType,
  selectableParents,
  SingleChartOfAccountResponseApiDaum,
} from "@/types/chartOfAccount";

type Option = { value: string; label: string };

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // Induk awal (mis. saat "tambah anak" dari node tertentu di pohon).
  defaultParentId?: string | null;
}

const TYPE_OPTIONS: Option[] = Object.values(AccountType).map((t) => ({
  value: t,
  label: ACCOUNT_TYPE_LABEL[t],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function CreateChartOfAccountModal({
  isOpen,
  onClose,
  onSuccess,
  defaultParentId = null,
}: DataProps) {
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>(AccountType.ASSET);
  const [isHeader, setIsHeader] = useState(false);
  const [parentId, setParentId] = useState<string | null>(defaultParentId);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Ambil daftar akun untuk opsi induk (hanya header yang boleh jadi induk).
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

  const parentOptions: Option[] = useMemo(
    () =>
      selectableParents(accounts).map((a) => ({
        value: a._id,
        label: `${a.code} — ${a.name}`,
      })),
    [accounts],
  );

  const selectedParent = accounts.find((a) => a._id === parentId) ?? null;
  // Anak mewarisi type induk; type hanya bisa dipilih untuk akun root.
  const effectiveType = selectedParent ? selectedParent.type : type;
  const normalBalance = normalBalanceForType(effectiveType);

  // Kode induk otomatis menjadi prefix terkunci (mis. "1000."). User hanya
  // mengetik segmen lokal; kode final = prefix + segmen.
  const codePrefix = selectedParent ? `${selectedParent.code}.` : "";
  const fullCodePreview = `${codePrefix}${code || "…"}`;

  const handleSubmit = async () => {
    if (!code.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Account code is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Account name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ChartOfAccountPayload = {
        code: code.trim(),
        name: name.trim(),
        is_header: isHeader,
        parent_id: parentId,
        description: description.trim(),
        // Type hanya relevan untuk akun root; anak mewarisi dari induk.
        ...(parentId ? {} : { type }),
      };

      const result = await apiPost<SingleChartOfAccountResponseApiDaum>(
        "/chart-of-account",
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

  const selectedTypeOption =
    TYPE_OPTIONS.find((o) => o.value === effectiveType) ?? null;
  const selectedParentOption =
    parentOptions.find((o) => o.value === parentId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Chart of Account
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
                  value={code}
                  // Titik dilarang pada segmen — prefix induk sudah menyertakannya.
                  onChange={(e) => setCode(e.target.value.replace(/\./g, ""))}
                  placeholder={codePrefix ? "e.g. 123" : "e.g. 1000"}
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 p-2.5 text-sm outline-none dark:text-zinc-100"
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                {codePrefix
                  ? "Kode induk otomatis jadi prefix (terkunci). Final: "
                  : "Kode akun root. Final: "}
                <span className="font-mono font-semibold text-zinc-500 dark:text-zinc-300">
                  {fullCodePreview}
                </span>
              </p>
            </div>

            {/* NAME */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Account Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cash & Bank"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>

            {/* PARENT */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Parent Account
              </label>
              <Select
                instanceId="coa-parent-create"
                classNamePrefix="rs"
                isClearable
                placeholder="— Root account —"
                options={parentOptions}
                value={selectedParentOption}
                onChange={(opt) => setParentId(opt?.value ?? null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Kosongkan untuk akun teratas (root). Hanya akun header yang bisa
                menjadi induk.
              </p>
            </div>

            {/* TYPE (root only) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Type<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="coa-type-create"
                classNamePrefix="rs"
                isDisabled={!!parentId}
                options={TYPE_OPTIONS}
                value={selectedTypeOption}
                onChange={(opt) =>
                  setType((opt?.value as AccountType) ?? AccountType.ASSET)
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                {parentId
                  ? "Diturunkan otomatis dari induk."
                  : `Saldo normal: ${normalBalance}.`}
              </p>
            </div>

            {/* IS HEADER */}
            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isHeader}
                  onChange={(e) => setIsHeader(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Header / group account
                </span>
              </label>
              <p className="mt-1 text-[11px] text-zinc-400">
                Akun header hanya untuk pengelompokan (tidak untuk posting) dan
                boleh memiliki sub-akun tak terbatas.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Optional note about this account"
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
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

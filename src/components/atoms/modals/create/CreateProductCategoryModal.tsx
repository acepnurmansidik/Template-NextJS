"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse, SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import {
  FormDataProductCategoryProps,
  ProductCategoryApiDaum,
  ProductCategoryPayload,
} from "@/types/productCategory";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type CoaOption = { value: string; label: string; name: string };
type LineForm = { title: string; account_id: string };

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

const defaultValue: FormDataProductCategoryProps = {
  name: "",
  prefix: "",
  is_active: true,
};

export default function CreateProductCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] =
    useState<FormDataProductCategoryProps>(defaultValue);
  // State terpisah: tabel line accounts (dinamis add/remove) & daftar COA fetched.
  const [lines, setLines] = useState<LineForm[]>([
    { title: "", account_id: "" },
  ]);
  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => {
      if (type === "checkbox") return { ...prev, [name]: checked };
      // Prefix selalu huruf besar (awalan kode produk).
      if (name === "prefix") return { ...prev, prefix: value.toUpperCase() };
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

  // Ambil COA (hanya akun POSTABLE / bukan header).
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

  const coaOptions: CoaOption[] = useMemo(
    () =>
      accounts
        .filter((a) => !a.is_header)
        .map((a) => ({
          value: a._id,
          label: `${a.code} — ${a.name}`,
          name: a.name,
        })),
    [accounts],
  );

  const addLine = () =>
    setLines((prev) => [...prev, { title: "", account_id: "" }]);
  const removeLine = (index: number) =>
    setLines((prev) => prev.filter((_, i) => i !== index));
  const patchLine = (index: number, patch: Partial<LineForm>) =>
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );

  // Pilih COA → set account_id + isi title otomatis dari nama COA (editable).
  const selectCoa = (index: number, opt: CoaOption | null) =>
    patchLine(index, {
      account_id: opt?.value ?? "",
      title: opt?.name ?? "",
    });

  const handleSubmit = async () => {
    const { name, prefix, is_active } = formData;

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Category name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!prefix.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Prefix is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: ProductCategoryPayload = {
        name: name.trim(),
        prefix: prefix.trim(),
        is_active,
        line_accounts: lines
          .filter((l) => l.account_id)
          .map((l) => ({ title: l.title.trim(), account_id: l.account_id })),
      };

      const result = await apiPost<SingleResponse<ProductCategoryApiDaum>>(
        "/product-category",
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Product Category
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
            <div className="group">
              <label className={labelCls}>
                Category Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                placeholder="e.g. Raw Material"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Prefix<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.prefix}
                name="prefix"
                onChange={handleChange}
                placeholder="e.g. RAW"
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Awalan kode produk. Otomatis huruf besar.
              </p>
            </div>

            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Active
                </span>
              </label>
            </div>
          </div>

          {/* LINE ACCOUNTS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  Line Accounts
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Pilih COA — judul (title) otomatis terisi nama COA, tetap bisa
                  diedit manual.
                </p>
              </div>
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
              <table className="w-full text-left min-w-[560px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr className="text-[11px] uppercase tracking-widest text-zinc-500">
                    <th className="py-2.5 px-3 font-bold w-[48%]">Account (COA)</th>
                    <th className="py-2.5 px-3 font-bold w-[42%]">Title</th>
                    <th className="py-2.5 px-3 font-bold w-[10%]" />
                  </tr>
                </thead>
                <tbody>
                  {lines.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-6 text-center text-xs text-zinc-400"
                      >
                        No line yet. Click “Add line”.
                      </td>
                    </tr>
                  ) : (
                    lines.map((line, index) => {
                      const selected =
                        coaOptions.find((o) => o.value === line.account_id) ??
                        null;
                      return (
                        <tr
                          key={index}
                          className="border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-2 px-3 align-top">
                            <Select
                              instanceId={`pc-coa-create-${index}`}
                              classNamePrefix="rs"
                              placeholder="Select account..."
                              options={coaOptions}
                              value={selected}
                              onChange={(opt) =>
                                selectCoa(index, opt as CoaOption | null)
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
                              value={line.title}
                              onChange={(e) =>
                                patchLine(index, { title: e.target.value })
                              }
                              placeholder="Title (dari nama COA)"
                              className={inputCls}
                            />
                          </td>
                          <td className="py-2 px-3 align-top text-center">
                            <button
                              type="button"
                              onClick={() => removeLine(index)}
                              title="Remove line"
                              className="h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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

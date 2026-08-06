"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiPut } from "@/utils/api";
import {
  BuildingApiDaum,
  BuildingPayload,
  BuildingType,
  BUILDING_TYPE_LABEL,
  FormDataBuildingProps,
} from "@/types/facility";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";

interface DataProps {
  isOpen: boolean;
  initialData: BuildingApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const TYPE_OPTIONS: Option[] = Object.values(BuildingType).map((t) => ({
  value: t,
  label: BUILDING_TYPE_LABEL[t],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateBuildingModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] = useState<FormDataBuildingProps>(() => ({
    branch_id:
      typeof initialData.branch_id === "object"
        ? initialData.branch_id._id
        : initialData.branch_id,
    name: initialData.name,
    building_type: initialData.building_type ?? BuildingType.OFFICE,
    total_floors: initialData.total_floors ?? 1,
    building_area_sqm: initialData.building_area_sqm ?? 0,
    land_area_sqm: initialData.land_area_sqm ?? 0,
    address: {
      street: initialData.address?.street ?? "",
      city: initialData.address?.city ?? "",
    },
    notes: initialData.notes ?? "",
    is_active: initialData.is_active,
  }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => {
      if (type === "checkbox") return { ...prev, [name]: checked };
      // Update address (street, city)
      if (["street", "city"].includes(name)) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        };
      }
      // Field top-level biasa (name, notes)
      return {
        ...prev,
        [name as keyof FormDataBuildingProps]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const {
      branch_id,
      name,
      building_type,
      total_floors,
      building_area_sqm,
      land_area_sqm,
      address,
      notes,
      is_active,
    } = formData;

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Building name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: BuildingPayload & { is_active: boolean } = {
        branch_id,
        name: name.trim(),
        building_type,
        total_floors: Math.max(total_floors || 1, 1),
        building_area_sqm,
        land_area_sqm,
        address: {
          street: (address.street ?? "").trim(),
          city: (address.city ?? "").trim(),
        },
        notes: notes.trim(),
        is_active,
      };

      const result = await apiPut<SingleResponse<BuildingApiDaum>>(
        `/building/${initialData._id}`,
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

  const selectedType =
    TYPE_OPTIONS.find((o) => o.value === formData.building_type) ?? null;
  const floorsWillAdd = Math.max(
    (Number(formData.total_floors) || 0) - (initialData.total_floors ?? 0),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Building
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            {initialData.code}
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className={labelCls}>
                Building Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Building Type</label>
              <Select
                instanceId="building-type-update"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    building_type:
                      (opt?.value as BuildingType) ?? BuildingType.OFFICE,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Total Floors</label>
              <CurrencyInput
                maxDecimals={0}
                min={1}
                value={formData.total_floors}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, total_floors: v }))
                }
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                {floorsWillAdd > 0
                  ? `Menambah ${floorsWillAdd} lantai baru. Lantai yang ada tidak dihapus.`
                  : "Menurunkan angka tidak menghapus lantai yang sudah ada."}
              </p>
            </div>

            <div className="group">
              <label className="flex items-center gap-3 cursor-pointer select-none mt-7">
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

            <div className="group">
              <label className={labelCls}>Building Area (m²)</label>
              <CurrencyInput
                value={formData.building_area_sqm}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, building_area_sqm: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Land Area (m²)</label>
              <CurrencyInput
                value={formData.land_area_sqm}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, land_area_sqm: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Street</label>
              <input
                value={formData.address.street ?? ""}
                name="street"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>City</label>
              <input
                value={formData.address.city ?? ""}
                name="city"
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Notes</label>
              <textarea
                value={formData.notes}
                name="notes"
                onChange={handleChange}
                rows={2}
                className={`${inputCls} resize-none`}
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

"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiPut } from "@/utils/api";
import {
  BuildingFloorApiDaum,
  BuildingFloorPayload,
  FloorType,
  refImagePath,
  SingleResponse,
} from "@/types/facility";
import ImageUpload from "@/components/atoms/shared/ImageUpload";
import NumberInput from "@/components/atoms/shared/NumberInput";

interface DataProps {
  isOpen: boolean;
  initialData: BuildingFloorApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const readOnlyCls =
  "w-full bg-zinc-100 dark:bg-zinc-800/60 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed select-none";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const TYPE_OPTIONS: Option[] = Object.values(FloorType).map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateBuildingFloorModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [type, setType] = useState<FloorType>(
    initialData.type ?? FloorType.FLOOR,
  );
  const [area, setArea] = useState(initialData.floor_area_sqm ?? 0);
  const [capacity, setCapacity] = useState(initialData.max_capacity ?? 0);
  const [planId, setPlanId] = useState<string | null>(
    typeof initialData.floor_plan_url_id === "object" &&
      initialData.floor_plan_url_id
      ? initialData.floor_plan_url_id._id
      : ((initialData.floor_plan_url_id as string) ?? null),
  );
  const [notes, setNotes] = useState(initialData.notes ?? "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Name & floor_level dikelola otomatis oleh sistem — tidak dikirim.
      const payload: BuildingFloorPayload = {
        type,
        floor_area_sqm: area,
        max_capacity: capacity,
        floor_plan_url_id: planId,
        notes: notes.trim(),
      };
      const result = await apiPut<SingleResponse<BuildingFloorApiDaum>>(
        `/building-floor/${initialData._id}`,
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Floor updated successfully.",
          confirmButtonColor: "#2563eb",
          timer: 2000,
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
        text: serverMessage || "Failed to update floor. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  const selectedType = TYPE_OPTIONS.find((o) => o.value === type) ?? null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Edit Building Floor
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
            {/* NAME (auto — read only) */}
            <div className="group">
              <label className={labelCls}>Name (auto)</label>
              <div className={readOnlyCls}>{initialData.name}</div>
              <p className="mt-1 text-[11px] text-zinc-400">
                Nama dikelola otomatis mengikuti urutan lantai.
              </p>
            </div>

            {/* FLOOR LEVEL (auto — read only) */}
            <div className="group">
              <label className={labelCls}>Floor Level (auto)</label>
              <div className={readOnlyCls}>{initialData.floor_level}</div>
            </div>

            <div className="group">
              <label className={labelCls}>Type</label>
              <Select
                instanceId="floor-type-update"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setType((opt?.value as FloorType) ?? FloorType.FLOOR)
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Area (m²)</label>
              <NumberInput
                value={area}
                onChange={setArea}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Max Capacity</label>
              <NumberInput
                integer
                value={capacity}
                onChange={setCapacity}
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/building-floor/upload"
                value={planId}
                imagePath={refImagePath(initialData.floor_plan_url_id)}
                onChange={(id) => setPlanId(id)}
                label="Floor Plan"
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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

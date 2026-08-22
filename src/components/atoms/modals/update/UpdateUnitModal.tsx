"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiPut } from "@/utils/api";
import {
  amenityIds,
  FormDataUnitProps,
  refImagePath,
  RoomStatus,
  ROOM_STATUS_LABEL,
  ROOM_UNIT_TYPES,
  UnitApiDaum,
  UnitPayload,
  RoomUnitType,
} from "@/types/facility";
import ImageUpload from "@/components/atoms/shared/ImageUpload";
import CurrencyInput from "@/components/atoms/shared/CurrencyInput";
import AmenitiesSelect from "@/components/atoms/shared/AmenitiesSelect";

interface DataProps {
  isOpen: boolean;
  initialData: UnitApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const TYPE_OPTIONS: Option[] = ROOM_UNIT_TYPES.map((t) => ({
  value: t,
  label: t.replace(/_/g, " "),
}));
const STATUS_OPTIONS: Option[] = Object.values(RoomStatus).map((s) => ({
  value: s,
  label: ROOM_STATUS_LABEL[s],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateUnitModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] = useState<FormDataUnitProps>(() => ({
    name: initialData.name,
    unit_type: initialData.unit_type ?? "bedroom",
    status: (initialData.status as RoomStatus) ?? RoomStatus.AVAILABLE,
    capacity: initialData.capacity ?? 0,
    area_sqm: initialData.area_sqm ?? 0,
    notes: initialData.notes ?? "",
    is_active: initialData.is_active,
  }));
  // State terpisah — bukan field payload plain: amenities (multi-select array),
  // imageId (hasil upload gambar) & flag UI.
  const [amenities, setAmenities] = useState<string[]>(
    amenityIds(initialData.amenities),
  );
  const [imageId, setImageId] = useState<string | null>(
    typeof initialData.image_id === "object" && initialData.image_id
      ? initialData.image_id._id
      : ((initialData.image_id as string) ?? null),
  );
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
      return {
        ...prev,
        [name as keyof FormDataUnitProps]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const { name, unit_type, status, capacity, area_sqm, notes, is_active } =
      formData;

    setIsLoading(true);
    try {
      const payload: Omit<UnitPayload, "floor_id"> & {
        is_active: boolean;
      } = {
        name: name.trim(),
        unit_type,
        status,
        capacity: capacity,
        area_sqm,
        amenities,
        image_id: imageId,
        notes: notes.trim(),
        is_active,
      };

      const result = await apiPut<SingleResponse<UnitApiDaum>>(
        `/unit/${initialData._id}`,
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
    TYPE_OPTIONS.find((o) => o.value === formData.unit_type) ?? null;
  const selectedStatus =
    STATUS_OPTIONS.find((o) => o.value === formData.status) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Room Unit
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
              <label className={labelCls}>Name</label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Unit Type</label>
              <Select
                instanceId="room-type-update"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit_type: (opt?.value as RoomUnitType) ?? "bedroom",
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Status</label>
              <Select
                instanceId="room-status-update"
                classNamePrefix="rs"
                options={STATUS_OPTIONS}
                value={selectedStatus}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: (opt?.value as RoomStatus) ?? RoomStatus.AVAILABLE,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
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
              <label className={labelCls}>Capacity</label>
              <CurrencyInput
                maxDecimals={0}
                value={formData.capacity}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, capacity: v }))
                }
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Area (m²)</label>
              <CurrencyInput
                value={formData.area_sqm}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, area_sqm: v }))
                }
                className={inputCls}
              />
            </div>
            <div className="group md:col-span-2">
              <label className={labelCls}>Amenities</label>
              <AmenitiesSelect
                instanceId="amenities-update-room"
                value={amenities}
                onChange={setAmenities}
              />
            </div>
            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/upload/single"
                value={imageId}
                imagePath={refImagePath(initialData.image_id)}
                onChange={(id) => setImageId(id)}
                label="Room Photo"
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

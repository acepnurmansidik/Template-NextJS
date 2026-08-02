"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import {
  BuildingApiDaum,
  BuildingFloorApiDaum,
  FormDataRoomUnitProps,
  RoomStatus,
  ROOM_STATUS_LABEL,
  ROOM_UNIT_TYPES,
  RoomUnitApiDaum,
  RoomUnitPayload,
  RoomUnitType,
} from "@/types/facility";
import ImageUpload from "@/components/atoms/shared/ImageUpload";
import NumberInput from "@/components/atoms/shared/NumberInput";
import AmenitiesSelect from "@/components/atoms/shared/AmenitiesSelect";
import { ListResponse, SingleResponse } from "@/types/api";

interface DataProps {
  isOpen: boolean;
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

export default function CreateRoomUnitModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] = useState<FormDataRoomUnitProps>({
    building_id: "",
    floor_id: "",
    name: "",
    unit_type: "bedroom",
    status: RoomStatus.AVAILABLE,
    capacity: 0,
    area_sqm: 0,
    notes: "",
    is_active: true,
  });
  // State terpisah — bukan field payload plain: daftar opsi (fetched),
  // amenities (multi-select array), imageId (hasil upload) & flag UI.
  const [buildings, setBuildings] = useState<BuildingApiDaum[]>([]);
  const [floors, setFloors] = useState<BuildingFloorApiDaum[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageId, setImageId] = useState<string | null>(null);
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataRoomUnitProps]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await apiGet<ListResponse<BuildingApiDaum>>(
          "/building",
          { limit: 1000 },
          false,
        );
        setBuildings(result.data ?? []);
      } catch {
        setBuildings([]);
      }
    })();
  }, []);

  // Ambil lantai saat building dipilih.
  useEffect(() => {
    if (!formData.building_id) {
      setFloors([]);
      setFormData((prev) => ({ ...prev, floor_id: "" }));
      return;
    }
    (async () => {
      try {
        const result = await apiGet<ListResponse<BuildingFloorApiDaum>>(
          "/building-floor",
          { building_id: formData.building_id, limit: 1000 },
          false,
        );
        setFloors(result.data ?? []);
      } catch {
        setFloors([]);
      }
      setFormData((prev) => ({ ...prev, floor_id: "" }));
    })();
  }, [formData.building_id]);

  const buildingOptions: Option[] = useMemo(
    () =>
      buildings.map((b) => ({ value: b._id, label: `${b.code} — ${b.name}` })),
    [buildings],
  );
  const floorOptions: Option[] = useMemo(
    () => floors.map((f) => ({ value: f._id, label: `${f.code} — ${f.name}` })),
    [floors],
  );

  const handleSubmit = async () => {
    const { floor_id, name, unit_type, status, capacity, area_sqm, notes } =
      formData;

    if (!floor_id) {
      Swal.fire({
        icon: "warning",
        title: "Building & floor are required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: RoomUnitPayload = {
        floor_id,
        name: name.trim(),
        unit_type,
        status,
        capacity: capacity,
        area_sqm,
        amenities,
        image_id: imageId,
        notes: notes.trim(),
      };

      const result = await apiPost<SingleResponse<RoomUnitApiDaum>>(
        "/room-unit",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Room unit created successfully.",
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

  const selectedBuilding =
    buildingOptions.find((o) => o.value === formData.building_id) ?? null;
  const selectedFloor =
    floorOptions.find((o) => o.value === formData.floor_id) ?? null;
  const selectedType =
    TYPE_OPTIONS.find((o) => o.value === formData.unit_type) ?? null;
  const selectedStatus =
    STATUS_OPTIONS.find((o) => o.value === formData.status) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Room Unit
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
                Building<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="room-building-create"
                classNamePrefix="rs"
                placeholder="Select building…"
                options={buildingOptions}
                value={selectedBuilding}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    building_id: opt?.value ?? "",
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Floor<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="room-floor-create"
                classNamePrefix="rs"
                placeholder="Select floor…"
                isDisabled={!formData.building_id}
                options={floorOptions}
                value={selectedFloor}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    floor_id: opt?.value ?? "",
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Kode &amp; nama otomatis mengikuti urutan (Room 1, Room 2…).
              </p>
            </div>

            <div className="group">
              <label className={labelCls}>Name (optional)</label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                placeholder="Kosongkan untuk otomatis (Room N)"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Unit Type</label>
              <Select
                instanceId="room-type-create"
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
                instanceId="room-status-create"
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
              <label className={labelCls}>Capacity</label>
              <NumberInput
                integer
                value={formData.capacity}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, capacity: v }))
                }
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Area (m²)</label>
              <NumberInput
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
                instanceId="amenities-create-room"
                value={amenities}
                onChange={setAmenities}
              />
            </div>

            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/room-unit/upload"
                value={imageId}
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
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

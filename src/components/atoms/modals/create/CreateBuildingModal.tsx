"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiGet, apiPost } from "@/utils/api";
import {
  BranchApiDaum,
  BuildingApiDaum,
  BuildingPayload,
  BuildingType,
  BUILDING_TYPE_LABEL,
  ListResponse,
  SingleResponse,
} from "@/types/facility";
import NumberInput from "@/components/atoms/shared/NumberInput";

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

const TYPE_OPTIONS: Option[] = Object.values(BuildingType).map((t) => ({
  value: t,
  label: BUILDING_TYPE_LABEL[t],
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function CreateBuildingModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [branches, setBranches] = useState<BranchApiDaum[]>([]);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<BuildingType>(BuildingType.OFFICE);
  const [totalFloors, setTotalFloors] = useState(1);
  const [buildingArea, setBuildingArea] = useState(0);
  const [landArea, setLandArea] = useState(0);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        const result = await apiGet<ListResponse<BranchApiDaum>>(
          "/branch",
          { limit: 1000 },
          false,
        );
        setBranches(result.data ?? []);
      } catch {
        setBranches([]);
      }
    })();
  }, []);

  const branchOptions: Option[] = useMemo(
    () =>
      branches.map((b) => ({ value: b._id, label: `${b.code} — ${b.name}` })),
    [branches],
  );

  const handleSubmit = async () => {
    if (!branchId) {
      Swal.fire({
        icon: "warning",
        title: "Branch is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
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
      const payload: BuildingPayload = {
        branch_id: branchId,
        name: name.trim(),
        building_type: type,
        total_floors: Math.max(totalFloors || 1, 1),
        building_area_sqm: buildingArea,
        land_area_sqm: landArea,
        address: { street: street.trim(), city: city.trim() },
        notes: notes.trim(),
      };

      const result = await apiPost<SingleResponse<BuildingApiDaum>>(
        "/building",
        payload,
        false,
        false,
      );
      setIsLoading(false);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text:
            result.message ||
            `Building & ${payload.total_floors} floor(s) created successfully.`,
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

  const selectedBranch =
    branchOptions.find((o) => o.value === branchId) ?? null;
  const selectedType = TYPE_OPTIONS.find((o) => o.value === type) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Building
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
                Branch<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="building-branch-create"
                classNamePrefix="rs"
                placeholder="Select branch…"
                options={branchOptions}
                value={selectedBranch}
                onChange={(opt) => setBranchId(opt?.value ?? null)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Building Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ANGGREK"
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Kode otomatis dari nama (ANGGREK → AGRK).
              </p>
            </div>

            <div className="group">
              <label className={labelCls}>Building Type</label>
              <Select
                instanceId="building-type-create"
                classNamePrefix="rs"
                options={TYPE_OPTIONS}
                value={selectedType}
                onChange={(opt) =>
                  setType((opt?.value as BuildingType) ?? BuildingType.OFFICE)
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group">
              <label className={labelCls}>
                Total Floors<span className="text-red-500">*</span>
              </label>
              <NumberInput
                integer
                min={1}
                value={totalFloors}
                onChange={setTotalFloors}
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                {totalFloors > 0
                  ? `Otomatis membuat ${totalFloors} lantai: Floor 1 … Floor ${totalFloors}.`
                  : "Minimal 1 lantai."}
              </p>
            </div>

            <div className="group">
              <label className={labelCls}>Building Area (m²)</label>
              <NumberInput
                value={buildingArea}
                onChange={setBuildingArea}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Land Area (m²)</label>
              <NumberInput
                value={landArea}
                onChange={setLandArea}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Street</label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
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
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

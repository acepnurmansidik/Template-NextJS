"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiPut } from "@/utils/api";
import { BranchApiDaum, BranchPayload } from "@/types/facility";
import { FormDataBranchProps } from "@/types/branch";
import LocationPicker, {
  LatLng,
  PickedAddress,
} from "@/components/atoms/shared/LocationPicker";

// Ambil koordinat awal dari GeoJSON location ([lng, lat]); abaikan [0,0].
const initialCoords = (branch: BranchApiDaum): LatLng | null => {
  const c = branch.location?.coordinates;
  if (!c || c.length < 2) return null;
  const [lng, lat] = c;
  if (!lng && !lat) return null;
  return { lat, lng };
};

interface DataProps {
  isOpen: boolean;
  initialData: BranchApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

export default function UpdateBranchModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] = useState<FormDataBranchProps>(() => ({
    name: initialData.name ?? "",
    notes: initialData.notes ?? "",
    description: initialData.description ?? "",
    contact_info: {
      phone: initialData.contact_info?.phone?.[0] ?? "",
      email: initialData.contact_info?.email ?? "",
      manager_name: initialData.contact_info?.manager_name ?? "",
    },
    address: {
      street: initialData.address?.street ?? "",
      city: initialData.address?.city ?? "",
      state_province: initialData.address?.state_province ?? "",
      postal_code: initialData.address?.postal_code ?? "",
      country: initialData.address?.country ?? "Indonesia",
    },
    location: initialData.location ?? { type: "Point", coordinates: [0, 0] },
    is_active: initialData.is_active,
  }));
  // State terpisah — memang tidak bisa disatukan ke dalam formData:
  // coords (bentuk LatLng untuk map picker, beda dgn location GeoJSON) & flag UI.
  const [coords, setCoords] = useState<LatLng | null>(
    initialCoords(initialData),
  );
  const [geoLoading, setGeoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Klik peta → simpan koordinat & isi alamat otomatis (hasil reverse geocode).
  const handlePickLocation = (c: LatLng, addr: PickedAddress) => {
    setCoords(c);
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        ...(addr.street ? { street: addr.street } : {}),
        ...(addr.city ? { city: addr.city } : {}),
        ...(addr.state_province ? { state_province: addr.state_province } : {}),
        ...(addr.postal_code ? { postal_code: addr.postal_code } : {}),
        ...(addr.country ? { country: addr.country } : {}),
      },
    }));
  };

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

    setFormData((prev: FormDataBranchProps) => {
      // 0. Checkbox (is_active)
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }

      // 1. Update contact_info
      if (["phone", "email", "manager_name"].includes(name)) {
        return {
          ...prev,
          contact_info: {
            ...prev.contact_info,
            [name]: value,
          },
        };
      }

      // 2. Update address
      if (
        ["street", "city", "state_province", "postal_code", "country"].includes(
          name,
        )
      ) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        };
      }

      // 3. Update top-level field biasa (name, description, notes, dll)
      return {
        ...prev,
        [name as keyof FormDataBranchProps]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const { name, description, notes, contact_info, address, is_active } =
      formData;

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Branch name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: BranchPayload = {
        name: name.trim(),
        description: description.trim(),
        contact_info: {
          phone: contact_info.phone.trim() ? [contact_info.phone.trim()] : [],
          email: contact_info.email.trim(),
          manager_name: contact_info.manager_name.trim(),
        },
        address: {
          street: (address.street ?? "").trim(),
          city: (address.city ?? "").trim(),
          state_province: (address.state_province ?? "").trim(),
          postal_code: (address.postal_code ?? "").trim(),
          country: (address.country ?? "").trim(),
        },
        ...(coords
          ? {
              location: {
                type: "Point" as const,
                coordinates: [coords.lng, coords.lat],
              },
            }
          : {}),
        is_active,
        notes: notes.trim(),
      };

      const result = await apiPut<SingleResponse<BranchApiDaum>>(
        `/branch/${initialData._id}`,
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Branch
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
                Branch Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Manager Name</label>
              <input
                value={formData.contact_info.manager_name ?? ""}
                name="manager_name"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Email</label>
              <input
                value={formData.contact_info.email ?? ""}
                name="email"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Phone</label>
              <input
                value={formData.contact_info.phone ?? ""}
                name="phone"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group md:col-span-2">
              <label className={labelCls}>
                Location{" "}
                {geoLoading && (
                  <span className="text-blue-500 normal-case font-medium">
                    · fetching address…
                  </span>
                )}
              </label>
              <LocationPicker
                value={coords}
                onPick={handlePickLocation}
                onGeocodingChange={setGeoLoading}
                height="320px"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Klik titik pada peta — alamat akan terisi otomatis.
                {coords &&
                  ` (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`}
              </p>
            </div>
            <div className="group md:col-span-2">
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
            <div className="group">
              <label className={labelCls}>State / Province</label>
              <input
                value={formData.address.state_province ?? ""}
                name="state_province"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Postal Code</label>
              <input
                value={formData.address.postal_code ?? ""}
                name="postal_code"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Country</label>
              <input
                value={formData.address.country ?? ""}
                name="country"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active ?? false}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Active
                </span>
              </label>
            </div>
            <div className="group md:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={formData.description ?? ""}
                name="description"
                onChange={handleChange}
                rows={2}
                className={`${inputCls} resize-none`}
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

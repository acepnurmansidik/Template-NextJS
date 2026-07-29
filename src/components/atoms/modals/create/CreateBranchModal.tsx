"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiPost } from "@/utils/api";
import { BranchPayload, BranchApiDaum } from "@/types/facility";
import LocationPicker, {
  LatLng,
  PickedAddress,
} from "@/components/atoms/shared/LocationPicker";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

export default function CreateBranchModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState("");
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Klik peta → simpan koordinat & isi alamat otomatis (hasil reverse geocode).
  const handlePickLocation = (c: LatLng, addr: PickedAddress) => {
    setCoords(c);
    if (addr.street) setStreet(addr.street);
    if (addr.city) setCity(addr.city);
    if (addr.state_province) setStateProvince(addr.state_province);
    if (addr.postal_code) setPostalCode(addr.postal_code);
    if (addr.country) setCountry(addr.country);
  };

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
          phone: phone.trim() ? [phone.trim()] : [],
          email: email.trim(),
          manager_name: managerName.trim(),
        },
        address: {
          street: street.trim(),
          city: city.trim(),
          state_province: stateProvince.trim(),
          postal_code: postalCode.trim(),
          country: country.trim(),
        },
        ...(coords
          ? {
              location: {
                type: "Point" as const,
                coordinates: [coords.lng, coords.lat],
              },
            }
          : {}),
        is_active: isActive,
        notes: notes.trim(),
      };

      const result = await apiPost<SingleResponse<BranchApiDaum>>(
        "/branch",
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
          Create Branch
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
                Branch Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ANGGREK"
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Kode &amp; slug dibuat otomatis oleh sistem dari nama ini.
              </p>
            </div>

            <div className="group">
              <label className={labelCls}>Manager Name</label>
              <input
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. Budi Santoso"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="branch@example.com"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 021-12345678"
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
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Jl. Anggrek No. 1"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>State / Province</label>
              <input
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                placeholder="DKI Jakarta"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Postal Code</label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10110"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Optional description"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional note"
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

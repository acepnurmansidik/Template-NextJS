"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiPut } from "@/utils/api";
import { WarehouseApiDaum, WarehousePayload } from "@/types/warehouse";

interface DataProps {
  isOpen: boolean;
  initialData: WarehouseApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

export default function UpdateWarehouseModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [name, setName] = useState(initialData.name);
  const [code, setCode] = useState(initialData.code);
  const [phone, setPhone] = useState(initialData.phone ?? "");
  const [street, setStreet] = useState(initialData.address?.street ?? "");
  const [city, setCity] = useState(initialData.address?.city ?? "");
  const [stateProvince, setStateProvince] = useState(
    initialData.address?.state_province ?? "",
  );
  const [postalCode, setPostalCode] = useState(
    initialData.address?.postal_code ?? "",
  );
  const [country, setCountry] = useState(
    initialData.address?.country ?? "Indonesia",
  );
  const [isActive, setIsActive] = useState(initialData.is_active);
  const [isLoading, setIsLoading] = useState(false);

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
        title: "Warehouse name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (!code.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warehouse code is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: WarehousePayload = {
        name: name.trim(),
        code: code.trim(),
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state_province: stateProvince.trim(),
          postal_code: postalCode.trim(),
          country: country.trim(),
        },
        is_active: isActive,
      };

      const result = await apiPut<SingleResponse<WarehouseApiDaum>>(
        `/warehouse/${initialData._id}`,
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
            Update Warehouse
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
                Warehouse Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>
                Code<span className="text-red-500">*</span>
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="group md:col-span-2">
              <label className={labelCls}>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="group md:col-span-2">
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
            <div className="group">
              <label className={labelCls}>State / Province</label>
              <input
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="group">
              <label className={labelCls}>Postal Code</label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
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

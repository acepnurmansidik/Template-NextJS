"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { apiPost } from "@/utils/api";
import {
  FormDataSupplierProps,
  SupplierApiDaum,
  SupplierPayload,
} from "@/types/supplier";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const defaultValue: FormDataSupplierProps = {
  name: "",
  code: "",
  contact_info: {
    phone: "",
    email: "",
    contact_person: "",
  },
  address: {
    street: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "Indonesia",
  },
};

export default function CreateSupplierModal({
  isOpen,
  onClose,
  onSuccess,
}: DataProps) {
  const [formData, setFormData] =
    useState<FormDataSupplierProps>(defaultValue);
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

    setFormData((prev: FormDataSupplierProps) => {
      // 1. Update contact_info
      if (["phone", "email", "contact_person"].includes(name)) {
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

      // 3. Update top-level field biasa (name, code)
      return {
        ...prev,
        [name as keyof FormDataSupplierProps]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const { name, code, contact_info, address } = formData;

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Supplier name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: SupplierPayload = {
        name: name.trim(),
        // Kosongkan → backend auto-generate kode (SUP-####).
        code: code.trim() || undefined,
        contact_info: {
          phone: contact_info.phone.trim() ? [contact_info.phone.trim()] : [],
          email: contact_info.email.trim(),
          contact_person: contact_info.contact_person.trim(),
        },
        address: {
          street: address.street.trim(),
          city: address.city.trim(),
          state_province: address.state_province.trim(),
          postal_code: address.postal_code.trim(),
          country: address.country.trim(),
        },
      };

      const result = await apiPost<SingleResponse<SupplierApiDaum>>(
        "/supplier",
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
          Create Supplier
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
                Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                placeholder="e.g. PT Sumber Rejeki"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Code</label>
              <input
                value={formData.code}
                name="code"
                onChange={handleChange}
                placeholder="Kosongkan untuk auto-generate (SUP-####)"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Contact Person</label>
              <input
                value={formData.contact_info.contact_person}
                name="contact_person"
                onChange={handleChange}
                placeholder="e.g. Budi Santoso"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Email</label>
              <input
                value={formData.contact_info.email}
                name="email"
                onChange={handleChange}
                placeholder="supplier@example.com"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Phone</label>
              <input
                value={formData.contact_info.phone}
                name="phone"
                onChange={handleChange}
                placeholder="e.g. 021-12345678"
                className={inputCls}
              />
            </div>

            <div className="group md:col-span-2">
              <label className={labelCls}>Street</label>
              <input
                value={formData.address.street}
                name="street"
                onChange={handleChange}
                placeholder="Jl. Sumber No. 1"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>City</label>
              <input
                value={formData.address.city}
                name="city"
                onChange={handleChange}
                placeholder="Jakarta"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>State / Province</label>
              <input
                value={formData.address.state_province}
                name="state_province"
                onChange={handleChange}
                placeholder="DKI Jakarta"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Postal Code</label>
              <input
                value={formData.address.postal_code}
                name="postal_code"
                onChange={handleChange}
                placeholder="10110"
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Country</label>
              <input
                value={formData.address.country}
                name="country"
                onChange={handleChange}
                className={inputCls}
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

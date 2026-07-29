"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse } from "@/types/api";
import { RoleApiDaum } from "@/types/role";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import React from "react";

import { apiGet, apiPost } from "@/utils/api";
import { UserFormDataDaum, UserApiDaum } from "@/types/users";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";

type Option = { value: string; label: string };
interface DataProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValue: UserFormDataDaum = {
  username: "",
  email: "",
  password: "",
  role_id: "",
};

export default function CreateUserIAMModal({ isOpen, onClose }: DataProps) {
  // =============================== S T A T E ===============================
  const [formData, setFormData] = useState<UserFormDataDaum>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Option | null>(null);

  // ====================== S E L E C T * O P T I O N ======================
  // Satu fungsi untuk semua: dipakai saat modal dibuka (via defaultOptions)
  // maupun saat user mengetik (loadOptions AsyncSelect). Di-debounce 3 detik;
  // leading:true agar saat modal pertama dibuka langsung hit, sedangkan saat
  // mengetik menunggu jeda 3 detik sebelum hit ke server.
  const loadRoleOptions = useMemo(
    () =>
      debounce(
        (inputValue: string, callback: (options: Option[]) => void) => {
          apiGet<ListResponse<RoleApiDaum>>(
            "/role",
            { page: 1, limit: 5, search: inputValue },
            false,
          )
            .then((result) =>
              callback(
                (result.data ?? []).map((role) => ({
                  value: role._id,
                  label: role.name,
                })),
              ),
            )
            .catch(() => callback([]));
        },
        3000,
        { leading: true },
      ),
    [],
  );

  // ======================== U S E * E F F E C T ==========================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ====================== H A N D L E R * S U B M I T ======================
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await apiPost<ListResponse<UserApiDaum>>(
        "/users",
        formData,
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

        // Reset form lalu tutup modal.
        setFormData(defaultValue);
        setSelectedRole(null);
        onClose();
      }
    } catch (error) {
      setIsLoading(false);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Failed to save data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // ====================== H A N D L E R * A C T I O N ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSelectedRole = (data: Option | null) => {
    setSelectedRole(data);
    setFormData((prev: UserFormDataDaum) => ({
      ...prev,
      role_id: data?.value ?? "",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create User IAM
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
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Role<span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                isSearchable
                cacheOptions
                defaultOptions={true}
                loadOptions={loadRoleOptions}
                instanceId={`module-select`} // Pastikan unique per row
                classNamePrefix="rs"
                placeholder="Ketik untuk mencari..."
                // value harus berupa objek Option (bukan string id) agar tampil.
                value={selectedRole}
                onChange={(vals) => handleSelectedRole(vals)}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
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
          className={`px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg ${isLoading ?? "italic"}`}
        >
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

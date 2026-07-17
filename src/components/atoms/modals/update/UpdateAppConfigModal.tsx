"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import React from "react";
import Select from "react-select";
import semver from "semver";
import axios from "axios";
import { apiPut } from "@/utils/api";
import {
  AppConfigApiDaum,
  AppConfigForm,
  BodyAppConfigResponseApiDaum,
  UpdateType,
} from "@/types/appConfig";
import QuillEditor from "@/components/atoms/shared/QuillEditor";

type Option = { value: string; label: string };

interface DataProps {
  initialData: AppConfigApiDaum;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UPDATE_TYPE_OPTIONS: Option[] = [
  { value: UpdateType.NONE, label: "None" },
  { value: UpdateType.OPTIONAL, label: "Optional" },
  { value: UpdateType.FORCE, label: "Force" },
];

const defaultValue: AppConfigForm = {
  platform: "",
  latest_version: "",
  update_type: UpdateType.NONE,
  download_url: "",
  status_maintenance: false,
  maintenance_message: "",
};

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateAppConfigModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  // =============================== S T A T E ===============================
  const [formData, setFormData] = useState<AppConfigForm>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [versionError, setVersionError] = useState<string>("");

  // ======================== U S E * E F F E C T ==========================
  // Muat data awal saat modal dibuka.
  useEffect(() => {
    setFormData({
      platform: initialData.platform ?? "",
      latest_version: initialData.latest_version ?? "",
      update_type: initialData.update_type ?? UpdateType.NONE,
      download_url: initialData.download_url ?? "",
      status_maintenance: initialData.status_maintenance ?? false,
      maintenance_message: initialData.maintenance_message ?? "",
    });
    setVersionError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ====================== H A N D L E R * S U B M I T ======================
  const handleSubmit = async () => {
    if (!formData.platform.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Platform is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!semver.valid(formData.latest_version)) {
      setVersionError('Format versi tidak valid. Gunakan format "1.0.0".');
      return;
    }

    setIsLoading(true);
    try {
      const payload: AppConfigForm = {
        ...formData,
        platform: formData.platform.trim().toLowerCase(),
        latest_version: semver.valid(formData.latest_version) as string,
      };

      const result = await apiPut<BodyAppConfigResponseApiDaum>(
        `/app-configs/${initialData._id}`,
        payload,
        false,
        false,
      );

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Your data has been saved successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          timerProgressBar: true,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      // Ambil pesan error asli dari server bila ada, jatuh ke pesan default.
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

  // ====================== H A N D L E R * A C T I O N ======================
  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      platform: e.target.value.toLowerCase(),
    }));
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, latest_version: value }));
    if (value && !semver.valid(value)) {
      setVersionError('Format versi tidak valid. Gunakan format "1.0.0".');
    } else {
      setVersionError("");
    }
  };

  const handleDownloadUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, download_url: e.target.value }));
  };

  if (!isOpen) return null;

  const selectedUpdateType =
    UPDATE_TYPE_OPTIONS.find((o) => o.value === formData.update_type) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Application Config
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
            {/* PLATFORM */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Platform<span className="text-red-500">*</span>
              </label>
              <input
                name="platform"
                value={formData.platform}
                onChange={handlePlatformChange}
                placeholder="web / android / ios"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Otomatis diubah ke huruf kecil.
              </p>
            </div>

            {/* VERSION (semver) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Version<span className="text-red-500">*</span>
              </label>
              <input
                name="latest_version"
                value={formData.latest_version}
                onChange={handleVersionChange}
                placeholder="1.0.0"
                className={`w-full bg-white dark:bg-zinc-950 p-2.5 border rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1 dark:text-zinc-100 ${
                  versionError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {versionError ? (
                <p className="mt-1 text-[11px] text-red-500">{versionError}</p>
              ) : (
                <p className="mt-1 text-[11px] text-zinc-400">
                  Format semver, contoh: 1.0.0
                </p>
              )}
            </div>

            {/* UPDATE TYPE (react-select) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Update Type<span className="text-red-500">*</span>
              </label>
              <Select
                instanceId="appconfig-update-type-update"
                classNamePrefix="rs"
                options={UPDATE_TYPE_OPTIONS}
                value={selectedUpdateType}
                onChange={(opt) =>
                  setFormData((prev) => ({
                    ...prev,
                    update_type: (opt?.value as UpdateType) ?? UpdateType.NONE,
                  }))
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            {/* DOWNLOAD URL */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Download Url
              </label>
              <input
                name="download_url"
                value={formData.download_url}
                onChange={handleDownloadUrlChange}
                placeholder="https://..."
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>

            {/* STATUS MAINTENANCE (toggle) */}
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Status Maintenance
              </label>
              <label className="inline-flex items-center gap-3 cursor-pointer mt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.status_maintenance}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status_maintenance: !prev.status_maintenance,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    formData.status_maintenance
                      ? "bg-blue-600"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                      formData.status_maintenance
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-zinc-600 dark:text-zinc-300">
                  {formData.status_maintenance ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            {/* MESSAGE (Quill rich-text) */}
            <div className="group md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Message
              </label>
              <QuillEditor
                value={formData.maintenance_message}
                onChange={(html) =>
                  setFormData((prev) => ({
                    ...prev,
                    maintenance_message: html,
                  }))
                }
                placeholder="Tulis pesan maintenance / catatan rilis..."
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
          {isLoading ? "Updating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

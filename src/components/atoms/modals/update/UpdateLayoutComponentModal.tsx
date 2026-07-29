"use client";

import { useEffect, useState } from "react";
import { SingleResponse } from "@/types/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { apiPut } from "@/utils/api";
import {
  LayoutComponentApiDaum,
  LayoutComponentPayload,
  LAYOUT_COMPONENT_CATEGORIES,
} from "@/types/LayoutComponent";
import { refImagePath } from "@/types/facility";
import ImageUpload from "@/components/atoms/shared/ImageUpload";

interface DataProps {
  isOpen: boolean;
  initialData: LayoutComponentApiDaum;
  onClose: () => void;
  onSuccess?: () => void;
}

type Option = { value: string; label: string };

const inputCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";

const CATEGORY_OPTIONS: Option[] = LAYOUT_COMPONENT_CATEGORIES.map((c) => ({
  value: c,
  label: c.charAt(0) + c.slice(1).toLowerCase(),
}));

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export default function UpdateLayoutComponentModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: DataProps) {
  const [name, setName] = useState(initialData.name);
  const [category, setCategory] = useState<string>(
    initialData.category ?? LAYOUT_COMPONENT_CATEGORIES[0],
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Component name is required",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: LayoutComponentPayload = {
        name: name.trim(),
        category,
        image_id: imageId,
      };

      const result = await apiPut<SingleResponse<LayoutComponentApiDaum>>(
        `/layout-component/${initialData._id}`,
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

  const selectedCategory =
    CATEGORY_OPTIONS.find((o) => o.value === category) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Layout Component
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
                Component Name<span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="group">
              <label className={labelCls}>Category</label>
              <Select
                instanceId="layout-category-update"
                classNamePrefix="rs"
                options={CATEGORY_OPTIONS}
                value={selectedCategory}
                onChange={(opt) =>
                  setCategory(opt?.value ?? LAYOUT_COMPONENT_CATEGORIES[0])
                }
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                styles={selectStyles}
              />
            </div>

            <div className="group md:col-span-2">
              <ImageUpload
                endpoint="/layout-component/upload"
                value={imageId}
                imagePath={refImagePath(initialData.image_id)}
                onChange={(id) => setImageId(id)}
                label="Component Image"
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

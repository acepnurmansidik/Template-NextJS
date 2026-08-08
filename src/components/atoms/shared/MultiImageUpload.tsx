"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { apiPost } from "@/utils/api";
import { ImageRef, UploadImageResponse } from "@/types/api";
import { imageUrl } from "@/types/facility";

interface DataProps {
  // Endpoint upload multiple (default: API yang sudah ada `/upload/multiple`).
  endpoint?: string;
  // Nama field form-data (default "files", sesuai router upload multiple).
  field?: string;
  // Daftar gambar terpilih ({ _id, path }) — dikelola parent.
  value: ImageRef[];
  onChange: (list: ImageRef[]) => void;
  label?: string;
  // Batas jumlah file (default 10, samakan dengan maxCount backend).
  max?: number;
}

// Uploader banyak gambar — POST multipart (field "files") ke endpoint upload
// yang sudah ada, menyimpan lewat model Image, lalu menambahkan { _id, path }
// hasilnya ke daftar `value`. Menghapus thumbnail hanya melepas dari daftar;
// status Image di backend diselaraskan saat GR di-submit.
export default function MultiImageUpload({
  endpoint = "/upload/multiple",
  field = "files",
  value,
  onChange,
  label = "Received Proof",
  max = 10,
}: DataProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = max - value.length;
    if (room <= 0) {
      Swal.fire({
        icon: "warning",
        title: `Maksimal ${max} file`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const picked = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (picked.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Only image files are allowed",
        confirmButtonColor: "#2563eb",
      });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const toUpload = picked.slice(0, room);

    setUploading(true);
    try {
      const form = new FormData();
      toUpload.forEach((f) => form.append(field, f));
      const result = await apiPost<UploadImageResponse>(
        endpoint,
        form,
        false,
        true,
      );
      const uploaded = (result.data ?? []).map((d) => ({
        _id: d._id,
        path: d.path,
      }));
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
    } catch (error) {
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: serverMessage || "Failed to upload files. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (id: string) =>
    onChange(value.filter((item) => item._id !== id));

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
        {label}
        <span className="ml-1 font-medium normal-case tracking-normal text-zinc-400">
          (opsional)
        </span>
      </label>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-wrap gap-3">
        {value.map((item) => (
          <div key={item._id} className="relative h-28 w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(item.path)}
              alt="received proof"
              className="h-28 w-28 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={() => removeAt(item._id)}
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
            >
              <FiX size={13} />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-28 w-28 flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiUploadCloud size={22} />
            <span className="text-[11px] font-medium">
              {uploading ? "Uploading..." : "Add image"}
            </span>
          </button>
        )}
      </div>

      <p className="mt-1.5 text-[10px] text-zinc-400">
        PNG / JPG, max 15MB · sampai {max} file
      </p>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { UploadImageResponse } from "@/types/api";
import Swal from "sweetalert2";
import axios from "axios";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { apiPost } from "@/utils/api";
import { imageUrl } from "@/types/facility";

interface DataProps {
  // Endpoint upload, mis. "/building/upload".
  endpoint: string;
  // Path gambar saat ini (untuk preview) & id terpilih.
  value?: string | null;
  imagePath?: string | null;
  onChange: (imageId: string | null, path: string | null) => void;
  label?: string;
}

// Uploader gambar generik — POST multipart (field "proofs") ke `endpoint`,
// menyimpan lewat model Image di backend, lalu mengembalikan { _id, path }.
export default function ImageUpload({
  endpoint,
  value,
  imagePath,
  onChange,
  label = "Image",
}: DataProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    imagePath ? imageUrl(imagePath) : null,
  );

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Only image files are allowed",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("proofs", file);
      const result = await apiPost<UploadImageResponse>(
        endpoint,
        form,
        false,
        true,
      );
      const first = result.data?.[0];
      if (first) {
        console.log();
        setPreview(imageUrl(first.path));
        onChange(first._id, first.path);
      }
    } catch (error) {
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: serverMessage || "Failed to upload image. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    setPreview(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={label}
            className="w-full h-40 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
          >
            <FiX size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs h-40 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <FiUploadCloud size={26} />
          <span className="text-xs font-medium">
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
          <span className="text-[10px]">PNG / JPG, max 15MB</span>
        </button>
      )}
      {value && (
        <p className="mt-1 text-[10px] text-zinc-400 font-mono truncate max-w-xs">
          id: {value}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Select from "react-select";

type Option = { value: string; label: string };

const dummyData = [
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "garut", label: "Garut" },
  { value: "tasikmalaya", label: "Tasikmalaya" },
  { value: "semarang", label: "Semarang" },
  { value: "malang", label: "Malang" },
];

export default function MultiSelect() {
  const [options, setOptions] = useState<Option[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi API
    setTimeout(() => {
      setOptions(dummyData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Mencegah rendering di server untuk menghindari masalah Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Atau tampilkan loading skeleton

  return (
    <div className="w-full max-w-sm">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Multi Select
      </label>

      {/* Tambahkan instanceId untuk menstabilkan ID internal react-select */}
      <Select
        isMulti
        isLoading={isLoading}
        instanceId="my-multi-select"
        classNamePrefix="rs"
        placeholder="Cari atau pilih kota..."
        options={dummyData}
      />
    </div>
  );
}

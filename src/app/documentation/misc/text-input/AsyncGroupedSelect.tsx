"use client";

import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { GroupBase } from "react-select";

type Option = { value: string; label: string };
type GroupedOption = { label: string; options: Option[] };

// Data dummy untuk simulasi API
const groupedData: GroupedOption[] = [
  {
    label: "Pulau Jawa",
    options: [
      { value: "jakarta", label: "Jakarta" },
      { value: "bandung", label: "Bandung" },
    ],
  },
  {
    label: "Luar Pulau",
    options: [
      { value: "medan", label: "Medan" },
      { value: "makassar", label: "Makassar" },
    ],
  },
];

export default function AsyncGroupedSelect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fungsi simulasi fetch API
  const loadOptions = (
    inputValue: string,
    callback: (options: GroupBase<Option>[]) => void,
  ) => {
    setTimeout(() => {
      const filtered = groupedData
        .map((group) => ({
          ...group,
          options: group.options.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        }))
        .filter((group) => group.options.length > 0);
      callback(filtered);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-sm">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Pilih Wilayah (Async)
      </label>

      <AsyncSelect
        cacheOptions
        defaultOptions={groupedData}
        loadOptions={loadOptions}
        instanceId="async-grouped-select"
        classNamePrefix="rs"
        placeholder="Cari wilayah..."
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
}

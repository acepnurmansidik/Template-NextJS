"use client";

import { useState, useEffect } from "react";
import Select from "react-select";

export default function SearchableSelect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-sm">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Searchable Select
      </label>

      {/* isSearchable: Mengaktifkan input pencarian
         instanceId: Mencegah error Hydration 
         menuPortalTarget: Memastikan dropdown tidak terpotong kontainer
      */}
      <Select
        isSearchable
        instanceId="searchable-city-select"
        classNamePrefix="rs"
        placeholder="Ketik untuk mencari..."
        options={[
          { value: "jakarta", label: "Jakarta" },
          { value: "bandung", label: "Bandung" },
          { value: "surabaya", label: "Surabaya" },
          { value: "medan", label: "Medan" },
          { value: "makassar", label: "Makassar" },
          { value: "semarang", label: "Semarang" },
        ]}
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

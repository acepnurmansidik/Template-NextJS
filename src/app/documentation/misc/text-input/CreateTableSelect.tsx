"use client";

import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";

// --- Data Dummy Sederhana ---
const actionDefaultOptions = [
  { label: "Create", value: "create" },
  { label: "Read", value: "read" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
];

const initialData = [
  {
    menu_name: "Dashboard",
    actions: [{ label: "Read", value: "read" }],
  },
  {
    menu_name: "User Management",
    actions: [
      { label: "Create", value: "create" },
      { label: "Read", value: "read" },
    ],
  },
];

export default function CreateTableSelect({
  indexRow = 0,
}: {
  indexRow?: number;
}) {
  const [data, setData] = useState(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-sm">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5">
        Create table select
      </label>

      <CreatableSelect
        isMulti
        instanceId={`select-${indexRow}`}
        classNamePrefix="rs"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        value={data[indexRow]?.actions || []}
        options={actionDefaultOptions}
        placeholder="Type & Enter..."
        isValidNewOption={(inputValue) => inputValue.trim().length > 0}
        onChange={(vals) => {
          setData((prev) => {
            // Memastikan data unik
            const uniqueActions = vals
              ? Array.from(new Map(vals.map((v) => [v.value, v])).values())
              : [];

            return prev.map((item, index) => {
              if (index === indexRow) {
                return { ...item, actions: uniqueActions };
              }
              return item;
            });
          });
        }}
        formatCreateLabel={(inputValue) => `Add action: "${inputValue}"`}
      />
    </div>
  );
}

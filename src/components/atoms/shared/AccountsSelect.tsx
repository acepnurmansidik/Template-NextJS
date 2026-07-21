"use client";

// Multi-select akun (Chart of Account). Presentational: opsi & loading dikirim
// dari parent (parent yang fetch COA). Value & onChange berupa array id string.

import Select from "react-select";

export type AccountOption = { value: string; label: string };

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

interface DataProps {
  value: string[];
  onChange: (ids: string[]) => void;
  options: AccountOption[];
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  instanceId?: string;
}

export default function AccountsSelect({
  value,
  onChange,
  options,
  isLoading,
  isDisabled,
  placeholder,
  instanceId,
}: DataProps) {
  const selected = options.filter((o) => value.includes(o.value));
  return (
    <Select
      isMulti
      instanceId={instanceId}
      classNamePrefix="rs"
      options={options}
      value={selected}
      onChange={(opts) =>
        onChange((opts as AccountOption[]).map((o) => o.value))
      }
      isLoading={isLoading}
      isDisabled={isDisabled}
      placeholder={
        isLoading ? "Loading akun..." : (placeholder ?? "Pilih akun...")
      }
      noOptionsMessage={() => "Tidak ada akun tersedia"}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

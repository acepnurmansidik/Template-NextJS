"use client";

import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { fetchSupplierOptions, Option, selectStyles } from "@/utils/procurement";

interface Props {
  value: string | null; // supplier_id terpilih
  label?: string; // label tampilan (supplier_label) untuk value terpilih
  instanceId: string;
  onPick: (opt: Option | null) => void;
  isDisabled?: boolean;
}

// Supplier picker berbasis pencarian server: ambil 5 hasil, search by name/code,
// debounce 3 detik. Dipakai di form PO (supplier per baris) & Product (default).
export default function SupplierAsyncSelect({
  value,
  label,
  instanceId,
  onPick,
  isDisabled,
}: Props) {
  const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

  useEffect(() => {
    let alive = true;
    fetchSupplierOptions("").then((opts) => {
      if (alive) setDefaultOptions(opts);
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadOptions = useMemo(
    () =>
      debounce((input: string, cb: (options: Option[]) => void) => {
        fetchSupplierOptions(input)
          .then((opts) => cb(opts))
          .catch(() => cb([]));
      }, 3000),
    [],
  );
  useEffect(() => () => loadOptions.cancel(), [loadOptions]);

  const selected = value ? { value, label: label || value } : null;

  return (
    <AsyncSelect
      instanceId={instanceId}
      classNamePrefix="rs"
      placeholder="Search supplier (name/code)…"
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={selected}
      onChange={(opt) => onPick((opt as Option) ?? null)}
      isClearable
      isDisabled={isDisabled}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

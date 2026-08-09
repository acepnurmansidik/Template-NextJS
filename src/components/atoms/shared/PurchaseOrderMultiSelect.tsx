"use client";

import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {
  fetchPurchaseOrderOptions,
  PurchaseOrderOption,
  selectStyles,
} from "@/utils/procurement";

interface Props {
  value: PurchaseOrderOption[]; // PO terpilih (membawa data + items)
  instanceId: string;
  onChange: (opts: PurchaseOrderOption[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

// Multi-picker Purchase Order berbasis pencarian server (debounce 3 detik).
// Hanya PO SUBMITTED. Tiap opsi membawa PO mentah (data.items) untuk mengisi
// baris penerimaan di form Good Receipt tanpa memuat seluruh daftar PO.
export default function PurchaseOrderMultiSelect({
  value,
  instanceId,
  onChange,
  placeholder = "Pilih satu / beberapa PO…",
  isDisabled,
}: Props) {
  const [defaultOptions, setDefaultOptions] = useState<PurchaseOrderOption[]>(
    [],
  );

  useEffect(() => {
    let alive = true;
    fetchPurchaseOrderOptions("").then((opts) => {
      if (alive) setDefaultOptions(opts);
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadOptions = useMemo(
    () =>
      debounce(
        (input: string, cb: (options: PurchaseOrderOption[]) => void) => {
          fetchPurchaseOrderOptions(input)
            .then((opts) => cb(opts))
            .catch(() => cb([]));
        },
        3000,
      ),
    [],
  );
  useEffect(() => () => loadOptions.cancel(), [loadOptions]);

  return (
    <AsyncSelect
      isMulti
      instanceId={instanceId}
      classNamePrefix="rs"
      placeholder={placeholder}
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      onChange={(opts) => onChange((opts as PurchaseOrderOption[]) ?? [])}
      isDisabled={isDisabled}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {
  fetchPurchaseRequestOptions,
  PurchaseRequestOption,
  selectStyles,
} from "@/utils/procurement";

interface Props {
  value: PurchaseRequestOption[]; // PR terpilih (membawa data + items)
  instanceId: string;
  onChange: (opts: PurchaseRequestOption[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

// Multi-picker Purchase Request berbasis pencarian server (debounce 3 detik,
// 5–10 hasil). Tiap opsi membawa PR mentah (data.items) sehingga form PO bisa
// mengisi baris item tanpa memuat seluruh daftar PR.
export default function PurchaseRequestMultiSelect({
  value,
  instanceId,
  onChange,
  placeholder = "Search & select Purchase Request…",
  isDisabled,
}: Props) {
  const [defaultOptions, setDefaultOptions] = useState<PurchaseRequestOption[]>(
    [],
  );

  useEffect(() => {
    let alive = true;
    fetchPurchaseRequestOptions("").then((opts) => {
      if (alive) setDefaultOptions(opts);
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadOptions = useMemo(
    () =>
      debounce(
        (input: string, cb: (options: PurchaseRequestOption[]) => void) => {
          fetchPurchaseRequestOptions(input)
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
      onChange={(opts) => onChange((opts as PurchaseRequestOption[]) ?? [])}
      isDisabled={isDisabled}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

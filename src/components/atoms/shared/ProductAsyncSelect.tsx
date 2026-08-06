"use client";

import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {
  fetchProductOptions,
  ProductOption,
  selectStyles,
} from "@/utils/procurement";

interface Props {
  value: string; // product_id terpilih
  label?: string; // label tampilan (product_label) untuk value terpilih
  instanceId: string;
  onPick: (opt: ProductOption | null) => void;
  isDisabled?: boolean;
}

// Product picker berbasis pencarian server: ambil 5 hasil, search by name/code,
// debounce 3 detik. Dipakai di form PR & PO (baris manual).
export default function ProductAsyncSelect({
  value,
  label,
  instanceId,
  onPick,
  isDisabled,
}: Props) {
  const [defaultOptions, setDefaultOptions] = useState<ProductOption[]>([]);

  useEffect(() => {
    let alive = true;
    fetchProductOptions("").then((opts) => {
      if (alive) setDefaultOptions(opts);
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadOptions = useMemo(
    () =>
      debounce((input: string, cb: (options: ProductOption[]) => void) => {
        fetchProductOptions(input)
          .then((opts) => cb(opts))
          .catch(() => cb([]));
      }, 3000),
    [],
  );
  useEffect(() => () => loadOptions.cancel(), [loadOptions]);

  const selected = value
    ? ({ value, label: label || value } as ProductOption)
    : null;

  return (
    <AsyncSelect
      instanceId={instanceId}
      classNamePrefix="rs"
      placeholder="Search product (name/code)…"
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={selected}
      onChange={(opt) => onPick((opt as ProductOption) ?? null)}
      isClearable
      isDisabled={isDisabled}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={selectStyles}
    />
  );
}

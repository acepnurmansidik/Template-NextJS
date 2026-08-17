"use client";

import { useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {
  fetchSupplierOptions,
  fetchSuppliersForProductOptions,
  Option,
  selectStyles,
} from "@/utils/procurement";

interface Props {
  value: string | null; // supplier_id terpilih
  label?: string; // label tampilan (supplier_label) untuk value terpilih
  instanceId: string;
  onPick: (opt: Option | null) => void;
  isDisabled?: boolean;
  // Bila di-set (mode PO): supplier dicari hanya dari yang MEMILIKI produk ini
  // (via supplier-pricing, dicocokkan nama produk). `null`/"" = belum ada
  // produk → daftar kosong (pilih produk dulu).
  product?: string | null;
}

// Supplier picker. Dua mode:
//  - Global (tanpa prop `product`): cari server-side ke /supplier (name/code).
//  - Per-produk (prop `product` di-set, dipakai form PO): ambil supplier yang
//    punya produk tsb dari supplier-pricing, lalu filter client-side.
export default function SupplierAsyncSelect({
  value,
  label,
  instanceId,
  onPick,
  isDisabled,
  product,
}: Props) {
  const scoped = product !== undefined;
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    let alive = true;
    if (scoped) {
      if (!product) {
        setOptions([]);
        return;
      }
      fetchSuppliersForProductOptions(product).then((opts) => {
        if (alive) setOptions(opts);
      });
    } else {
      fetchSupplierOptions("").then((opts) => {
        if (alive) setOptions(opts);
      });
    }
    return () => {
      alive = false;
    };
  }, [scoped, product]);

  const loadOptions = useMemo(
    () =>
      debounce((input: string, cb: (options: Option[]) => void) => {
        if (scoped) {
          // Filter client-side dari supplier milik produk ini.
          const q = input.trim().toLowerCase();
          cb(
            q
              ? options.filter((o) => o.label.toLowerCase().includes(q))
              : options,
          );
        } else {
          fetchSupplierOptions(input)
            .then((opts) => cb(opts))
            .catch(() => cb([]));
        }
      }, scoped ? 200 : 3000),
    [scoped, options],
  );
  useEffect(() => () => loadOptions.cancel(), [loadOptions]);

  const selected = value ? { value, label: label || value } : null;

  return (
    <AsyncSelect
      instanceId={instanceId}
      classNamePrefix="rs"
      placeholder={
        scoped && !product
          ? "Pilih produk dulu…"
          : "Search supplier (name/code)…"
      }
      cacheOptions={!scoped}
      defaultOptions={options}
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

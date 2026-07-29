"use client";

// React-select multiple untuk memilih amenities (fasilitas) — opsi diambil dari
// ReffParameter dengan type "amenities". Nilai yang disimpan = array of id.
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { apiGet } from "@/utils/api";
import {
  AMENITY_REF_TYPE,
  RefParamApiDaum,
  RefParamListResponse,
} from "@/types/refParam";

interface DataProps {
  value: string[];
  onChange: (ids: string[]) => void;
  instanceId?: string;
}

type Opt = { value: string; label: string };

export default function AmenitiesSelect({
  value,
  onChange,
  instanceId = "amenities-select",
}: DataProps) {
  const [refs, setRefs] = useState<RefParamApiDaum[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<RefParamListResponse>(
          "/ref-parameter",
          { type: AMENITY_REF_TYPE, limit: 1000 },
          false,
        );
        setRefs(res.data ?? []);
      } catch {
        setRefs([]);
      }
    })();
  }, []);

  const options: Opt[] = useMemo(
    () => refs.map((r) => ({ value: r._id, label: r.value })),
    [refs],
  );

  // Pertahankan urutan pilihan user; tampilkan label bila opsi sudah termuat.
  const selected: Opt[] = value.map(
    (id) => options.find((o) => o.value === id) ?? { value: id, label: id },
  );

  return (
    <Select
      isMulti
      instanceId={instanceId}
      classNamePrefix="rs"
      placeholder="Select amenities…"
      options={options}
      value={selected}
      onChange={(vals) => onChange((vals as Opt[]).map((v) => v.value))}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={{
        menuPortal: (base: Record<string, unknown>) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  );
}

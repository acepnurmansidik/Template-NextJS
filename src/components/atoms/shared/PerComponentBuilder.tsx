"use client";

// Builder untuk formula tipe PER_COMPONENT ("Per Komponen").
// User menambahkan beberapa KOMPONEN bernama; tiap komponen punya ekspresi &
// pembulatan SENDIRI (memakai FormulaBuilder), dihitung TERPISAH, lalu SELURUH
// hasilnya DIJUMLAHKAN menjadi hasil akhir formula. Total tampil realtime.

import { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  PopulatedComponent,
  FormulaComponentApiDaum,
  FormulaComponentPayload,
} from "@/types/calculatedFormula";
import { refId } from "@/types/componentFormula";
import {
  RoundMode,
  ROUND_MODES,
  roundTo,
  formatResult,
  evaluateExpression,
} from "@/utils/formula";
import FormulaBuilder, {
  BuilderToken,
  builderToPayload,
  builderToCalcTokens,
  apiTokensToBuilder,
  makeUid,
} from "./FormulaBuilder";
import NumberInput from "./NumberInput";
import AccountsSelect, { AccountOption } from "./AccountsSelect";

// Draft satu komponen di dalam form (state lokal modal).
export interface ComponentDraft {
  _uid: string;
  name: string;
  decimalPlace: number;
  rounding: RoundMode;
  tokens: BuilderToken[];
  // ObjectId ComponentFormula yang ditambahkan pada komponen ini ("" = kosong).
  componentLine: string;
  // Akun (Chart of Account) komponen ini — id string.
  accounts: string[];
}

export const makeComponentDraft = (): ComponentDraft => ({
  _uid: makeUid(),
  name: "",
  decimalPlace: 2,
  rounding: "round",
  tokens: [],
  componentLine: "",
  accounts: [],
});

// Draft → payload API.
export const componentDraftToPayload = (
  d: ComponentDraft,
): FormulaComponentPayload => ({
  name: d.name.trim(),
  decimal_place: d.decimalPlace,
  rounding: d.rounding,
  expression: builderToPayload(d.tokens),
  ...(d.componentLine ? { component_line: d.componentLine } : {}),
  accounts: d.accounts,
});

// Komponen ter-populate (API) → draft (untuk modal Update).
export const apiComponentToDraft = (
  c: FormulaComponentApiDaum,
): ComponentDraft => ({
  _uid: makeUid(),
  name: c.name ?? "",
  decimalPlace: c.decimal_place ?? 2,
  rounding: (ROUND_MODES.some((m) => m.value === c.rounding)
    ? c.rounding
    : "round") as RoundMode,
  tokens: apiTokensToBuilder(c.expression),
  componentLine: refId(c.component_line),
  accounts: (c.accounts ?? []).map(refId).filter(Boolean),
});

const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5";
const fieldCls =
  "w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";

interface DataProps {
  components: ComponentDraft[];
  onChange: (next: ComponentDraft[]) => void;
  availableComponents: PopulatedComponent[];
  accountOptions: AccountOption[];
  masterDecimalPlace: number;
  masterRounding?: RoundMode;
  isLoadingComponents?: boolean;
  isLoadingAccounts?: boolean;
}

export default function PerComponentBuilder({
  components,
  onChange,
  availableComponents,
  accountOptions,
  masterDecimalPlace,
  masterRounding = "round",
  isLoadingComponents,
  isLoadingAccounts,
}: DataProps) {
  const patch = (uid: string, next: Partial<ComponentDraft>) =>
    onChange(components.map((c) => (c._uid === uid ? { ...c, ...next } : c)));

  // Saat ekspresi berubah: component_line diisi OTOMATIS (dibalik layar) dari
  // komponen PERTAMA yang ditambahkan; ketika component_line berganti, akun (COA)
  // milik komponen tsb ikut ditambahkan ke accounts baris ini (union).
  const handleTokensChange = (uid: string, nextTokens: BuilderToken[]) => {
    const draft = components.find((c) => c._uid === uid);
    const firstComp = nextTokens.find((t) => t.kind === "component") as
      | Extract<BuilderToken, { kind: "component" }>
      | undefined;
    const lineId = firstComp ? firstComp.component._id : "";

    const next: Partial<ComponentDraft> = { tokens: nextTokens };
    if (lineId !== (draft?.componentLine ?? "")) {
      next.componentLine = lineId;
      if (firstComp) {
        const compAccounts = (firstComp.component.accounts ?? [])
          .map(refId)
          .filter(Boolean);
        next.accounts = Array.from(
          new Set([...(draft?.accounts ?? []), ...compAccounts]),
        );
      }
    }
    patch(uid, next);
  };

  // Nama komponen (ComponentFormula) untuk component_line yang terdeteksi.
  const componentNameById = useMemo(() => {
    const map: Record<string, string> = {};
    availableComponents.forEach((c) => {
      map[c._id] = c.name;
    });
    return map;
  }, [availableComponents]);

  const addComponent = () => onChange([...components, makeComponentDraft()]);

  const removeComponent = (uid: string) =>
    onChange(components.filter((c) => c._uid !== uid));

  // Hitung nilai tiap komponen (independen) + total realtime.
  const { breakdown, total } = useMemo(() => {
    const rows = components.map((c) => {
      const evaln = evaluateExpression(
        builderToCalcTokens(c.tokens),
        c.decimalPlace,
        c.rounding,
      );
      return {
        _uid: c._uid,
        name: c.name,
        ok: evaln.ok,
        value: evaln.ok ? evaln.value : null,
        error: evaln.error,
      };
    });
    const allOk = rows.length > 0 && rows.every((r) => r.ok);
    const sum = allOk
      ? roundTo(
          rows.reduce((acc, r) => acc + (r.value ?? 0), 0),
          masterDecimalPlace,
          masterRounding,
        )
      : null;
    return { breakdown: rows, total: sum };
  }, [components, masterDecimalPlace, masterRounding]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            Komponen Formula
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Tiap komponen dihitung terpisah (punya pembulatan sendiri), lalu
            semua hasilnya dijumlahkan.
          </p>
        </div>
        <button
          type="button"
          onClick={addComponent}
          className="h-9 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-3 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <FaPlus size={11} /> Add Component
        </button>
      </div>

      {components.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/40 p-8 text-center">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Belum ada komponen. Klik <b>Add Component</b> untuk menambah komponen
            perhitungan pertama.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {components.map((c, index) => {
            const row = breakdown.find((b) => b._uid === c._uid);
            return (
              <div
                key={c._uid}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/30 p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-black shrink-0">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeComponent(c._uid)}
                    className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Hapus komponen"
                    aria-label="Hapus komponen"
                  >
                    <FaTrash size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>
                      Nama Komponen<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={c.name}
                      onChange={(e) => patch(c._uid, { name: e.target.value })}
                      placeholder="e.g. Penghasilan"
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Decimal Place</label>
                    <NumberInput
                      value={c.decimalPlace}
                      onChange={(v) => patch(c._uid, { decimalPlace: v })}
                      integer
                      aria-label={`Decimal place komponen ${index + 1}`}
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Pembulatan</label>
                    <select
                      value={c.rounding}
                      onChange={(e) =>
                        patch(c._uid, { rounding: e.target.value as RoundMode })
                      }
                      aria-label={`Arah pembulatan komponen ${index + 1}`}
                      className={`${fieldCls} cursor-pointer`}
                    >
                      {ROUND_MODES.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Accounts komponen (Component Line diisi otomatis di balik layar) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`${labelCls} mb-0`}>Accounts</label>
                    {c.componentLine && (
                      <span className="text-[10px] text-zinc-400">
                        Component line:{" "}
                        <b className="text-zinc-500 dark:text-zinc-300">
                          {componentNameById[c.componentLine] ?? "—"}
                        </b>{" "}
                        (otomatis)
                      </span>
                    )}
                  </div>
                  <AccountsSelect
                    instanceId={`per-comp-accounts-${c._uid}`}
                    value={c.accounts}
                    onChange={(ids) => patch(c._uid, { accounts: ids })}
                    options={accountOptions}
                    isLoading={isLoadingAccounts}
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Akun ikut terisi otomatis dari komponen pertama yang
                    ditambahkan; masih bisa ditambah/dikurangi manual.
                  </p>
                </div>

                <FormulaBuilder
                  tokens={c.tokens}
                  onChange={(next) => handleTokensChange(c._uid, next)}
                  availableComponents={availableComponents}
                  decimalPlace={c.decimalPlace}
                  rounding={c.rounding}
                  isLoadingComponents={isLoadingComponents}
                />

                {/* Subtotal komponen ini */}
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Subtotal
                  </span>
                  {row?.ok ? (
                    <span className="font-black text-blue-600 dark:text-blue-300 tabular-nums">
                      {formatResult(row.value ?? 0, c.decimalPlace, c.rounding)}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 dark:text-red-400">
                      {c.tokens.length === 0 ? "—" : row?.error}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GRAND TOTAL (jumlah semua komponen) */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
          total !== null
            ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30"
            : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/30"
        }`}
      >
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Total (jumlah semua komponen)
          </span>
          <span className="text-[11px] text-zinc-400">
            Dibulatkan ke {masterDecimalPlace} desimal (hasil akhir).
          </span>
        </div>
        {total !== null ? (
          <span className="text-2xl font-black text-blue-600 dark:text-blue-300 tabular-nums">
            {formatResult(total, masterDecimalPlace, masterRounding)}
          </span>
        ) : (
          <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
            {components.length === 0 ? "—" : "Lengkapi semua komponen"}
          </span>
        )}
      </div>
    </div>
  );
}

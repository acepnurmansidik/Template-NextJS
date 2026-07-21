"use client";

// Builder ekspresi formula (token-based) dengan drag-and-drop.
// Token: component / constant / operator (+ − × ÷) / paren ( ).
// Mendukung prioritas operator & pengelompokan kurung (aturan matematika).
// Preview hasil dihitung realtime + validasi struktur ekspresi.

import { useMemo, useState } from "react";
import Select from "react-select";
import { FaGripVertical, FaTimes, FaPlus, FaEraser, FaUndo } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PopulatedComponent,
  ExpressionToken,
  ExpressionTokenPayload,
  isPopulatedComponent,
} from "@/types/calculatedFormula";
import {
  CalcToken,
  RoundMode,
  ROUND_MODES,
  applyOp,
  EXTERNAL_X_PREVIEW,
  evaluateExpression,
  getComponentRate,
  formatRate,
  formatResult,
} from "@/utils/formula";
import NumberInput from "./NumberInput";
import CurrencyInput from "./CurrencyInput";

// Konstanta angka pada formula ditampilkan berformat currency (grup ribuan,
// gaya en-US agar konsisten dgn preview formatRate) — boleh negatif & desimal.
const NUM_MAX_DECIMALS = 6;

export type BuilderToken =
  // xOperator hanya dipakai bila component.rate_type === "EXTERNAL":
  // operand = x {xOperator} rate (x = target koleksi lain; preview pakai 0).
  | {
      _uid: string;
      kind: "component";
      component: PopulatedComponent;
      xOperator?: string;
    }
  | { _uid: string; kind: "constant"; value: number }
  | { _uid: string; kind: "operator"; operator: string }
  // decimalPlace & rounding hanya dipakai pada "(" (pembulatan grup ini).
  | {
      _uid: string;
      kind: "paren";
      paren: "(" | ")";
      decimalPlace?: number;
      rounding?: RoundMode;
    };

type Option = { value: string; label: string };

const OPERATOR_OPTIONS = [
  { value: "+", symbol: "+" },
  { value: "-", symbol: "−" },
  { value: "*", symbol: "×" },
  { value: "/", symbol: "÷" },
];

const operatorSymbol = (op: string) =>
  OPERATOR_OPTIONS.find((o) => o.value === op)?.symbol ?? op;

const selectStyles = {
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};

export const makeUid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `uid_${Math.random().toString(36).slice(2)}`;

// Apakah komponen bertipe EXTERNAL (digabung dgn nilai luar x di formula).
const isExternalComponent = (c: PopulatedComponent): boolean =>
  String(c.rate_type ?? "").toUpperCase() === "EXTERNAL";

// ---- Konversi builder <-> API/eval ----
export const builderToPayload = (
  tokens: BuilderToken[],
): ExpressionTokenPayload[] =>
  tokens.map((t) => {
    switch (t.kind) {
      case "component":
        return {
          type: "component",
          component: t.component._id,
          // Operator x hanya relevan utk komponen EXTERNAL.
          ...(isExternalComponent(t.component)
            ? { x_operator: t.xOperator ?? "+" }
            : {}),
        };
      case "constant":
        return { type: "constant", value: t.value };
      case "operator":
        return { type: "operator", operator: t.operator };
      case "paren":
        return t.paren === "("
          ? {
              type: "paren",
              paren: t.paren,
              ...(Number.isInteger(t.decimalPlace)
                ? { decimal_place: t.decimalPlace }
                : {}),
              ...(t.rounding ? { rounding: t.rounding } : {}),
            }
          : { type: "paren", paren: t.paren };
    }
  });

export const builderToCalcTokens = (tokens: BuilderToken[]): CalcToken[] =>
  tokens.map((t) => {
    if (t.kind === "component") {
      const rate = getComponentRate(t.component);
      return {
        type: "operand",
        value: isExternalComponent(t.component)
          ? applyOp(EXTERNAL_X_PREVIEW, t.xOperator ?? "+", rate)
          : rate,
      };
    }
    if (t.kind === "constant") return { type: "operand", value: t.value };
    if (t.kind === "operator")
      return { type: "operator", operator: t.operator };
    return {
      type: "paren",
      paren: t.paren,
      decimalPlace: t.decimalPlace,
      rounding: t.rounding,
    };
  });

export const apiTokensToBuilder = (
  tokens: ExpressionToken[] | undefined,
): BuilderToken[] =>
  (tokens ?? [])
    .map((t): BuilderToken | null => {
      if (t.type === "component" && isPopulatedComponent(t.component))
        return {
          _uid: makeUid(),
          kind: "component",
          component: t.component,
          xOperator: t.x_operator,
        };
      if (t.type === "constant")
        return { _uid: makeUid(), kind: "constant", value: Number(t.value ?? 0) };
      if (t.type === "operator")
        return { _uid: makeUid(), kind: "operator", operator: t.operator ?? "+" };
      if (t.type === "paren")
        return {
          _uid: makeUid(),
          kind: "paren",
          paren: (t.paren ?? "(") as "(" | ")",
          decimalPlace: Number.isInteger(t.decimal_place)
            ? t.decimal_place
            : undefined,
          rounding: (ROUND_MODES.some((m) => m.value === t.rounding)
            ? t.rounding
            : undefined) as RoundMode | undefined,
        };
      return null;
    })
    .filter((t): t is BuilderToken => t !== null);

const tokenLabel = (t: BuilderToken): string => {
  switch (t.kind) {
    case "component":
      // EXTERNAL tampil sbg "x {op} rate" (mis. "x + 3.2"); lainnya nama komponen.
      return isExternalComponent(t.component)
        ? `x ${t.xOperator ?? "+"} ${formatRate(
            getComponentRate(t.component),
            t.component.decimal_place,
          )}`
        : t.component.name;
    case "constant":
      return t.value.toLocaleString("en-US", { maximumFractionDigits: 6 });
    case "operator":
      return operatorSymbol(t.operator);
    case "paren":
      return t.paren;
  }
};

// ============================ TOKEN (SORTABLE) ============================
function SortableToken({
  token,
  onOperatorChange,
  onConstantChange,
  onParenDecimalChange,
  onParenRoundingChange,
  onComponentXOperatorChange,
  onRemove,
}: {
  token: BuilderToken;
  onOperatorChange: (uid: string, operator: string) => void;
  onConstantChange: (uid: string, value: number) => void;
  onParenDecimalChange: (uid: string, value: number) => void;
  onParenRoundingChange: (uid: string, rounding: RoundMode) => void;
  onComponentXOperatorChange: (uid: string, operator: string) => void;
  onRemove: (uid: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: token._uid });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  // Warna per jenis token.
  const tone =
    token.kind === "operator"
      ? "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
      : token.kind === "paren"
        ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30"
        : token.kind === "constant"
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 rounded-lg border pl-1.5 pr-1.5 py-1.5 shadow-sm ${tone} ${
        isDragging ? "ring-2 ring-blue-200 dark:ring-blue-900" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 touch-none"
        aria-label="Drag untuk mengurutkan"
        {...attributes}
        {...listeners}
      >
        <FaGripVertical size={11} />
      </button>

      {token.kind === "component" &&
        (isExternalComponent(token.component) ? (
          // EXTERNAL: "x {operator} rate" — operator dipilih di sini.
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-zinc-500 dark:text-zinc-300">
              x
            </span>
            <select
              value={token.xOperator ?? "+"}
              onChange={(e) =>
                onComponentXOperatorChange(token._uid, e.target.value)
              }
              aria-label="Operator x"
              title="Operator penggabung x dengan rate"
              className="h-8 w-11 text-center text-base font-bold rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
            >
              {OPERATOR_OPTIONS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.symbol}
                </option>
              ))}
            </select>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {formatRate(
                  getComponentRate(token.component),
                  token.component.decimal_place,
                )}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {token.component.name} · EXTERNAL
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {token.component.name}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {token.component.rate_type} ·{" "}
              {formatRate(
                getComponentRate(token.component),
                token.component.decimal_place,
              )}
            </span>
          </div>
        ))}

      {token.kind === "constant" && (
        <CurrencyInput
          value={token.value}
          onChange={(v) => onConstantChange(token._uid, v)}
          allowNegative
          maxDecimals={NUM_MAX_DECIMALS}
          groupSeparator=","
          decimalSeparator="."
          aria-label="Nilai konstanta"
          className="w-28 bg-white dark:bg-zinc-900 px-2 py-1 border border-emerald-200 dark:border-emerald-800 rounded-md text-sm font-semibold text-emerald-700 dark:text-emerald-300 outline-none focus:border-emerald-500 text-right"
        />
      )}

      {token.kind === "operator" && (
        <select
          value={token.operator}
          onChange={(e) => onOperatorChange(token._uid, e.target.value)}
          className="h-8 w-11 text-center text-base font-bold rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
          aria-label="Operator"
        >
          {OPERATOR_OPTIONS.map((op) => (
            <option key={op.value} value={op.value}>
              {op.symbol}
            </option>
          ))}
        </select>
      )}

      {token.kind === "paren" && (
        <div className="flex items-center gap-1">
          <span className="px-1 text-lg font-black text-amber-600 dark:text-amber-400 select-none">
            {token.paren}
          </span>
          {token.paren === "(" && (
            <div className="flex items-center gap-1.5">
              <select
                value={token.rounding ?? "round"}
                onChange={(e) =>
                  onParenRoundingChange(token._uid, e.target.value as RoundMode)
                }
                aria-label="Arah pembulatan kurung"
                title="Arah pembulatan hasil kurung ini"
                className="h-7 rounded-md border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-900 text-[11px] font-semibold text-amber-700 dark:text-amber-300 outline-none focus:border-amber-500 cursor-pointer px-1"
              >
                {ROUND_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {(token.rounding ?? "round") !== "none" && (
                <label
                  className="flex items-center gap-1"
                  title="Angka di belakang koma untuk hasil kurung ini"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wide text-amber-500/80">
                    dp
                  </span>
                  <NumberInput
                    value={token.decimalPlace ?? 0}
                    onChange={(v) =>
                      onParenDecimalChange(
                        token._uid,
                        Math.max(0, Math.trunc(v)),
                      )
                    }
                    aria-label="Decimal place kurung"
                    className="w-12 bg-white dark:bg-zinc-900 px-1.5 py-1 border border-amber-200 dark:border-amber-800 rounded-md text-xs font-semibold text-amber-700 dark:text-amber-300 outline-none focus:border-amber-500 text-center"
                  />
                </label>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(token._uid)}
        className="ml-0.5 text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        aria-label="Hapus token"
      >
        <FaTimes size={11} />
      </button>
    </div>
  );
}

// ============================ BUILDER ============================
interface DataProps {
  tokens: BuilderToken[];
  onChange: (next: BuilderToken[]) => void;
  availableComponents: PopulatedComponent[];
  decimalPlace: number;
  rounding?: RoundMode; // arah pembulatan hasil akhir (untuk preview)
  isLoadingComponents?: boolean;
}

export default function FormulaBuilder({
  tokens,
  onChange,
  availableComponents,
  decimalPlace,
  rounding = "round",
  isLoadingComponents,
}: DataProps) {
  const [pendingComponent, setPendingComponent] = useState<Option | null>(null);
  const [pendingConstant, setPendingConstant] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const componentOptions: Option[] = useMemo(
    () =>
      availableComponents.map((c) => ({
        value: c._id,
        label: `${c.name} (${formatRate(getComponentRate(c), c.decimal_place)})`,
      })),
    [availableComponents],
  );

  const append = (token: BuilderToken) => onChange([...tokens, token]);

  const handleAddComponent = () => {
    if (!pendingComponent) return;
    const component = availableComponents.find(
      (c) => c._id === pendingComponent.value,
    );
    if (!component) return;
    append({
      _uid: makeUid(),
      kind: "component",
      component,
      // Komponen EXTERNAL default operator "+" (x + rate).
      ...(isExternalComponent(component) ? { xOperator: "+" } : {}),
    });
    setPendingComponent(null);
  };

  const handleAddConstant = () => {
    append({ _uid: makeUid(), kind: "constant", value: pendingConstant });
    setPendingConstant(0);
  };

  const handleAddOperator = (operator: string) =>
    append({ _uid: makeUid(), kind: "operator", operator });

  const handleAddParen = (paren: "(" | ")") =>
    append(
      paren === "("
        ? {
            _uid: makeUid(),
            kind: "paren",
            paren,
            decimalPlace: decimalPlace,
            rounding: "round",
          }
        : { _uid: makeUid(), kind: "paren", paren },
    );

  const handleOperatorChange = (uid: string, operator: string) =>
    onChange(
      tokens.map((t) =>
        t._uid === uid && t.kind === "operator" ? { ...t, operator } : t,
      ),
    );

  const handleConstantChange = (uid: string, value: number) =>
    onChange(
      tokens.map((t) =>
        t._uid === uid && t.kind === "constant" ? { ...t, value } : t,
      ),
    );

  const handleParenDecimalChange = (uid: string, value: number) =>
    onChange(
      tokens.map((t) =>
        t._uid === uid && t.kind === "paren" && t.paren === "("
          ? { ...t, decimalPlace: value }
          : t,
      ),
    );

  const handleParenRoundingChange = (uid: string, mode: RoundMode) =>
    onChange(
      tokens.map((t) =>
        t._uid === uid && t.kind === "paren" && t.paren === "("
          ? { ...t, rounding: mode }
          : t,
      ),
    );

  const handleComponentXOperatorChange = (uid: string, operator: string) =>
    onChange(
      tokens.map((t) =>
        t._uid === uid && t.kind === "component" ? { ...t, xOperator: operator } : t,
      ),
    );

  const handleRemove = (uid: string) =>
    onChange(tokens.filter((t) => t._uid !== uid));

  const handleRemoveLast = () => onChange(tokens.slice(0, -1));

  const handleClear = () => onChange([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tokens.findIndex((t) => t._uid === active.id);
    const newIndex = tokens.findIndex((t) => t._uid === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(tokens, oldIndex, newIndex));
  };

  const evaluation = useMemo(
    () => evaluateExpression(builderToCalcTokens(tokens), decimalPlace, rounding),
    [tokens, decimalPlace, rounding],
  );

  const toolbarBtn =
    "h-9 px-3 flex items-center justify-center gap-1.5 text-sm font-bold rounded-lg border transition-colors";

  return (
    <div className="space-y-4">
      {/* ---- Toolbar operand ---- */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Component
            </label>
            <Select
              instanceId="formula-builder-component"
              classNamePrefix="rs"
              options={componentOptions}
              value={pendingComponent}
              onChange={(opt) => setPendingComponent(opt as Option | null)}
              placeholder={
                isLoadingComponents ? "Loading..." : "Pilih komponen..."
              }
              isLoading={isLoadingComponents}
              isDisabled={isLoadingComponents}
              noOptionsMessage={() => "Tidak ada komponen tersedia"}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              styles={selectStyles}
            />
          </div>
          <button
            type="button"
            onClick={handleAddComponent}
            disabled={!pendingComponent}
            className="h-[38px] px-4 flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus size={11} /> Component
          </button>

          <div className="w-px self-stretch bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Number
            </label>
            <CurrencyInput
              value={pendingConstant}
              onChange={setPendingConstant}
              allowNegative
              maxDecimals={NUM_MAX_DECIMALS}
              groupSeparator=","
              decimalSeparator="."
              aria-label="Konstanta"
              className="w-32 bg-white dark:bg-zinc-950 p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100 text-right"
            />
          </div>
          <button
            type="button"
            onClick={handleAddConstant}
            className="h-[38px] px-4 flex items-center justify-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            <FaPlus size={11} /> Number
          </button>
        </div>

        {/* ---- Toolbar operator & kurung ---- */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {OPERATOR_OPTIONS.map((op) => (
            <button
              key={op.value}
              type="button"
              onClick={() => handleAddOperator(op.value)}
              className={`${toolbarBtn} w-10 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/40`}
            >
              {op.symbol}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleAddParen("(")}
            className={`${toolbarBtn} w-10 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-amber-950/40`}
          >
            (
          </button>
          <button
            type="button"
            onClick={() => handleAddParen(")")}
            className={`${toolbarBtn} w-10 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-white dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-amber-950/40`}
          >
            )
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleRemoveLast}
            disabled={tokens.length === 0}
            className={`${toolbarBtn} border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <FaUndo size={11} /> Undo
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={tokens.length === 0}
            className={`${toolbarBtn} border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <FaEraser size={11} /> Clear
          </button>
        </div>
      </div>

      {/* ---- Canvas drag-and-drop ---- */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
          Expression (drag untuk mengurutkan)
        </label>
        <div className="min-h-[92px] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/40 p-4">
          {tokens.length === 0 ? (
            <div className="h-full flex items-center justify-center py-6 text-center">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Susun ekspresi dari component, angka, operator (+ − × ÷) dan
                kurung ( ). Contoh: ( A + B ) × 0.5
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tokens.map((t) => t._uid)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {tokens.map((token) => (
                    <SortableToken
                      key={token._uid}
                      token={token}
                      onOperatorChange={handleOperatorChange}
                      onConstantChange={handleConstantChange}
                      onParenDecimalChange={handleParenDecimalChange}
                      onParenRoundingChange={handleParenRoundingChange}
                      onComponentXOperatorChange={handleComponentXOperatorChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-zinc-400">
          Prioritas: × ÷ sebelum + −. Isi kurung dihitung lebih dulu; tiap
          &ldquo;(&rdquo; punya <b>dp</b> &amp; arah pembulatan sendiri (ke
          atas / ke bawah / tanpa pembulatan). Hasil akhir dibulatkan ke{" "}
          {decimalPlace} angka di belakang koma.
        </p>
      </div>

      {/* ---- Preview ---- */}
      <div
        className={`rounded-xl border p-4 ${
          tokens.length === 0
            ? "border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/30"
            : evaluation.ok
              ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30"
              : "border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30"
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            {tokens.length === 0 ? (
              <span className="text-zinc-400 dark:text-zinc-500 italic">
                Preview hasil akan tampil di sini.
              </span>
            ) : (
              tokens.map((t) => (
                <span
                  key={t._uid}
                  className={`rounded-md px-2 py-0.5 border ${
                    t.kind === "operator"
                      ? "border-transparent font-bold text-blue-500 dark:text-blue-400"
                      : t.kind === "paren"
                        ? "border-transparent font-black text-amber-500 dark:text-amber-400"
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {tokenLabel(t)}
                </span>
              ))
            )}
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Result
            </span>
            {evaluation.ok ? (
              <span className="text-2xl font-black text-blue-600 dark:text-blue-300 tabular-nums">
                {formatResult(evaluation.value, decimalPlace, rounding)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                {tokens.length === 0 ? "—" : evaluation.error}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

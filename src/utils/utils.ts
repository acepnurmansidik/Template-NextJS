// Format khusus untuk field "name" module: selalu UPPERCASE dan setiap
// spasi (termasuk beruntun / tab) diubah menjadi underscore.

import { AccountType, NormalBalance } from "@/types/chartOfAccount";

// Contoh: "user access" -> "USER_ACCESS"
export const formatModuleName = (value: string): string =>
  value.toUpperCase().replace(/\s+/g, "_");

// Kelas warna badge per tipe akun (light + dark).
export const TYPE_BADGE: Record<AccountType, string> = {
  [AccountType.ASSET]:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  [AccountType.LIABILITY]:
    "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  [AccountType.EQUITY]:
    "border-violet-300 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  [AccountType.REVENUE]:
    "border-sky-300 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  [AccountType.EXPENSE]:
    "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  [AccountType.CAPITAL]:
    "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700",
  [AccountType.SALES]:
    "border-cyan-300 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
  [AccountType.COGS]:
    "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  [AccountType.OTHER_INCOME_EXPENSE]:
    "border-teal-300 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
  [AccountType.ADM_OPERATION_EXPENSE]:
    "border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
  [AccountType.DEPRECIATION_AMORTIZATION]:
    "border-lime-300 bg-lime-50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700",
  [AccountType.OTHERS]:
    "border-slate-300 bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-600",
};

export const BALANCE_BADGE: Record<NormalBalance, string> = {
  [NormalBalance.DEBIT]:
    "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  [NormalBalance.CREDIT]:
    "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
};

// Badge warna status dokumen AR/AP (dipakai bersama; di-key oleh string status).
export const STATUS_BADGE: Record<string, string> = {
  DRAFT:
    "border-zinc-300 bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600",
  OPEN: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  PARTIAL:
    "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  PAID: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  WRITE_OFF:
    "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
};

export const CHART_COLORS = [
  "#3B82F6", // Blue-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#8B5CF6", // Violet-500
  "#EC4899", // Pink-500
  "#06B6D4", // Cyan-500
  "#F97316", // Orange-500
  "#6366F1", // Indigo-500
  "#14B8A6", // Teal-500
  "#84CC16", // Lime-500
  "#D946EF", // Fuchsia-500
  "#64748B", // Slate-500
  "#A855F7", // Purple-500
  "#E11D48", // Rose-500
  "#0EA5E9", // Sky-500
  "#22C55E", // Green-500
  "#EAB308", // Yellow-500
  "#6B7280", // Gray-500
  "#7C3AED", // Violet-600
];

export const TAILWIND_CSS =
  "w-full bg-white dark:bg-zinc-950 transition-all dark:text-zinc-100 duration-200 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none overflow-hidden";
export const TAG_HTML = ["input", "/input", "textarea", "/textarea"];
export const ATRIBUTE_HTML = [
  "type",
  "value",
  "onChange",
  "onWheel",
  "placeholder",
  "className",
  "rows",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "key",
  "isMulti",
  "id",
  "instanceId",
  "classNamePrefix",
  "options",
  "isValidNewOption",
  "formatCreateLabel",
  "sensors",
  "collisionDetection",
  "onDragStart",
  "onDragEnd",
];

export interface ActionDefaultOption {
  value: string;
  label: string;
}

export const actionDefaultOptions: ActionDefaultOption[] = [
  { value: "pdf", label: "pdf" },
  { value: "view", label: "view" },
  { value: "create", label: "create" },
  { value: "update", label: "update" },
  { value: "delete", label: "delete" },
  { value: "export", label: "export" },
  { value: "import", label: "import" },
  { value: "whatsapp", label: "whatsapp" },
];

export const subActionDefaultOptions: ActionDefaultOption[] = [
  { value: "pdf", label: "pdf" },
  { value: "view", label: "view" },
  { value: "create", label: "create" },
  { value: "update", label: "update" },
  { value: "delete", label: "delete" },
  { value: "export", label: "export" },
  { value: "import", label: "import" },
  { value: "whatsapp", label: "whatsapp" },
];

// Format angka ke tampilan mata uang (tanpa simbol) — 1500000 → "1.500.000".
export const formatAmount = (n: number): string =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0,
  );

// Jumlahkan nominal seluruh baris (round 2 desimal).
export const sumAmount = (lines: { amount: number }[]): number => {
  const total = lines.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
  return Math.round(total * 100) / 100;
};

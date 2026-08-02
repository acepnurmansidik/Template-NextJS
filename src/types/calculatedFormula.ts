// Tipe mirror endpoint /api/v1/calculated-formula (backend Codebase-NoSQL).
//
// Model baru: ekspresi = deretan TOKEN yang mendukung prioritas operator
// (× ÷ sebelum + −) dan pengelompokan tanda kurung.

import { RateType, AccountRef } from "./componentFormula";
// Import type-only (dipakai hanya untuk hint) — hindari siklus runtime dgn
// utils/formula yang juga mengimpor tipe dari file ini.
import type { RoundMode as FormulaRoundMode } from "@/utils/formula";

export enum FormulaOperator {
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DIVIDE = "/",
}

export enum TokenType {
  COMPONENT = "component",
  CONSTANT = "constant",
  OPERATOR = "operator",
  PAREN = "paren",
}

// Tipe perhitungan formula:
//  - SINGLE        : "Ekspresi Tunggal" — satu ekspresi utuh (logika lama).
//  - PER_COMPONENT : "Per Komponen" — beberapa komponen bernama, tiap komponen
//                    dihitung TERPISAH (punya ekspresi & pembulatan sendiri),
//                    lalu SEMUA hasil komponen DIJUMLAHKAN.
export enum CalcType {
  SINGLE = "SINGLE",
  PER_COMPONENT = "PER_COMPONENT",
}

export const CALC_TYPE_LABEL: Record<CalcType, string> = {
  [CalcType.SINGLE]: "Ekspresi Tunggal",
  [CalcType.PER_COMPONENT]: "Per Komponen",
};

// Menentukan ke akun mana nilai formula di-assign:
//  - FORMULA_COMPONENT : akun yang di-set pada formula ini (accounts formula /
//                        accounts tiap komponen formula).
//  - COMPONENT_DETAIL  : akun tiap ComponentFormula detail (di-set di koleksi
//                        Component Formula).
export enum AccountAssignment {
  FORMULA_COMPONENT = "FORMULA_COMPONENT",
  COMPONENT_DETAIL = "COMPONENT_DETAIL",
}

export const ACCOUNT_ASSIGNMENT_LABEL: Record<AccountAssignment, string> = {
  [AccountAssignment.FORMULA_COMPONENT]: "Akun komponen formula",
  [AccountAssignment.COMPONENT_DETAIL]: "Akun detail tiap komponen",
};

// Arah pembulatan hasil (tiap kurung & hasil akhir).
export enum RoundMode {
  ROUND = "round", // ke terdekat
  UP = "up", // ke atas
  DOWN = "down", // ke bawah
  NONE = "none", // nilai asli (tanpa pembulatan)
}

// Bentuk komponen ter-populate pada GET list (backend .populate select:
// "name slug rate_type fixed_rate calculated_rate decimal_place").
export interface PopulatedComponent {
  _id: string;
  name: string;
  slug?: string;
  rate_type: RateType;
  fixed_rate: number;
  calculated_rate: number;
  decimal_place: number;
  // Akun (COA) komponen ini — tersedia dari GET /component-formula, dipakai
  // untuk auto-isi accounts baris per-komponen saat komponen ditambahkan.
  accounts?: AccountRef[];
}

// Satu token ekspresi. `component` ter-populate di GET list, hanya id string
// pada response create/update.
export interface ExpressionToken {
  type: TokenType | string;
  component?: PopulatedComponent | string;
  value?: number; // untuk constant
  operator?: string; // + - * /
  paren?: "(" | ")";
  // Khusus paren "(" : pembulatan hasil grup kurung ini (dinamis per kurung).
  decimal_place?: number;
  rounding?: RoundMode | string; // arah pembulatan grup kurung ini
  // Khusus token component EXTERNAL: operator penggabung nilai luar "x" dengan
  // rate komponen (default "+"). Tampilan: "x {x_operator} rate".
  x_operator?: string;
}

// Token pada payload create/update (component = id string).
export interface ExpressionTokenPayload {
  type: string;
  component?: string;
  value?: number;
  operator?: string;
  paren?: "(" | ")";
  // Khusus paren "(" : pembulatan hasil grup kurung ini (dinamis per kurung).
  decimal_place?: number;
  rounding?: RoundMode | string; // arah pembulatan grup kurung ini
  // Khusus token component EXTERNAL (lihat ExpressionToken).
  x_operator?: string;
}

// PER_COMPONENT: satu komponen formula pada payload create/update.
export interface FormulaComponentPayload {
  name: string;
  decimal_place: number;
  rounding: RoundMode | string; // pembulatan hasil KOMPONEN ini (independen)
  expression: ExpressionTokenPayload[];
  // ObjectId ComponentFormula yang ditambahkan pada komponen ini (opsional).
  component_line?: string;
  // Akun (Chart of Account) komponen ini — id string.
  accounts?: string[];
}

// PER_COMPONENT: satu komponen formula ter-populate dari GET list.
export interface FormulaComponentApiDaum {
  _id: string;
  name: string;
  calculated_formula_id?: string;
  expression: ExpressionToken[];
  decimal_place: number;
  rounding?: RoundMode | string;
  order?: number;
  component_line?: AccountRef; // ref ComponentFormula (id / objek)
  accounts?: AccountRef[];
  created_at?: string;
  updated_at?: string;
}

// Field scalar header form. Susunan token ekspresi (`tokens`) & daftar komponen
// PER_COMPONENT (`perComponents`) dinamis → tetap dikelola state terpisah.
export interface FormDataCalculatedFormulaProps {
  name: string;
  calc_type: CalcType;
  decimal_place: number;
  rounding: FormulaRoundMode;
  // Akun hasil akhir (multi-select) — id string.
  accounts: string[];
  account_assignment: AccountAssignment;
}

export interface CalculatedFormulaForm {
  name: string;
  calc_type: CalcType | string;
  decimal_place: number;
  rounding: RoundMode | string; // arah pembulatan hasil akhir
  // Akun HASIL AKHIR (berlaku utk kedua tipe).
  accounts: string[];
  // Jenis assign akun (ke akun formula, atau akun detail tiap komponen).
  account_assignment: AccountAssignment | string;
  // Dipakai saat calc_type === SINGLE.
  expression: ExpressionTokenPayload[];
  // Dipakai saat calc_type === PER_COMPONENT.
  components?: FormulaComponentPayload[];
}

export interface CalculatedFormulaApiDaum {
  _id: string;
  name: string;
  slug?: string;
  calc_type?: CalcType | string; // default SINGLE bila tak ada (data lama)
  expression: ExpressionToken[];
  // Komponen ter-populate saat calc_type === PER_COMPONENT.
  components?: FormulaComponentApiDaum[];
  // Akun hasil akhir (ter-populate).
  accounts?: AccountRef[];
  account_assignment?: AccountAssignment | string;
  decimal_place: number;
  rounding?: RoundMode | string; // arah pembulatan hasil akhir
  // Catatan: hasil hitung TIDAK disimpan di backend (model hanya menyimpan
  // definisi formula). Hasil dihitung dinamis di client dari `expression`.
  created_at?: string;
  updated_at?: string;
}

// Helper: cek apakah nilai adalah komponen ter-populate (object) atau id.
export const isPopulatedComponent = (
  value: PopulatedComponent | string | undefined,
): value is PopulatedComponent =>
  typeof value === "object" && value !== null && "_id" in value;

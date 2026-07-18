// Tipe mirror endpoint /api/v1/calculated-formula (backend Codebase-NoSQL).
//
// Model baru: ekspresi = deretan TOKEN yang mendukung prioritas operator
// (× ÷ sebelum + −) dan pengelompokan tanda kurung.

import { RateType } from "./componentFormula";

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
}

export interface CalculatedFormulaForm {
  name: string;
  decimal_place: number;
  rounding: RoundMode | string; // arah pembulatan hasil akhir
  expression: ExpressionTokenPayload[];
}

export interface CalculatedFormulaApiDaum {
  _id: string;
  name: string;
  slug?: string;
  expression: ExpressionToken[];
  decimal_place: number;
  rounding?: RoundMode | string; // arah pembulatan hasil akhir
  // Catatan: hasil hitung TIDAK disimpan di backend (model hanya menyimpan
  // definisi formula). Hasil dihitung dinamis di client dari `expression`.
  created_at?: string;
  updated_at?: string;
}

export interface BodyCalculatedFormulaResponseApiDaum {
  success: boolean;
  message: string;
  code?: number;
  data: CalculatedFormulaApiDaum[];
  page_size?: number;
  current_page?: number;
}

export interface SingleCalculatedFormulaResponseApiDaum {
  success: boolean;
  message: string;
  code?: number;
  data?: CalculatedFormulaApiDaum;
}

// Helper: cek apakah nilai adalah komponen ter-populate (object) atau id.
export const isPopulatedComponent = (
  value: PopulatedComponent | string | undefined,
): value is PopulatedComponent =>
  typeof value === "object" && value !== null && "_id" in value;

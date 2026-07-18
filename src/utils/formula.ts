import type { ExpressionToken } from "@/types/calculatedFormula";
import { isPopulatedComponent } from "@/types/calculatedFormula";

// Helper perhitungan formula — MIRROR persis logika backend
// (resource/app/controller/CalculatedFormula.controller.js).
//
// Model baru: ekspresi berupa deretan TOKEN (component / constant / operator /
// paren) yang dievaluasi memakai shunting-yard sehingga mendukung:
// - prioritas operator (× ÷ sebelum + −),
// - pengelompokan tanda kurung ( ),
// - pembulatan "tiap grup kurung + akhir": hasil tiap ( ) dibulatkan ke
//   decimal_place SENDIRI (dinamis, ditetapkan pada tiap "(") sebelum dipakai
//   lanjut; bila "(" tak punya decimal_place, jatuh ke decimal_place formula.
//   Hasil akhir dibulatkan ke decimal_place formula.
// - arah pembulatan (RoundMode) juga per-kurung & untuk hasil akhir:
//   terdekat / ke atas / ke bawah / tanpa pembulatan (nilai asli).

export type RateLike = {
  rate_type?: string;
  fixed_rate?: number;
  calculated_rate?: number;
  decimal_place?: number;
};

// Prioritas operator (ala matematika).
const PRECEDENCE: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

// Arah pembulatan:
//  - "round" : ke terdekat (perilaku default, kompatibel dgn data lama)
//  - "up"    : dibulatkan ke atas (ceil)
//  - "down"  : dibulatkan ke bawah (floor)
//  - "none"  : TIDAK dibulatkan sama sekali (nilai asli)
export type RoundMode = "round" | "up" | "down" | "none";

export const ROUND_MODES: { value: RoundMode; label: string }[] = [
  { value: "round", label: "Normal (terdekat)" },
  { value: "up", label: "Ke atas" },
  { value: "down", label: "Ke bawah" },
  { value: "none", label: "Tanpa pembulatan" },
];

const isRoundMode = (v: unknown): v is RoundMode =>
  v === "round" || v === "up" || v === "down" || v === "none";

// Bulatkan `num` ke `dp` desimal dengan arah `mode`.
// - "none" mengembalikan nilai asli (tanpa pembulatan).
// - dp fallback ke 2 bila bukan integer >= 0.
export const roundTo = (
  num: number,
  dp: number,
  mode: RoundMode = "round",
): number => {
  const value = Number(num);
  if (Number.isNaN(value)) return 0;
  if (mode === "none") return value;
  const safeDp = Number.isInteger(dp) && dp >= 0 ? dp : 2;
  if (mode === "up" || mode === "down") {
    const factor = 10 ** safeDp;
    // toPrecision(12) meredam galat biner (mis. 1.005*100 = 100.4999…)
    // sebelum ceil/floor agar hasilnya sesuai ekspektasi desimal.
    const scaled = Number((value * factor).toPrecision(12));
    const rounded = mode === "up" ? Math.ceil(scaled) : Math.floor(scaled);
    return rounded / factor;
  }
  return Number(value.toFixed(safeDp));
};

// Rate efektif sebuah komponen: calculated_rate bila CALCULATED, selain itu
// fixed_rate. Dibulatkan memakai decimal_place komponen.
export const getComponentRate = (component: RateLike): number => {
  const raw =
    (component.rate_type ?? "FIXED").toUpperCase() === "CALCULATED"
      ? (component.calculated_rate ?? 0)
      : (component.fixed_rate ?? 0);
  return roundTo(raw, component.decimal_place ?? 2);
};

// Format rate untuk ditampilkan (mengikuti decimal_place).
export const formatRate = (value: number, dp = 2): string =>
  roundTo(value, dp).toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(dp) && dp >= 0 ? dp : 2,
    maximumFractionDigits: Number.isInteger(dp) && dp >= 0 ? dp : 2,
  });

// ============================ EKSPRESI ============================

// Token siap-hitung: operand membawa nilai numeriknya langsung.
export type CalcToken =
  | { type: "operand"; value: number }
  | { type: "operator"; operator: string }
  // decimalPlace & rounding hanya relevan pada "(" (pembulatan grup ini).
  | {
      type: "paren";
      paren: "(" | ")";
      decimalPlace?: number;
      rounding?: RoundMode;
    };

type RpnToken =
  | { type: "operand"; value: number }
  | { type: "operator"; operator: string }
  // decimalPlace/rounding grup ini (undefined → pakai setelan formula).
  | { type: "group"; decimalPlace?: number; rounding?: RoundMode };

class ExpressionError extends Error {}

// Shunting-yard: ubah token infix → RPN, sekaligus validasi struktur.
const toRPN = (tokens: CalcToken[]): RpnToken[] => {
  const output: RpnToken[] = [];
  const ops: CalcToken[] = [];
  let expectOperand = true;

  for (const t of tokens) {
    if (t.type === "operand") {
      if (!expectOperand)
        throw new ExpressionError("Operand tidak diharapkan di sini.");
      output.push({ type: "operand", value: t.value });
      expectOperand = false;
    } else if (t.type === "operator") {
      if (expectOperand)
        throw new ExpressionError("Operator tidak diharapkan di sini.");
      while (
        ops.length &&
        ops[ops.length - 1].type === "operator" &&
        PRECEDENCE[(ops[ops.length - 1] as { operator: string }).operator] >=
          PRECEDENCE[t.operator]
      ) {
        const top = ops.pop() as { type: "operator"; operator: string };
        output.push({ type: "operator", operator: top.operator });
      }
      ops.push(t);
      expectOperand = true;
    } else if (t.type === "paren" && t.paren === "(") {
      if (!expectOperand)
        throw new ExpressionError("Tanda '(' tidak diharapkan di sini.");
      ops.push(t);
      expectOperand = true;
    } else if (t.type === "paren" && t.paren === ")") {
      if (expectOperand)
        throw new ExpressionError("Tanda ')' tidak diharapkan di sini.");
      let matched = false;
      let groupDecimalPlace: number | undefined;
      let groupRounding: RoundMode | undefined;
      while (ops.length) {
        const top = ops.pop() as CalcToken;
        if (top.type === "paren" && top.paren === "(") {
          matched = true;
          groupDecimalPlace = top.decimalPlace;
          groupRounding = top.rounding;
          break;
        }
        output.push({
          type: "operator",
          operator: (top as { operator: string }).operator,
        });
      }
      if (!matched) throw new ExpressionError("Tanda kurung tidak seimbang.");
      output.push({
        type: "group",
        decimalPlace: groupDecimalPlace,
        rounding: groupRounding,
      });
      expectOperand = false;
    }
  }

  if (expectOperand)
    throw new ExpressionError("Ekspresi belum lengkap.");

  while (ops.length) {
    const top = ops.pop() as CalcToken;
    if (top.type === "paren")
      throw new ExpressionError("Tanda kurung tidak seimbang.");
    output.push({
      type: "operator",
      operator: (top as { operator: string }).operator,
    });
  }

  return output;
};

const evalRPN = (
  rpn: RpnToken[],
  decimalPlace: number,
  rounding: RoundMode = "round",
): number => {
  const stack: number[] = [];
  for (const t of rpn) {
    if (t.type === "operand") {
      stack.push(t.value);
    } else if (t.type === "operator") {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined)
        throw new ExpressionError("Ekspresi tidak valid.");
      switch (t.operator) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(b === 0 ? a : a / b);
          break;
      }
    } else if (t.type === "group") {
      const v = stack.pop();
      if (v === undefined) throw new ExpressionError("Ekspresi tidak valid.");
      // Pembulatan grup pakai decimal_place & arah kurung ini; fallback formula.
      stack.push(
        roundTo(v, t.decimalPlace ?? decimalPlace, t.rounding ?? rounding),
      );
    }
  }
  if (stack.length !== 1) throw new ExpressionError("Ekspresi tidak valid.");
  return roundTo(stack[0], decimalPlace, rounding);
};

// Konversi token ekspresi ter-populate (dari API) → CalcToken untuk evaluasi
// live. Hasil hitung tidak disimpan di backend, jadi dihitung di sini.
export const expressionToCalcTokens = (
  expression: ExpressionToken[] | undefined,
): CalcToken[] =>
  (expression ?? []).map((t): CalcToken => {
    if (t.type === "operator")
      return { type: "operator", operator: t.operator ?? "+" };
    if (t.type === "paren")
      return {
        type: "paren",
        paren: (t.paren ?? "(") as "(" | ")",
        decimalPlace: Number.isInteger(t.decimal_place)
          ? t.decimal_place
          : undefined,
        rounding: isRoundMode(t.rounding) ? t.rounding : undefined,
      };
    if (t.type === "constant")
      return { type: "operand", value: Number(t.value ?? 0) };
    return {
      type: "operand",
      value: isPopulatedComponent(t.component)
        ? getComponentRate(t.component)
        : 0,
    };
  });

// Hitung hasil formula dari ekspresi ter-populate (helper ringkas untuk tabel/
// view). Mengembalikan null bila ekspresi tidak valid.
export const computeExpressionResult = (
  expression: ExpressionToken[] | undefined,
  decimalPlace: number,
  rounding: RoundMode = "round",
): number | null => {
  const evaluation = evaluateExpression(
    expressionToCalcTokens(expression),
    decimalPlace,
    rounding,
  );
  return evaluation.ok ? evaluation.value : null;
};

// Format hasil akhir untuk ditampilkan. Bila mode "none", tampilkan nilai asli
// tanpa memaksa jumlah desimal; selain itu ikuti decimal_place.
export const formatResult = (
  value: number,
  dp: number,
  mode: RoundMode = "round",
): string =>
  mode === "none"
    ? Number(value).toLocaleString("en-US", { maximumFractionDigits: 20 })
    : formatRate(value, dp);

// Evaluasi ekspresi (non-throwing) untuk preview UI.
export const evaluateExpression = (
  tokens: CalcToken[],
  decimalPlace: number,
  rounding: RoundMode = "round",
): { ok: boolean; value: number; error?: string } => {
  const operandCount = tokens.filter((t) => t.type === "operand").length;
  if (operandCount === 0) {
    return { ok: false, value: 0, error: "Belum ada operand." };
  }
  try {
    const rpn = toRPN(tokens);
    return { ok: true, value: evalRPN(rpn, decimalPlace, rounding) };
  } catch (e) {
    return {
      ok: false,
      value: 0,
      error: e instanceof Error ? e.message : "Ekspresi tidak valid.",
    };
  }
};

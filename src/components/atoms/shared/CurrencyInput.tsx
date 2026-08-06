"use client";

// Input nominal berformat CURRENCY (grup ribuan) TANPA simbol mata uang.
// Default mengikuti locale id-ID: pemisah ribuan "." dan desimal ",".
// Bisa dikonfigurasi ke gaya en-US (grup "," desimal ".") lewat prop separator.
// Contoh (id-ID): ketik "1500000" → tampil "1.500.000". Ke atas (form/DB) tetap NUMBER.
import React, { useEffect, useState } from "react";

interface DataProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxDecimals?: number;
  allowNegative?: boolean;
  groupSeparator?: string; // pemisah ribuan (default ".")
  decimalSeparator?: string; // pemisah desimal (default ",")
  max?: number; // batas atas — nilai dipaksa turun ke `max` bila melebihi
  min?: number; // batas bawah — nilai dipaksa naik ke `min` bila kurang
  "aria-label"?: string;
}

// Kelompokkan bagian bilangan bulat tiap 3 digit dengan `sep`.
const groupInt = (digits: string, sep: string): string => {
  if (!digits) return "";
  const trimmed = digits.replace(/^0+(?=\d)/, ""); // buang nol di depan
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};

// NUMBER → string tampilan (grup ribuan + desimal bila ada), hormati tanda minus.
const numToDisplay = (
  value: number,
  maxDecimals: number,
  groupSep: string,
  decSep: string,
): string => {
  if (!Number.isFinite(value) || value === 0) return "";
  const neg = value < 0;
  const factor = 10 ** maxDecimals;
  const fixed = Math.round(Math.abs(value) * factor) / factor;
  const [intPart, decPart] = String(fixed).split(".");
  const grouped = groupInt(intPart, groupSep);
  const body = decPart ? `${grouped}${decSep}${decPart}` : grouped;
  return neg ? `-${body}` : body;
};

// String tampilan → NUMBER (buang pemisah ribuan, pemisah desimal → titik).
const displayToNum = (
  display: string,
  decSep: string,
): number => {
  const neg = display.trim().startsWith("-");
  let cleaned = "";
  for (const ch of display) {
    if (ch >= "0" && ch <= "9") cleaned += ch;
    else if (ch === decSep && !cleaned.includes(".")) cleaned += ".";
  }
  const n = Number(cleaned);
  const val = Number.isFinite(n) ? n : 0;
  return neg ? -val : val;
};

export default function CurrencyInput({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  maxDecimals = 2,
  allowNegative = false,
  groupSeparator = ".",
  decimalSeparator = ",",
  max,
  min,
  "aria-label": ariaLabel,
}: DataProps) {
  // Paksa nilai ke dalam rentang [min, max] bila prop-nya di-set.
  const clamp = (n: number): number => {
    let out = n;
    if (typeof max === "number" && out > max) out = max;
    if (typeof min === "number" && out < min) out = min;
    return out;
  };

  const [text, setText] = useState<string>(
    numToDisplay(value, maxDecimals, groupSeparator, decimalSeparator),
  );

  // Sinkronkan bila value berubah dari luar (mis. reset form / load data edit) —
  // tanpa mengganggu ketikan berjalan.
  useEffect(() => {
    if (displayToNum(text, decimalSeparator) !== value) {
      setText(numToDisplay(value, maxDecimals, groupSeparator, decimalSeparator));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (raw: string) => {
    const neg = allowNegative && raw.trim().startsWith("-");

    // Sisakan digit & satu pemisah desimal; pemisah ribuan & lainnya dibuang.
    let cleaned = "";
    for (const ch of raw) {
      if (ch >= "0" && ch <= "9") cleaned += ch;
      else if (ch === decimalSeparator && !cleaned.includes(decimalSeparator))
        cleaned += decimalSeparator;
    }

    const hasDec = cleaned.includes(decimalSeparator);
    const [intDigitsRaw, decDigitsRaw = ""] = cleaned.split(decimalSeparator);
    const decDigits =
      maxDecimals > 0 ? decDigitsRaw.slice(0, maxDecimals) : "";
    const grouped = groupInt(intDigitsRaw, groupSeparator);

    const body =
      hasDec && maxDecimals > 0
        ? `${grouped}${decimalSeparator}${decDigits}`
        : grouped;

    const intForNum = intDigitsRaw.replace(/^0+(?=\d)/, "") || "0";
    const numAbs = Number(`${intForNum}.${decDigits || "0"}`);
    const rawNumeric = neg ? -numAbs : numAbs;
    const numeric = clamp(Number.isFinite(rawNumeric) ? rawNumeric : 0);

    // Bila nilai dipaksa oleh batas [min, max], tampilkan angka hasil clamp
    // (bukan angka mentah yang diketik) agar display konsisten dengan value.
    const display =
      numeric !== rawNumeric
        ? numToDisplay(numeric, maxDecimals, groupSeparator, decimalSeparator)
        : (neg ? "-" : "") + body;
    setText(display);

    onChange(numeric);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => handleChange(e.target.value)}
      className={className}
    />
  );
}

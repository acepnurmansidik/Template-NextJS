"use client";

// Input nominal berformat CURRENCY (grup ribuan) TANPA simbol mata uang.
// Tampilan mengikuti locale id-ID: pemisah ribuan "." dan desimal ",".
// Contoh: ketik "1500000" → tampil "1.500.000". Ke atas (form/DB) tetap NUMBER.
import React, { useEffect, useState } from "react";

interface DataProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxDecimals?: number;
  "aria-label"?: string;
}

// Kelompokkan bagian bilangan bulat dengan titik tiap 3 digit.
const groupInt = (digits: string): string => {
  if (!digits) return "";
  const trimmed = digits.replace(/^0+(?=\d)/, ""); // buang nol di depan
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// NUMBER → string tampilan (grup ribuan + desimal koma bila ada).
const numToDisplay = (value: number, maxDecimals: number): string => {
  if (!Number.isFinite(value) || value === 0) return "";
  const fixed =
    Math.round(value * 10 ** maxDecimals) / 10 ** maxDecimals;
  const [intPart, decPart] = String(Math.abs(fixed)).split(".");
  const grouped = groupInt(intPart);
  return decPart ? `${grouped},${decPart}` : grouped;
};

// String tampilan → NUMBER (buang titik grup, koma jadi titik desimal).
const displayToNum = (display: string): number => {
  const cleaned = display
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export default function CurrencyInput({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  maxDecimals = 2,
  "aria-label": ariaLabel,
}: DataProps) {
  const [text, setText] = useState<string>(numToDisplay(value, maxDecimals));

  // Sinkronkan bila value berubah dari luar (mis. reset form, atau pasangan
  // debit/kredit yang otomatis di-nol-kan) — tanpa mengganggu ketikan berjalan.
  useEffect(() => {
    if (displayToNum(text) !== value) {
      setText(numToDisplay(value, maxDecimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (raw: string) => {
    // Sisakan digit & satu koma desimal; sisanya (termasuk titik grup) dibuang.
    let cleaned = raw.replace(/[^\d,]/g, "");
    const firstComma = cleaned.indexOf(",");
    if (firstComma !== -1) {
      cleaned =
        cleaned.slice(0, firstComma + 1) +
        cleaned.slice(firstComma + 1).replace(/,/g, "");
    }

    const hasComma = cleaned.includes(",");
    const [intDigitsRaw, decDigitsRaw = ""] = cleaned.split(",");
    const decDigits =
      maxDecimals > 0 ? decDigitsRaw.slice(0, maxDecimals) : "";
    const grouped = groupInt(intDigitsRaw);

    const display = hasComma && maxDecimals > 0 ? `${grouped},${decDigits}` : grouped;
    setText(display);

    const intForNum = intDigitsRaw.replace(/^0+(?=\d)/, "") || "0";
    const numeric = Number(`${intForNum}.${decDigits || "0"}`);
    onChange(Number.isFinite(numeric) ? numeric : 0);
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

"use client";

// Input angka berbasis TEXT (bukan <input type="number">) supaya:
// - mengetik terasa natural: field bisa dikosongkan lalu diketik ulang tanpa
//   angka "0" yang menempel di depan (bug input number bawaan browser),
// - tidak bisa diubah via scroll mouse (type text tidak punya spinner),
// - tidak menerima nilai minus / notasi ilmiah (karakter di-sanitasi),
// - opsional hanya bilangan bulat (integer).
//
// Tampilan memakai state string lokal, tapi ke atas (form / DB) selalu
// dikirim NUMBER hasil konversi — jadi penyimpanan tetap numerik.
import React, { useEffect, useState } from "react";

interface DataProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  integer?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

// Buang karakter selain digit (dan satu titik desimal bila bukan integer).
const sanitize = (raw: string, integer: boolean): string => {
  let cleaned = raw.replace(integer ? /[^0-9]/g : /[^0-9.]/g, "");
  if (!integer) {
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, "");
    }
  }
  return cleaned;
};

export default function NumberInput({
  value,
  onChange,
  min = 0,
  integer = false,
  placeholder,
  className,
  disabled,
  "aria-label": ariaLabel,
}: DataProps) {
  const [text, setText] = useState<string>(
    Number.isFinite(value) ? String(value) : "",
  );

  // Sinkron bila `value` berubah dari LUAR (reset form, load data untuk edit).
  // Bandingkan nilai ternormalisasi supaya ketikan lokal (mis. "" atau "1.")
  // tidak ikut ditimpa saat value == hasil normalisasi yang sama.
  useEffect(() => {
    const normalized =
      text === "" || text === "." ? min : Number(text);
    const current = Number.isNaN(normalized) ? min : normalized;
    if (current !== value) {
      setText(Number.isFinite(value) ? String(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitize(e.target.value, integer);
    setText(cleaned);
    if (cleaned === "" || cleaned === ".") {
      onChange(min); // field kosong dianggap nilai minimum (tetap kirim number)
      return;
    }
    const n = Number(cleaned);
    if (Number.isNaN(n)) return;
    onChange(n < min ? min : n);
  };

  // Saat blur: rapikan tampilan agar tidak menyisakan "", "." atau "05".
  const handleBlur = () => {
    if (text === "" || text === ".") {
      setText(String(min));
      onChange(min);
      return;
    }
    let n = Number(text);
    if (Number.isNaN(n)) n = min;
    if (n < min) n = min;
    setText(String(n));
    onChange(n);
  };

  return (
    <input
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      value={text}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}

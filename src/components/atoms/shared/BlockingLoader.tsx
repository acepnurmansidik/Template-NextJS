"use client";

import { useEffect } from "react";

interface Props {
  show: boolean;
  message?: string;
}

// Overlay pengunci layar dengan z-index paling atas. Selama proses (import /
// export) berjalan, seluruh layar terkunci sehingga user tidak bisa pindah
// menu / berinteraksi sampai proses selesai.
export default function BlockingLoader({ show, message = "Memproses…" }: Props) {
  // Kunci scroll body selama overlay tampil.
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-4 bg-zinc-950/60 backdrop-blur-sm"
      // Tangkap semua interaksi agar benar-benar mengunci layar.
      onClick={(e) => e.stopPropagation()}
      role="alertdialog"
      aria-busy="true"
      aria-live="assertive"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  );
}

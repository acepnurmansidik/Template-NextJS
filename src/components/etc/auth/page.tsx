"use client";

import React from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Layout dua kolom untuk halaman auth. Panel kiri = branding (gradient,
// self-contained tanpa gambar eksternal), panel kanan = form. Theme-aware
// (mendukung light & dark).
export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">
      {/* LEFT — BRAND PANEL */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* dekorasi lingkaran lembut */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm font-black text-lg">
              T
            </div>
            <span className="text-lg font-bold tracking-tight">Journey</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Kelola operasional bisnis dalam satu platform.
            </h1>
            <p className="mt-4 text-white/80 leading-relaxed">
              Procurement, inventory, dan finance terintegrasi — cepat, rapi,
              dan mudah dipantau.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>© {new Date().getFullYear()} Journey</span>
          </div>
        </div>
      </div>

      {/* RIGHT — FORM AREA */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          {/* brand ringkas untuk mobile */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 font-black text-white">
              J
            </div>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Journey
            </span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

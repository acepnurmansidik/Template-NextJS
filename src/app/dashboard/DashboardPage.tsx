"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import { FiArchive, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import { apiGet } from "@/utils/api";
import { getAccess } from "@/utils/secureCookie";
import {
  ModuleData,
  VisibleModule,
  colorHex,
  visibleModules,
} from "@/utils/dashboard";
import { DashboardCard } from "@/components/atoms/dashboard/DashboardCards";

interface ModuleResponse {
  success: boolean;
  data: ModuleData;
}

// Ikon modern per tab modul.
const MODULE_ICONS: Record<string, IconType> = {
  procurement: FiShoppingBag,
  finance: FiDollarSign,
  inventory: FiArchive,
};

type CacheState = Record<
  string,
  { loading: boolean; error: boolean; data: ModuleData | null }
>;

export default function DashboardPage() {
  const router = useRouter();
  // Akses dibaca dari localStorage — hanya di client (hindari mismatch SSR).
  const [ready, setReady] = useState(false);
  const [modules, setModules] = useState<VisibleModule[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [cache, setCache] = useState<CacheState>({});

  useEffect(() => {
    const access = getAccess();
    const has = (path: string) => {
      const a = access.get(path);
      return !!a && a.view !== false;
    };
    const vis = visibleModules(has);
    setModules(vis);
    setActiveKey(vis[0]?.key ?? "");
    setReady(true);
  }, []);

  const active = useMemo(
    () => modules.find((m) => m.key === activeKey),
    [modules, activeKey],
  );

  // Fetch data SATU modul (tab aktif) — lazy, hanya saat dibutuhkan.
  const fetchModule = useCallback(
    async (mod: VisibleModule) => {
      setCache((prev) => ({
        ...prev,
        [mod.key]: { loading: true, error: false, data: null },
      }));
      try {
        const res = await apiGet<ModuleResponse>(mod.endpoint, {}, false);
        setCache((prev) => ({
          ...prev,
          [mod.key]: { loading: false, error: false, data: res.data ?? {} },
        }));
      } catch {
        setCache((prev) => ({
          ...prev,
          [mod.key]: { loading: false, error: true, data: null },
        }));
      }
    },
    [],
  );

  // Saat tab aktif berubah: fetch bila belum ada di cache.
  useEffect(() => {
    if (!active) return;
    if (cache[active.key]) return; // sudah pernah di-fetch
    fetchModule(active);
  }, [active, cache, fetchModule]);

  const current = active ? cache[active.key] : undefined;

  return (
    <CMSLayout>
      {/* animasi masuk kartu (staggered) */}
      <style>{`
        @keyframes dashIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .dash-in { animation: dashIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .dash-in { animation: none; } }
      `}</style>
      <div className="w-full px-6 transition-colors duration-300">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Ringkasan tiap modul sesuai hak akses Anda. Data diperbarui berkala
            (cache 3 jam).
          </p>
        </div>

        {!ready ? null : modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">
              Belum ada modul yang bisa ditampilkan
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              Dashboard mengikuti hak akses Anda. Hubungi admin bila butuh akses
              modul.
            </p>
          </div>
        ) : (
          <>
            {/* TABS per modul — segmented pill (hanya yang bisa diakses) */}
            <div className="inline-flex flex-wrap gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 mb-6">
              {modules.map((m) => {
                const isActive = m.key === activeKey;
                const MIcon = MODULE_ICONS[m.key] ?? FiArchive;
                return (
                  <button
                    key={m.key}
                    onClick={() => setActiveKey(m.key)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm scale-[1.03]"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <MIcon
                      size={15}
                      strokeWidth={2.4}
                      style={isActive ? { color: colorHex("blue") } : undefined}
                    />
                    <span>{m.label}</span>
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300"
                      }`}
                      style={
                        isActive ? { backgroundColor: colorHex("blue") } : undefined
                      }
                    >
                      {m.items.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CONTENT tab aktif */}
            {!active ? null : current?.loading || !current ? (
              <SkeletonGrid count={active.items.length || 3} />
            ) : current.error ? (
              <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-8 text-center">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
                  Gagal memuat data {active.label}.
                </p>
                <button
                  onClick={() => fetchModule(active)}
                  className="mt-3 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Coba lagi
                </button>
              </div>
            ) : (
              <div
                key={active.key}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {active.items.map((item, i) => (
                  <div
                    key={item.path}
                    className="dash-in cursor-pointer focus:outline-none"
                    style={{ animationDelay: `${i * 70}ms` }}
                    role="link"
                    tabIndex={0}
                    title={`Buka ${item.title}`}
                    onClick={() => router.push(item.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(item.path);
                      }
                    }}
                  >
                    <DashboardCard
                      item={item}
                      data={current.data?.[item.dataKey]}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </CMSLayout>
  );
}

const SkeletonGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: Math.max(count, 3) }).map((_, i) => (
      <div
        key={i}
        className="h-44 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 animate-pulse"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-2.5 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 mb-3" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    ))}
  </div>
);

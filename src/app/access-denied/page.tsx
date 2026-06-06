"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft as IconLeft, FaHome as IconHome } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 transition-colors duration-300 relative overflow-hidden bg-white dark:bg-zinc-950">
      <style>{`
        @keyframes floatLock {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shakeLock {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        .animate-float { animation: floatLock 4s infinite ease-in-out; }
        .animate-shake { animation: shakeLock 0.5s ease-in-out; }
      `}</style>

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/5 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-xl z-10 flex flex-col items-center">
        {/* =========================== ANIMATED LOCK LAYER ============================ */}
        <div className="relative mb-8 select-none flex items-center justify-center animate-float">
          <div className="relative w-40 h-40">
            {/* Body Gembok */}
            <div className="absolute bottom-0 w-40 h-28 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-8 border-4 border-zinc-500 dark:border-zinc-400 rounded-full"></div>
            </div>
            {/* Lengkungan Gembok */}
            <div className="absolute -top-4 left-1/2 -ml-12 w-24 h-24 border-[16px] border-zinc-900 dark:border-zinc-100 rounded-t-full border-b-0"></div>
          </div>
        </div>

        {/* =========================== TEXT MESSAGE ============================ */}
        <div className="space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
            Access Denied
          </h2>
          <p className="text-base text-gray-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            You don't have the necessary permissions to view this page. Please
            contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* =========================== ACTION BUTTONS ============================ */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto h-11 text-sm font-medium border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/80 active:scale-95 cursor-pointer rounded-lg px-6 flex items-center justify-center gap-2.5 transition-all shadow-xs"
          >
            <IconLeft size={12} />
            <span>Go Back</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto h-11 text-sm font-medium bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 active:scale-95 cursor-pointer rounded-lg px-6 flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <IconHome size={14} />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

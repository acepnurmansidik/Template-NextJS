"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft as IconLeft, FaHome as IconHome } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 transition-colors duration-300 relative overflow-hidden">
      {/* ANIMASI CSS MURNI: GERAKAN MEPET MENYUSURI BINGKAI LINGKARAN */}
      <style>{`
        /* Animasi mengambang halus untuk kaca pembesar */
        @keyframes floatMagnifier {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        /* Koreografi Gerakan Pupil: Super Mepet Mengikuti Lengkungan Bingkai secara Acak */
        @keyframes eyeLookCurvedExtreme {
          /* --- FASE 1: HORISONTAL BAWAH (MENGIKUTI LENGKUNGAN BAWAH MEPET) --- */
          0%, 4%   { transform: translate(0, 0); }                 /* Tengah */
          6%, 10%  { transform: translate(18px, 14px); }           /* Kanan-Bawah (Mepet Pinggir) */
          12%      { transform: translate(0, 23px); }              /* [LENGKUNG EXTREME] Mentok Bawah Tengah */
          14%, 18% { transform: translate(-18px, 14px); }          /* Sampai di Kiri-Bawah */
          20%      { transform: translate(0, 23px); }              /* [LENGKUNG EXTREME] Mentok Bawah Tengah balik */
          22%, 26% { transform: translate(18px, 14px); }           /* Kembali ke Kanan-Bawah */
          
          /* --- FASE 2: VERTIKAL KANAN (MENGIKUTI LENGKUNGAN KANAN MEPET) --- */
          28%      { transform: translate(23px, 0); }              /* [LENGKUNG EXTREME] Mentok Kanan Tengah */
          30%, 34% { transform: translate(18px, -14px); }          /* Sampai di Kanan-Atas */
          
          /* --- FASE 3: HORISONTAL ATAS (MENGIKUTI LENGKUNGAN ATAS MEPET) --- */
          36%      { transform: translate(0, -23px); }             /* [LENGKUNG EXTREME] Mentok Atas Tengah */
          38%, 42% { transform: translate(-18px, -14px); }         /* Sampai di Kiri-Atas */
          44%      { transform: translate(0, -23px); }             /* [LENGKUNG EXTREME] Mentok Atas Tengah balik */
          46%, 50% { transform: translate(18px, -14px); }          /* Kembali ke Kanan-Atas */
          
          /* --- FASE 4: TRANSISI TENGAH & LIRIKAN STANDARD --- */
          52%, 56% { transform: translate(0, 0); }                 /* Istirahat di Tengah */
          58%, 62% { transform: translate(-23px, 0); }             /* Mentok Kiri Murni */

          /* --- FASE 5: VERTIKAL KIRI (MENGIKUTI LENGKUNGAN KIRI MEPET) --- */
          64%      { transform: translate(-23px, 7px); }           /* [LENGKUNG EXTREME] Menyusuri dinding kiri */
          66%, 70% { transform: translate(-18px, 14px); }          /* Sampai di Kiri-Bawah */
          72%      { transform: translate(-23px, 0); }             /* [LENGKUNG EXTREME] Menyusuri dinding kiri naik */
          74%, 78% { transform: translate(-18px, -14px); }         /* Sampai di Kiri-Atas */
          80%      { transform: translate(-23px, 7px); }           /* [LENGKUNG EXTREME] Menyusuri dinding kiri turun lagi */
          82%, 86% { transform: translate(-18px, 14px); }          /* Kembali ke Kiri-Bawah */
          
          /* --- FASE 6: KANAN VERTIKAL TURUN (MENGIKUTI LENGKUNGAN KANAN MEPET) --- */
          88%      { transform: translate(0, 0); }                 /* Potong tengah lewat koordinat pusat */
          90%, 93% { transform: translate(18px, -14px); }          /* Di Kanan-Atas */
          94%      { transform: translate(23px, 0); }              /* [LENGKUNG EXTREME] Mentok Kanan Tengah turun */
          95%, 98% { transform: translate(18px, 14px); }           /* Sampai di Kanan-Bawah */
          100%     { transform: translate(0, 0); }                 /* Selesai kembali ke Tengah */
        }

        .animate-magnifier {
          animation: floatMagnifier 6s infinite ease-in-out;
        }
        
        /* Menggunakan cubic-bezier agar akselerasi nempel dinding bingkainya pas */
        .animate-eye-look {
          animation: eyeLookCurvedExtreme 28s infinite cubic-bezier(0.25, 1, 0.35, 1);
        }
      `}</style>

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-xl z-10 flex flex-col items-center">
        {/* =========================== ANIMATED ICON LAYER (404) ============================ */}
        <div className="relative mb-4 select-none flex items-center justify-center gap-1">
          {/* Angka 4 Depan + Gradasi */}
          <span className="text-[12rem] font-black tracking-tight text-gray-400 dark:text-zinc-800/90 leading-none">
            4
          </span>

          {/* Kaca Pembesar (Sebagai Angka 0) */}
          <div className="w-40 h-40 relative flex items-center justify-center animate-magnifier -mx-2.5 z-20">
            {/* Lensa Kaca Pembesar / Bingkai Mata */}
            <div className="w-32 h-32 rounded-full border-8 border-zinc-950 dark:border-zinc-100 bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden relative z-10">
              {/* Area Putih Mata */}
              <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-700/50 rounded-full flex items-center justify-center relative shadow-inner">
                {/* Pupil Mata Hitam + Iris Biru yang bergerak mepet ke bingkai */}
                <div className="w-9 h-9 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center absolute animate-eye-look">
                  {/* Inti Pupil Hitam */}
                  <div className="w-5 h-5 bg-zinc-950 rounded-full relative">
                    {/* Pantulan Cahaya Mata */}
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Efek Silau Lensa Kaca */}
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
            </div>

            {/* Gagang Kaca Pembesar */}
            <div className="w-6 h-13.5 bg-zinc-950 dark:bg-zinc-100 rounded-b-md absolute -bottom-8 right-5 origin-top -rotate-40 shadow-lg z-0">
              {/* Detail Ring Gagang */}
              <div className="w-full h-3 bg-zinc-700 dark:bg-zinc-400 absolute top-0"></div>
            </div>
          </div>

          {/* Angka 4 Belakang + Gradasi */}
          <span className="text-[12rem] font-black tracking-tight text-gray-400 dark:text-zinc-800/90 leading-none">
            4
          </span>
        </div>

        {/* =========================== TEXT MESSAGE ============================ */}
        <div className="space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
            Lost in Space?
          </h2>
          <p className="text-base text-gray-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The page you're looking for cannot be found or has been moved to
            other coordinates. Let's get back on track!
          </p>
        </div>

        {/* =========================== ACTION BUTTONS ============================ */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Tombol Kembali (Go Back) */}
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto h-11 text-sm font-medium border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/80 active:scale-95 cursor-pointer rounded-lg px-6 flex items-center justify-center gap-2.5 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-xs"
          >
            <IconLeft size={12} className="text-gray-500 dark:text-zinc-400" />
            <span>Back Previous</span>
          </button>

          {/* Tombol Utama (Go Home) */}
          <Link
            href="/"
            className="w-full sm:w-auto h-11 text-sm font-medium bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 active:scale-95 cursor-pointer rounded-lg px-6 flex items-center justify-center gap-2.5 outline-none transition-all shadow-sm"
          >
            <IconHome size={14} />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

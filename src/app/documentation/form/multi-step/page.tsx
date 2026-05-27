"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import Style1 from "./Style1";
import Style2 from "./Style2";
import Style3 from "./Style3";
import Style4 from "./Style4";

const Page = () => {
  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          {/* SISI KIRI: Judul dan Deskripsi Dashboard */}
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Select Parameters
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Pilih kriteria kontak yang ingin Anda analisis dalam laporan ini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* FORM MULTI STEP */}
          <Style1 />
          <Style2 />
          <Style3 />
          <Style4 />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

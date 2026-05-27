"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import WaveformAnalysis from "./WaveformAnalysis";
import DutyCycleAnalysis from "./DutyCycleAnalysis";

const Page = () => {
  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Measurement
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Real-time analytics and management for your contacts database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Pie & Donut Chart Box */}
          <DutyCycleAnalysis />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Pie & Donut Chart Box */}
          <WaveformAnalysis initiateData={[]} />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

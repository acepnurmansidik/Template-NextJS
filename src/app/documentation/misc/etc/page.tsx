import type { Metadata } from "next";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import ScrollNavigation from "./scrollNavigation";

export const metadata: Metadata = {
  title: "Etc",
};

const Page = () => {
  return (
    <CMSLayout>
      <div className="w-full px-6 ">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Etc
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Monitor project timelines and waveform frequency cycles with
              precision-engineered visualization tools.
            </p>
          </div>
        </div>

        {/* Scroll Navigation */}
        <div className="py-4 rounded-lg">
          <ScrollNavigation />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

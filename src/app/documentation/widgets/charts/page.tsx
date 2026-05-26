"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { FaEllipsisH } from "react-icons/fa";

import ChartRadar from "./RadarChart";
import ChartPieDonuts from "./PieDonutsChart";
import ChartTreeMap from "./treeMap";
import StandartChartLine from "./standartChartLine";
import ChartBar from "./BarChart";
import ChartLineArea from "./LineAreaChart";
import ChartStackedBar from "./StackBarChart";
import ChartLinearRegression from "./LinearRegressionChart";
import ChartBubble from "./BubbleChart";
import ChartStreamgraph from "./StreamgraphChart";
import ChartVector from "./VectorChart";
import GanttTimeline from "./GanttChartCalendar";

const Page = () => {
  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        {/* =========================== DASHBOARD HEADER ============================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              Charts
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Real-time analytics and management for your contacts database.
            </p>
          </div>
        </div>

        {/* 2. Middle Main Charts (Area Chart, Day Active & Repeat Rate) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="lg:col-span-2 p-5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
            <ChartLineArea />
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  Most Day Active
                </span>
                <button className="text-gray-400">
                  <FaEllipsisH size={11} />
                </button>
              </div>
              <div className="text-base font-bold mb-3">8.162</div>
              <div className="flex items-end justify-between h-14 px-1">
                {[
                  { d: "Sun", h: "h-[40%]" },
                  { d: "Mon", h: "h-[55%]" },
                  { d: "Tue", h: "h-[90%] bg-blue-500", a: true },
                  { d: "Wed", h: "h-[45%]" },
                  { d: "Thu", h: "h-[60%]" },
                  { d: "Fri", h: "h-[70%]" },
                  { d: "Sat", h: "h-[30%]" },
                ].map((b, bIdx) => (
                  <div key={bIdx} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-3 ${b.h} ${b.a ? "" : "bg-gray-200 dark:bg-zinc-700"} rounded-t-xs`}
                    ></div>
                    <span className="text-[9px] text-gray-400 mt-1">{b.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  Repeat Customer Rate
                </span>
                <button className="text-gray-400">
                  <FaEllipsisH size={11} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center my-1">
                <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center">
                  <div className="absolute inset-0 border-8 border-gray-100 dark:border-zinc-700 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-green-500 rounded-full border-b-transparent border-r-transparent rotate-45"></div>
                  <span className="text-lg font-bold text-gray-900 dark:text-zinc-100 z-10">
                    68%
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">
                  On track for 80% target
                </span>
              </div>
              <button className="text-[10px] font-medium text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 w-full py-1 rounded-md mt-1">
                Show details
              </button>
            </div>
          </div>
        </div>

        {/* =========================== ROW TAMBAHAN: LINE CHART & BAR CHART ============================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Standar Line Chart */}
          <StandartChartLine />

          {/* Standar Bar Chart */}
          <ChartBar />
        </div>

        {/* =========================== ROW TAMBAHAN: PIE, DONUT, RADAR, TREEMAP ============================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Pie & Donut Chart Box */}
          <ChartPieDonuts />

          {/* Radar Chart */}
          <ChartRadar />

          {/* Treemap */}
          <ChartTreeMap />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Pie & Donut Chart Box */}
          <GanttTimeline
            initiateData={[]}
            statusFilter={["Done", "OnProgress"]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
          {/* CHART BAR STACK */}
          <ChartStackedBar />

          {/* CHART LINEAR REGRESSION */}
          <ChartLinearRegression />

          {/* CHART BUBBLE */}
          <ChartBubble />

          {/* CHART STREAMGRAPH */}
          <ChartStreamgraph />

          {/* CHART Bubble */}
          <ChartVector />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

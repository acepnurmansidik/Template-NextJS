"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import LineChartCard from "./lineChartCard";
import BarChartCard from "./barChartCard";
import PieChartCard from "./pieChartCard";
import RadarChartCard from "./RadarChartCard";
import LineAreaChartGradientCard from "./lineAreaChartGradientCard";
import LineAreaChartCard from "./lineAreaChartCard";
import FunnelChartCard from "./funnelChartCard";
import ComposedChartCard from "./composedChartCard";
import ScatterChartCard from "./scatterChartCard";
import StackedAreaChartCard from "./stackedAreaChartCard";
import StackedBarChartCard from "./stackedBarCard";
import TreemapChartCard from "./treemapChartCard";

const dataOneData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 150 },
  { name: "Apr", value: 300 },
  { name: "May", value: 250 },
  { name: "Jun", value: 400 },
];

const dataChart3 = [
  { name: "Jan", value1: 120, value2: 180, value3: 90 },
  { name: "Feb", value1: 200, value2: 160, value3: 140 },
  { name: "Mar", value1: 150, value2: 210, value3: 130 },
  { name: "Apr", value1: 300, value2: 250, value3: 200 },
  { name: "May", value1: 250, value2: 300, value3: 170 },
  { name: "Jun", value1: 400, value2: 350, value3: 260 },
];

const dataRadar = [
  {
    subject: "Marketing",
    Facebook: 120,
    Instagram: 180,
    TikTok: 140,
  },
  {
    subject: "Sales",
    Facebook: 150,
    Instagram: 200,
    TikTok: 170,
  },
  {
    subject: "Support",
    Facebook: 100,
    Instagram: 160,
    TikTok: 130,
  },
  {
    subject: "Development",
    Facebook: 180,
    Instagram: 220,
    TikTok: 190,
  },
  {
    subject: "HR",
    Facebook: 90,
    Instagram: 140,
    TikTok: 110,
  },
];

const Page = () => {
  return (
    <CMSLayout>
      <div className="grid grid-cols-2 gap-4 px-6">
        {/* LINE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Chart</h5>
          <LineChartCard data={dataOneData} />
        </div>

        {/* LINE AREA CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Area Chart</h5>
          <LineAreaChartCard data={dataOneData} />
        </div>

        {/* BAR CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Bar Chart</h5>
          <BarChartCard data={dataOneData} />
        </div>

        {/* PIE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">PIE Chart</h5>
          <PieChartCard data={dataOneData} />
        </div>

        {/* PIE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Radar Chart</h5>
          <RadarChartCard data={dataRadar} />
        </div>

        {/* PIE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Area Gradient Chart</h5>
          <LineAreaChartGradientCard />
        </div>

        {/* Funnel CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Funnel Chart</h5>
          <FunnelChartCard data={dataOneData} />
        </div>

        {/* Scatter/Bubble CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Scatter/Bubble Chart</h5>
          <ScatterChartCard />
        </div>

        {/* Stacked Area CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Stacked Area Chart</h5>
          <StackedAreaChartCard />
        </div>

        {/* Stacked Bar CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Stacked Bar Chart</h5>
          <StackedBarChartCard />
        </div>

        {/* TREEMAP CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">TREEMAP Chart</h5>
          <TreemapChartCard />
        </div>

        {/* COMPOSED CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">COMPOSED Chart</h5>
          <ComposedChartCard />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

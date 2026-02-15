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
import LinearRegressionChart from "./linearRegressionChart";
import LinearDottedRegressionScatterChart from "./linearDottedRegressionChart";
import GanttChartCard from "./ganttChartCard";
import QuarterGanttChart from "./quarterGanttChartCard";
import MonthlyGanttChartCard from "./monthlyGanttChartCard";
import RoseChartCard from "./roseChartCard";
import DonutChartCard from "./donutsCardCard";

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

const dataGanttChart = [
  {
    name: "Planning",
    start: new Date(`${new Date().getFullYear()}-01-10`).getTime(),
    end: new Date(`${new Date().getFullYear()}-01-20`).getTime(),
  },
  {
    name: "Research",
    start: new Date(`${new Date().getFullYear()}-02-01`).getTime(),
    end: new Date(`${new Date().getFullYear()}-03-10`).getTime(),
  },
  {
    name: "Development",
    start: new Date(`${new Date().getFullYear()}-03-15`).getTime(),
    end: new Date(`${new Date().getFullYear()}-05-15`).getTime(),
  },
  {
    name: "Testing",
    start: new Date(`${new Date().getFullYear()}-06-01`).getTime(),
    end: new Date(`${new Date().getFullYear()}-07-15`).getTime(),
  },
  {
    name: "Production",
    start: new Date(`${new Date().getFullYear()}-08-01`).getTime(),
    end: new Date(`${new Date().getFullYear()}-09-20`).getTime(),
  },
];

const dataComposeCard = [
  { name: "Mon", uv: 120, pv: 80 },
  { name: "Tue", uv: 200, pv: 140 },
  { name: "Wed", uv: 150, pv: 100 },
  { name: "Thu", uv: 300, pv: 180 },
  { name: "Fri", uv: 250, pv: 160 },
];

const dataLineChartArea = [
  { month: "Jan", revenue: 120, profit: 80 },
  { month: "Feb", revenue: 200, profit: 110 },
  { month: "Mar", revenue: 150, profit: 95 },
  { month: "Apr", revenue: 300, profit: 180 },
  { month: "May", revenue: 250, profit: 160 },
  { month: "Jun", revenue: 400, profit: 240 },
];
const Page = () => {
  return (
    <CMSLayout>
      <div className="grid grid-cols-2 gap-4 px-6">
        {/* Monthly Gantt CHART */}
        <div className="w-full col-span-2">
          <h5 className="text-3xl font-bold mb-7">Monthly Gantt Chart</h5>
          <MonthlyGanttChartCard
            title="Project Timeline 2026"
            data={dataGanttChart}
          />
        </div>

        {/* Quratal Gantt CHART */}
        <div className="w-full col-span-2">
          <h5 className="text-3xl font-bold mb-7">Quartal Gantt Chart</h5>
          <QuarterGanttChart title="Project Timeline 2026" />
        </div>

        {/* Gantt CHART */}
        <div className="w-full col-span-2">
          <h5 className="text-3xl font-bold mb-7">Gantt Chart</h5>
          <GanttChartCard title="Project Gantt Chart" data={dataGanttChart} />
        </div>

        {/* LINE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Chart</h5>
          <LineChartCard data={dataOneData} title="Revenue Overview" />
        </div>

        {/* LINE AREA CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Area Chart</h5>
          <LineAreaChartCard data={dataOneData} title="User Growth" />
        </div>

        {/* BAR CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Bar Chart</h5>
          <BarChartCard data={dataOneData} title="Weekly Sales" />
        </div>

        {/* PIE CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">PIE Chart</h5>
          <PieChartCard data={dataOneData} title="Traffic Sources" />
        </div>

        {/* Radar CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Radar Chart</h5>
          <RadarChartCard title="Traffic Sources" data={dataRadar} />
        </div>

        {/* Line Area Gradient CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Line Area Gradient Chart</h5>
          <LineAreaChartGradientCard
            title="Earnings Overview"
            data={dataLineChartArea}
          />
        </div>

        {/* Scatter/Bubble CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Scatter/Bubble Chart</h5>
          <ScatterChartCard title="Customer Distribution" />
        </div>

        {/* Linear Regression CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Linear Regression Chart</h5>
          <LinearRegressionChart title="Customer Distribution" />
        </div>

        {/* Linear Regression CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">
            Dotted Linear Regression Chart
          </h5>
          <LinearDottedRegressionScatterChart title="Linear Regression Chart" />
        </div>

        {/* Funnel CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Funnel Chart</h5>
          <FunnelChartCard data={dataOneData} title="Sales Funnel" />
        </div>

        {/* Stacked Area CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Stacked Area Chart</h5>
          <StackedAreaChartCard title="Traffic Overview" />
        </div>

        {/* Stacked Bar CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Stacked Bar Chart</h5>
          <StackedBarChartCard title="Daily Sales Breakdown" />
        </div>

        {/* TREEMAP CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">TREEMAP Chart</h5>
          <TreemapChartCard title="Storage Usage" />
        </div>

        {/* COMPOSED CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">COMPOSED Chart</h5>
          <ComposedChartCard title="Visitors Overview" data={dataComposeCard} />
        </div>

        {/* Rose CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Rose Chart</h5>
          <RoseChartCard title="Monthly Rose Chart" />
        </div>

        {/* Rose CHART */}
        <div className="w-full">
          <h5 className="text-3xl font-bold mb-7">Donut Chart</h5>
          <DonutChartCard data={dataOneData} title="Traffic Distribution" />
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;

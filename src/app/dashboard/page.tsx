import { Metadata } from "next";
import DashboardPage from "./DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Page = () => {
  return <DashboardPage />;
};

export default Page;

import type { Metadata } from "next";
import { ModulePage } from "./ModulePage";

export const metadata: Metadata = {
  title: "Module",
};

const Page = () => {
  return (
    <ModulePage
      title="Module"
      subtitle="Manage module visibility and define specific actions for your application pages."
    />
  );
};

export default Page;

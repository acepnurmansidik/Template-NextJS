import type { Metadata } from "next";
import { LayoutComponentsPage } from "./LayoutComponentsPage";

export const metadata: Metadata = {
  title: "Layout Components",
  description:
    "Kelola dan atur tata letak komponen pada denah atau blueprint bangunan.",
};

const Page = () => {
  return (
    <LayoutComponentsPage
      title="Layout Components"
      subtitle="Kelola dan atur tata letak posisi komponen visual pada denah dan blueprint bangunan."
    />
  );
};

export default Page;

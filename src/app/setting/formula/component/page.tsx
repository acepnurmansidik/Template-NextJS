import type { Metadata } from "next";
import { ComponentFormulaPage } from "./ComponentFormulaPage";

export const metadata: Metadata = {
  title: "Component Formula",
};

const Page = () => {
  return (
    <ComponentFormulaPage
      title="Component Formula"
      subtitle="Building blocks (rates) that compose calculated formulas."
    />
  );
};

export default Page;

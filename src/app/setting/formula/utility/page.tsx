import type { Metadata } from "next";
import { UtilityFormulaPage } from "./UtilityFormulaPage";

export const metadata: Metadata = {
  title: "Component Formula",
};

const Page = () => {
  return (
    <UtilityFormulaPage
      title="Utility Formula"
      subtitle="Building blocks (rates) that compose calculated formulas."
    />
  );
};

export default Page;

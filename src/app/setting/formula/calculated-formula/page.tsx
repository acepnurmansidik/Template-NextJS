import type { Metadata } from "next";
import { CalculatedFormulaPage } from "./CalculatedFormulaPage";

export const metadata: Metadata = {
  title: "Calculated Formula",
};

const Page = () => {
  return (
    <CalculatedFormulaPage
      title="Calculated Formula"
      subtitle="Compose ordered components with operators — drag & drop to arrange the calculation."
    />
  );
};

export default Page;

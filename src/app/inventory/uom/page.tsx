import type { Metadata } from "next";
import { UomPage } from "./ProductUomPage";

export const metadata: Metadata = {
  title: "Unit of Measure",
};

const Page = () => {
  return (
    <UomPage
      title="Unit of Measure"
      subtitle="Master data satuan ukur (mis. Kilogram/KG, Liter/L) untuk item inventory."
    />
  );
};

export default Page;

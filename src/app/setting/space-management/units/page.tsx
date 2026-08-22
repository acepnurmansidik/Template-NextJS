import type { Metadata } from "next";
import { UnitPage } from "./UnitPage";

export const metadata: Metadata = {
  title: "Unit",
};

const Page = () => {
  return (
    <UnitPage
      title="Unit"
      subtitle="Kelola ruangan/unit. Kode & nama mengikuti urutan per lantai (AGRK-FLR1-RM1 / Room 1)."
    />
  );
};

export default Page;

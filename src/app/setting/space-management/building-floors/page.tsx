import type { Metadata } from "next";
import { BuildingFloorPage } from "./BuildingFloorPage";

export const metadata: Metadata = {
  title: "Building Floor",
};

const Page = () => {
  return (
    <BuildingFloorPage
      title="Building Floor"
      subtitle="Kelola lantai bangunan. Kode & nama mengikuti urutan (AGRK-FLR1 / Floor 1). Menambah lantai baru otomatis melanjutkan urutan."
    />
  );
};

export default Page;

import type { Metadata } from "next";
import { BuildingPage } from "./BuildingPage";

export const metadata: Metadata = {
  title: "Building",
};

const Page = () => {
  return (
    <BuildingPage
      title="Building"
      subtitle="Kelola bangunan. Saat dibuat, lantai otomatis dibuat sesuai jumlah lantai (kode AGRK-FLR1, nama Floor 1, dst)."
    />
  );
};

export default Page;

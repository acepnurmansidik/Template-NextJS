import type { Metadata } from "next";
import { WarehousePage } from "./WarehousePage";

export const metadata: Metadata = {
  title: "Warehouses",
};

const Page = () => {
  return (
    <WarehousePage
      title="Warehouses"
      subtitle="Master data gudang penyimpanan inventory."
    />
  );
};

export default Page;

import type { Metadata } from "next";
import { StockMovementPage } from "./StockMovementPage";

export const metadata: Metadata = {
  title: "Stock Movements",
};

const Page = () => {
  return (
    <StockMovementPage
      title="Stock Movements"
      subtitle="Catatan pergerakan stok: masuk, keluar, penyesuaian, dan transfer antar gudang."
    />
  );
};

export default Page;

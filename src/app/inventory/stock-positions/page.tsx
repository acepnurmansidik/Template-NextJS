import type { Metadata } from "next";
import { StockPositionPage } from "./StockPositionPage";

export const metadata: Metadata = {
  title: "Stock Positions",
};

const Page = () => {
  return (
    <StockPositionPage
      title="Stock Positions"
      subtitle="Posisi stok per produk & gudang, lengkap dengan quantity dan reserved."
    />
  );
};

export default Page;

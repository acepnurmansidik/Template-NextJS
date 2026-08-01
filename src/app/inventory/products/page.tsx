import type { Metadata } from "next";
import { ProductPage } from "./ProductPage";

export const metadata: Metadata = {
  title: "Products",
};

const Page = () => {
  return (
    <ProductPage
      title="Products"
      subtitle="Master data produk (item) beserta kategori, satuan, dan harga."
    />
  );
};

export default Page;

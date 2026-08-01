import type { Metadata } from "next";
import { ProductCategoryPage } from "./ProductCategoryPage";

export const metadata: Metadata = {
  title: "Product Category",
};

const Page = () => {
  return (
    <ProductCategoryPage
      title="Product Category"
      subtitle="Kelola kategori produk beserta prefix & daftar akun (line accounts)."
    />
  );
};

export default Page;

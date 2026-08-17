import { Metadata } from "next";
import { SupplierPricingPage } from "./SupplierPricingPage";

export const metadata: Metadata = {
  title: "Supplier Pricing",
};

function Page() {
  return (
    <SupplierPricingPage
      title="Supplier Pricing"
      subtitle="Kelola daftar harga produk dari tiap supplier."
    />
  );
}

export default Page;

import type { Metadata } from "next";
import { SupplierPage } from "./SupplierPage";

export const metadata: Metadata = {
  title: "Suppliers",
};

const Page = () => {
  return (
    <SupplierPage
      title="Suppliers"
      subtitle="Master data supplier — kelola informasi kontak & alamat vendor."
    />
  );
};

export default Page;

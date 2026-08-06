import type { Metadata } from "next";
import { PurchaseRequestPage } from "./PurchaseRequestPage";

export const metadata: Metadata = {
  title: "Purchase Requests",
};

const Page = () => {
  return (
    <PurchaseRequestPage
      title="Purchase Requests"
      subtitle="Permintaan pembelian barang. Dibuat sebagai draft, lalu di-submit dari daftar."
    />
  );
};

export default Page;

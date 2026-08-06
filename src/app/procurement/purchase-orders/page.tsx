import type { Metadata } from "next";
import { PurchaseOrderPage } from "./PurchaseOrderPage";

export const metadata: Metadata = {
  title: "Purchase Orders",
};

const Page = () => {
  return (
    <PurchaseOrderPage
      title="Purchase Orders"
      subtitle="Pemesanan barang ke supplier. Bisa dibuat dari beberapa PR atau manual, disimpan sebagai draft lalu di-submit dari daftar."
    />
  );
};

export default Page;

import type { Metadata } from "next";
import { DeliveryOrderPage } from "./DeliveryOrderPage";

export const metadata: Metadata = {
  title: "Delivery Orders",
};

const Page = () => {
  return (
    <DeliveryOrderPage
      title="Delivery Orders"
      subtitle="Dokumen pengiriman barang standalone. Catat qty dikirim & qty diterima; status dihitung otomatis."
    />
  );
};

export default Page;

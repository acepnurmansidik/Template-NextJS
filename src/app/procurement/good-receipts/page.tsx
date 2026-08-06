import type { Metadata } from "next";
import { GoodReceiptPage } from "./GoodReceiptPage";

export const metadata: Metadata = {
  title: "Good Receipts",
};

const Page = () => {
  return (
    <GoodReceiptPage
      title="Good Receipts"
      subtitle="Penerimaan barang atas Purchase Order. Disimpan sebagai draft lalu di-submit dari daftar."
    />
  );
};

export default Page;

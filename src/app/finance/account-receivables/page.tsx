import type { Metadata } from "next";
import { AccountReceivablePage } from "./AccountReceivablePage";

export const metadata: Metadata = {
  title: "Account Receivable",
};

const Page = () => {
  return (
    <AccountReceivablePage
      title="Account Receivable"
      subtitle="Piutang usaha — faktur penjualan ke customer. Lacak total, pembayaran, dan sisa tagihan."
    />
  );
};

export default Page;

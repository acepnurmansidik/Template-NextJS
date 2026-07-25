import type { Metadata } from "next";
import { AccountPayablePage } from "./AccountPayablePage";

export const metadata: Metadata = {
  title: "Account Payable",
};

const Page = () => {
  return (
    <AccountPayablePage
      title="Account Payable"
      subtitle="Utang usaha — tagihan (bill) dari vendor. Lacak total, pembayaran, dan sisa utang."
    />
  );
};

export default Page;

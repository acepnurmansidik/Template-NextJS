import type { Metadata } from "next";
import { JournalWriteOffPage } from "./JournalWriteOffPage";

export const metadata: Metadata = {
  title: "Journal Write Off",
};

const Page = () => {
  return (
    <JournalWriteOffPage
      title="Journal Write Off"
      subtitle="Catat jurnal penghapusan (write-off) — piutang tak tertagih, utang, atau aset. Tetap berpasangan seimbang."
    />
  );
};

export default Page;

import type { Metadata } from "next";
import { JournalEntryPage } from "./JournalEntryPage";

export const metadata: Metadata = {
  title: "Journal Entry",
};

const Page = () => {
  return (
    <JournalEntryPage
      title="Journal Entry"
      subtitle="Catat jurnal umum berpasangan (double-entry) — total debit harus sama dengan total kredit."
    />
  );
};

export default Page;

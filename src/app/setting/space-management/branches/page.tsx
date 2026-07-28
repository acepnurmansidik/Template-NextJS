import type { Metadata } from "next";
import { BranchPage } from "./BranchPage";

export const metadata: Metadata = {
  title: "Branch",
};

const Page = () => {
  return (
    <BranchPage
      title="Branch"
      subtitle="Kelola cabang / lokasi. Kode & slug dibuat otomatis dari nama (mis. ANGGREK → AGRK)."
    />
  );
};

export default Page;

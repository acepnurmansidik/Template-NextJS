import type { Metadata } from "next";
import { ChartOfAccountPage } from "./ChartOfAccountPage";

export const metadata: Metadata = {
  title: "Chart of Account",
};

const Page = () => {
  return (
    <ChartOfAccountPage
      title="Chart of Account"
      subtitle="Kelola daftar akun berjenjang tak terbatas — kelompokkan dengan akun header dan susun sub-akun di bawahnya."
    />
  );
};

export default Page;

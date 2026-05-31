import type { Metadata } from "next";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";

export const metadata: Metadata = {
  title: "Module",
};

const Page = () => {
  return (
    <CMSLayout>
      <div>MODULE</div>
    </CMSLayout>
  );
};

export default Page;

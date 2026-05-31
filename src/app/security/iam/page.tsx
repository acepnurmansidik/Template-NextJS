import type { Metadata } from "next";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";

export const metadata: Metadata = {
  title: "IAM",
};

const Page = () => {
  return (
    <CMSLayout>
      <div>IAM</div>
    </CMSLayout>
  );
};

export default Page;

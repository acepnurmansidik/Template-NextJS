import type { Metadata } from "next";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";

export const metadata: Metadata = {
  title: "Role",
};

const Page = () => {
  return (
    <CMSLayout>
      <div>ROLE</div>
    </CMSLayout>
  );
};

export default Page;

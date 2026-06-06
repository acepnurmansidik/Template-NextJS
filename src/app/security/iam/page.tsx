import type { Metadata } from "next";
import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { IAMPage } from "./IAMPage";

export const metadata: Metadata = {
  title: "IAM",
};

const Page = () => {
  return (
    <IAMPage
      title="IAM"
      subtitle={
        "Centralized control for user identities, role assignments, and system access hierarchy."
      }
    />
  );
};

export default Page;

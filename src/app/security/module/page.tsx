import type { Metadata } from "next";
import { ModulePage } from "./ModulePage";

export const metadata: Metadata = {
  title: "Module",
};

const Page = () => {
  return <ModulePage />;
};

export default Page;

import type { Metadata } from "next";
import { RolePage } from "./RolePage";

export const metadata: Metadata = {
  title: "Role",
};

const Page = () => {
  return (
    <RolePage
      title="Role"
      subtitle="Secure your contact data by assigning specific roles and authority levels."
    />
  );
};

export default Page;

import type { Metadata } from "next";
import { AppConfigPage } from "./AppConfigPage";

export const metadata: Metadata = {
  title: "App Config",
};

const Page = () => {
  return (
    <AppConfigPage
      title="App Config"
      subtitle={
        "Centralized control for user identities, role assignments, and system access hierarchy."
      }
    />
  );
};

export default Page;

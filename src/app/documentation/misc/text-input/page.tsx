import { Metadata } from "next";
import TextInputPage from "./TextInputPage";

export const metadata: Metadata = {
  title: "Text Input",
};

const Page = () => {
  return <TextInputPage />;
};

export default Page;

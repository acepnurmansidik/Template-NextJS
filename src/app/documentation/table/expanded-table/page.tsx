import { Metadata } from "next";
import TablePage from "./TablePage";

export const metadata: Metadata = {
  title: "Expended Table",
};

const Page = () => {
  return <TablePage />;
};

export default Page;

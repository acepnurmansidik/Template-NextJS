import { Metadata } from "next";
import MapPage from "./MapPage";

export const metadata: Metadata = {
  title: "Map",
};

const Page = () => {
  return <MapPage />;
};
export default Page;

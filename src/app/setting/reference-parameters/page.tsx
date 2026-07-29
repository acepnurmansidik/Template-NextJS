import type { Metadata } from "next";
import { ReferenceParameterPage } from "./ReferenceParameterPage";

export const metadata: Metadata = {
  title: "Reference Parameters",
};

const Page = () => {
  return (
    <ReferenceParameterPage
      title="Reference Parameters"
      subtitle="Master data referensi item (mis. fasilitas/amenities), difilter per grup type."
    />
  );
};

export default Page;

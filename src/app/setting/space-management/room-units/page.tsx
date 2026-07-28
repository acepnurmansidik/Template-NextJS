import type { Metadata } from "next";
import { RoomUnitPage } from "./RoomUnitPage";

export const metadata: Metadata = {
  title: "Room Unit",
};

const Page = () => {
  return (
    <RoomUnitPage
      title="Room Unit"
      subtitle="Kelola ruangan/unit. Kode & nama mengikuti urutan per lantai (AGRK-FLR1-RM1 / Room 1)."
    />
  );
};

export default Page;

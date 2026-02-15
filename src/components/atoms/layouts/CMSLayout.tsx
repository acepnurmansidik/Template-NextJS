import Navbar from "../sharedComponents/Navbar";
import Sidebar from "../sharedComponents/Sidebar";

const CMSLayout = ({ children }: any) => {
  return (
    <main className="flex h-screen w-full bg-gray-100 overflow-auto">
      <Sidebar />
      {/* <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"> */}
      <div className="flex flex-col h-full w-full">
        {/* === Navbar === */}
        <Navbar />

        {/* === Content Scrollable === */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </main>
  );
};

export default CMSLayout;

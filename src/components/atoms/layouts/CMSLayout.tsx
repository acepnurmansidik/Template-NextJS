import Navbar from "../sharedComponents/Navbar";
import Sidebar from "../sharedComponents/Sidebar";

const CMSLayout = ({ children }: any) => {
  return (
    <main className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />
      {/* <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"> */}
      <div className="w-full">
        {/* === Navbar === */}
        <Navbar />
        {children}
      </div>
    </main>
  );
};

export default CMSLayout;

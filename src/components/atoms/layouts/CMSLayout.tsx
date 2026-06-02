import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";

const CMSLayout = ({ children }: any) => {
  return (
    <main className="flex h-screen w-full bg-gray-100 dark:bg-zinc-900 overflow-hidden transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-col h-full w-full overflow-hidden">
        <Navbar />

        <div id="global-content-scroll" className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default CMSLayout;

import { useEffect, useRef, useState } from "react";
import { ImExit } from "react-icons/im";

const LogOut = () => {
  const logoutRef = useRef<HTMLDivElement | null>(null);
  const [openLogout, setOpenLogout] = useState(false);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setOpenLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer"
      ref={logoutRef}
      onClick={() => {
        setOpenLogout(!openLogout);
      }}
    >
      <div className="h-10 w-10 rounded-lg text-center flex items-center justify-center bg-white shadow-xs font-semibold">
        AN
      </div>

      <h1 className="text-lg font-semibold ">Hola, acep</h1>

      {openLogout && (
        <div className="absolute top-12 shadow-xs right-0 bg-white rounded-md p-2 w-40 animate-fadeIn z-50">
          <button className="w-full flex gap-2 items-center p-2 rounded-md text-sm hover:bg-gray-100 ">
            <ImExit fontSize={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LogOut;

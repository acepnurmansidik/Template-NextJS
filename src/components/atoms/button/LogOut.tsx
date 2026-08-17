"use client";

import { useEffect, useRef, useState } from "react";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/navigation";
import { clearToken, getUserInfo, UserInfo } from "@/utils/secureCookie";
import { disconnectSocket } from "@/utils/socket";

const defaultValue = { name: "", email: "", role: "" };

const LogOut = () => {
  const router = useRouter();
  const logoutRef = useRef<HTMLDivElement | null>(null);
  const [openLogout, setOpenLogout] = useState(false);
  const [getUser, setGetUser] = useState<UserInfo>(defaultValue);

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

  // Hapus token terenkripsi, tutup socket, lalu kembali ke halaman login.
  const handleLogout = () => {
    clearToken();
    disconnectSocket();
    router.push("/auth/login");
  };

  useEffect(() => {
    setGetUser(getUserInfo() ?? defaultValue);
  }, []);

  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer select-none"
      ref={logoutRef}
      onClick={() => {
        setOpenLogout(!openLogout);
      }}
    >
      {/* Avatar Box: Ditambahkan dark:bg-zinc-700 dark:text-zinc-100 */}
      <div className="h-10 w-10 rounded-lg text-center flex items-center justify-center bg-white dark:bg-zinc-700 shadow-xs text-gray-900 dark:text-zinc-100 font-semibold transition-colors duration-300">
        AN
      </div>

      {/* Nama User: Ditambahkan dark:text-zinc-200 */}
      <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-200 hidden sm:block">
        Hola, {getUser.name.split(" ")[0]}
      </h1>

      {/* Logout Dropdown: Menggunakan shadow-xl tanpa border, background menyesuaikan tema */}
      {openLogout && (
        <div className="absolute top-12 shadow-xl right-0 bg-white dark:bg-zinc-800 rounded-md p-1.5 w-40 animate-fadeIn z-50 transition-all duration-300">
          <div className="flex mb-1 gap-1 justify-evenly items-center">
            <div className="w-7 h-7 bg-gray-100 rounded-md flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-icon lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs text-gray-400 truncate">
                @
                <span className="text-xs text-gray-900 font-medium">
                  {getUser.name}
                </span>
              </span>
              <span className="text-xs text-gray-400">{getUser.role}</span>
            </div>
          </div>
          <hr className="border-gray-200" />
          <button
            onClick={handleLogout}
            className="w-full flex gap-2 items-center p-2 rounded-md text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            <ImExit fontSize={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LogOut;

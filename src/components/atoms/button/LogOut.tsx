"use client";

import { useEffect, useRef, useState } from "react";
import { ImExit } from "react-icons/im";
import { useRouter } from "next/navigation";
import { clearToken, getUserInfo, UserInfo } from "@/utils/secureCookie";
import { disconnectSocket } from "@/utils/socket";

const defaultValue = { name: "", email: "" };

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
        Hola, {getUser.name}
      </h1>

      {/* Logout Dropdown: Menggunakan shadow-xl tanpa border, background menyesuaikan tema */}
      {openLogout && (
        <div className="absolute top-12 shadow-xl right-0 bg-white dark:bg-zinc-800 rounded-md p-1.5 w-40 animate-fadeIn z-50 transition-all duration-300">
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

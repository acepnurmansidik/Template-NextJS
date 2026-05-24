import { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

const Notification = () => {
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [openNotif, setOpenNotif] = useState(false);
  const [initiateDataNotifications, setInitiateDataNotifications] = useState<
    any[]
  >([]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      {/* Tombol Lonceng: Ditambahkan dark:bg-zinc-700 dark:hover:bg-zinc-600 */}
      <div
        className="relative h-10 w-10 bg-white dark:bg-zinc-700 shadow-xs hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300"
        onClick={() => {
          setOpenNotif(!openNotif);
        }}
      >
        <IoNotificationsOutline
          fontSize={20}
          className="text-gray-700 dark:text-zinc-200"
        />

        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
          {initiateDataNotifications.length}
        </span>
      </div>

      {/* Notif dropdown: Menggunakan shadow-xl, tanpa border tambahan, background menyesuaikan dark mode */}
      {openNotif && (
        <div className="absolute top-12 right-0 w-72 bg-white dark:bg-zinc-800 rounded-md shadow-xl p-3 z-50 animate-fadeIn transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              Notifications
            </h2>

            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              Mark as read
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {initiateDataNotifications.length === 0 ? (
              <div className="p-2 rounded-md flex justify-center items-center gap-2 flex-col">
                <p className="text-gray-700 dark:text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-inbox-icon lucide-inbox"
                  >
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                </p>
                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  There are no notifications
                </span>
              </div>
            ) : (
              Array(5)
                .fill(null)
                .map((_, i) => (
                  // Item List Notifikasi: Menggunakan bg alternatif tipis untuk dark mode tanpa border
                  <div
                    key={i}
                    className="p-2 rounded-md bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors duration-200"
                  >
                    <p className="text-sm text-gray-700 dark:text-zinc-300">
                      Pesan notifikasi ke-{i + 1}
                    </p>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                      2 minutes ago
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;

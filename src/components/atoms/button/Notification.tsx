import { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { VscInbox } from "react-icons/vsc";

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
      <div
        className="relative h-10 w-10 bg-white shadow-xs hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
        onClick={() => {
          setOpenNotif(!openNotif);
        }}
      >
        <IoNotificationsOutline fontSize={20} className="text-gray-700" />

        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
          {initiateDataNotifications.length}
        </span>
      </div>

      {/* Notif dropdown */}
      {openNotif && (
        <div className="absolute top-12 right-0 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-50 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold ">Notifications</h2>

            <button className="text-xs text-blue-600 hover:underline cursor-pointer">
              Read All
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {initiateDataNotifications.length === 0 ? (
              <div className="p-2 rounded-md cursor-pointer flex justify-center items-center gap-2 flex-col">
                <p className="text-gray-700">
                  <VscInbox className="text-4xl" />
                </p>
                <span className="text-xs text-gray-400">
                  There's are not notification
                </span>
              </div>
            ) : (
              Array(5)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-700">
                      Pesan notifikasi ke-{i + 1}
                    </p>
                    <span className="text-[10px] text-gray-400">
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

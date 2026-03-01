"use client";

import { useEffect, useState, useCallback } from "react";
import { IoClose } from "react-icons/io5"; // Menggunakan ionicons untuk look yang lebih clean

interface DataProps {
  title: string;
  onClose: () => void;
}

const MediumModal = ({ title, onClose }: DataProps) => {
  const [show, setShow] = useState(false);

  const handleClose = useCallback(() => {
    setShow(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    // Lock scroll body
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleClose]);

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex items-center justify-center z-999 px-4 transition-all duration-500 ease-in-out
      ${show ? "bg-slate-900/30  opacity-100" : "bg-transparent  opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${show ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-[0.97]"} max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/60`}
      >
        {/* HEADER */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0 border-b border-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 leading-none">
              {title} Details
            </h2>
            <p className="text-[13px] text-slate-500 mt-1.5 font-medium">
              View and manage information for this section.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 hover:text-red-500 text-slate-400 hover:bg-slate-50 rounded-full transition-all duration-200 cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Description
              </label>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Ini adalah modal dengan referensi UI modern. Mengutamakan
                <span className="text-indigo-600 font-medium px-1">
                  white space
                </span>
                dan kontras yang lembut agar mata pengguna tidak cepat lelah.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    Active
                  </span>
                </div>
              </div>
              <div className="p-3 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Priority
                </span>
                <span className="block mt-1 text-sm font-semibold text-slate-700">
                  High
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 flex items-center justify-end gap-3 bg-slate-50/30 border-t border-slate-100 shrink-0">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MediumModal;

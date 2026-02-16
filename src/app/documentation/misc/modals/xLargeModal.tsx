"use client";

import { useEffect, useState } from "react";

interface DataProps {
  title: string;
  onClose: () => void;
}

const XLargeModal = ({ title, onClose }: DataProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex items-center justify-center 
      bg-black/50 backdrop-blur-sm z-50 px-4
      transition-opacity duration-300
      ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl bg-white rounded-2xl shadow-2xl
        transform transition-all duration-300
        ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        max-h-[80vh] flex flex-col overflow-hidden`}
      >
        <div className="p-6 shrink-0 relative">
          <h2 className="text-2xl font-bold text-gray-800">{title} Modal</h2>
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 text-lg cursor-pointer transition-all duration-200 ease-out hover:text-red-500 hover:scale-110 active:scale-115 hover:font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-gray-600 leading-relaxed">
            Modal extra besar untuk tabel / preview kompleks.
          </p>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 hover:cursor-pointer rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default XLargeModal;

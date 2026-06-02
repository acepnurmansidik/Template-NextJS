"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import Select from "react-select";

type Option = { value: string; label: string };

const dummyData = [
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "garut", label: "Garut" },
  { value: "tasikmalaya", label: "Tasikmalaya" },
  { value: "semarang", label: "Semarang" },
  { value: "malang", label: "Malang" },
];

export default function MultiSelect() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi API
    setTimeout(() => {
      setOptions(dummyData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Mencegah rendering di server untuk menghindari masalah Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const codeCopied = `<Select
  isMulti
  isLoading={isLoading}
  instanceId="my-multi-select"
  classNamePrefix="rs"
  placeholder="Cari atau pilih kota..."
  options={dummyData}
  onChange={(vals) => {
    // Logic here...
  }}
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  if (!mounted) return null; // Atau tampilkan loading skeleton

  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Multi Select
        </label>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "code"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Tambahkan instanceId untuk menstabilkan ID internal react-select */}
      <div className="">
        {activeTab === "preview" ? (
          <Select
            isMulti
            isLoading={isLoading}
            instanceId="my-multi-select"
            classNamePrefix="rs"
            placeholder="Cari atau pilih kota..."
            options={dummyData}
            onChange={(vals) => {
              // Logic here...
            }}
          />
        ) : (
          <div className="relative group">
            {/* Tombol Copy */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 rounded-md text-zinc-400 hover:text-white z-10"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>

            {/* Simulasi Code Editor */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700 font-mono text-[13px]">
              <div className="flex p-4 overflow-x-auto">
                <div className="text-zinc-600 text-right pr-4 select-none">
                  {codeCopied.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="text-blue-300">
                  <code>{codeCopied}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

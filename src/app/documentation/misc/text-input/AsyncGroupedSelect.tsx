"use client";

import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { GroupBase } from "react-select";
import { FaCheck, FaCopy } from "react-icons/fa";

type Option = { value: string; label: string };
type GroupedOption = { label: string; options: Option[] };

// Data dummy untuk simulasi API
const groupedData: GroupedOption[] = [
  {
    label: "Pulau Jawa",
    options: [
      { value: "jakarta", label: "Jakarta" },
      { value: "bandung", label: "Bandung" },
    ],
  },
  {
    label: "Luar Pulau",
    options: [
      { value: "medan", label: "Medan" },
      { value: "makassar", label: "Makassar" },
    ],
  },
];

export default function AsyncGroupedSelect() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fungsi simulasi fetch API
  const loadOptions = (
    inputValue: string,
    callback: (options: GroupBase<Option>[]) => void,
  ) => {
    setTimeout(() => {
      const filtered = groupedData
        .map((group) => ({
          ...group,
          options: group.options.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        }))
        .filter((group) => group.options.length > 0);
      callback(filtered);
    }, 1000);
  };

  const codeCopied = `<AsyncSelect
  cacheOptions
  defaultOptions={groupedData}
  loadOptions={loadOptions}
  instanceId="async-grouped-select"
  classNamePrefix="rs"
  placeholder="Cari wilayah..."
  menuPortalTarget={
    typeof document !== "undefined" ? document.body : null
  }
  onChange={(vals) => {
    // Logic here...
  }}
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  }}
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Group Searchable Select
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

      <div className="">
        {activeTab === "preview" ? (
          <AsyncSelect
            cacheOptions
            defaultOptions={groupedData}
            loadOptions={loadOptions}
            instanceId="async-grouped-select"
            classNamePrefix="rs"
            placeholder="Cari wilayah..."
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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

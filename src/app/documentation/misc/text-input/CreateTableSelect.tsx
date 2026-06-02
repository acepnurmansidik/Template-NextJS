"use client";

import { ActionDefaultOption, actionDefaultOptions } from "@/utils/utils";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function CreateTableSelect() {
  const [data, setData] = useState<ActionDefaultOption[]>([]);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const codeCopied = `<CreatableSelect
  isMulti
  instanceId="select-table"
  classNamePrefix="rs"
  options={actionDefaultOptions}
  placeholder="Type & Enter..."
  isValidNewOption={(inputValue) => inputValue.trim().length > 0}
  onChange={(vals) => {
    // Logic here...
  }}
  formatCreateLabel={(inputValue) => \`Add action: "\${inputValue}"\`}
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-xl">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Create table select
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

      {/* Content Area */}
      <div className="">
        {activeTab === "preview" ? (
          <CreatableSelect
            isMulti
            instanceId="select-table"
            classNamePrefix="rs"
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            value={data}
            options={actionDefaultOptions}
            placeholder="Type & Enter..."
            isValidNewOption={(inputValue) => inputValue.trim().length > 0}
            onChange={(vals) => {
              const uniqueData = Array.from(
                new Map(vals.map((item) => [item.value, item])).values(),
              );
              setData(uniqueData);
            }}
            formatCreateLabel={(inputValue) => `Add action: "${inputValue}"`}
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

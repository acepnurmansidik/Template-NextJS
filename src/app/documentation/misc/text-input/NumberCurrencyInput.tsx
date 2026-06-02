"use client";
import { ATRIBUTE_HTML, TAG_HTML, TAILWIND_CSS } from "@/utils/utils";
import React, { useState, useEffect } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

interface NumberCurrencyInputProps {
  country?: "id-ID" | "en-US" | "de-DE";
}

export default function NumberCurrencyInput({
  country = "id-ID",
}: NumberCurrencyInputProps) {
  const [value, setValue] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const codeCopied = `<input
  type="text"
  value={value}
  onChange={(e) => {}}
  placeholder={"here..."}
  className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const symbol = new Intl.NumberFormat(country, {
      style: "currency",
      currency:
        country === "id-ID" ? "IDR" : country === "en-US" ? "USD" : "EUR",
    })
      .format(0)
      .replace(/\d/g, "")
      .trim();
    setCurrencySymbol(symbol);
  }, [country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setValue("");
      return;
    }
    const formatter = new Intl.NumberFormat(country);
    setValue(`${currencySymbol} ${formatter.format(Number(rawValue))}`);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Currency Input
        </label>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === "preview" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-500"}`}
          >
            PREVIEW
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === "code" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-500"}`}
          >
            CODE
          </button>
        </div>
      </div>

      <div className="min-h-30">
        {activeTab === "preview" ? (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={`${currencySymbol} 0`}
            className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
          />
        ) : (
          <div className="relative group bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700 font-mono text-[13px]">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 rounded-md text-zinc-400 hover:text-white z-10"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>

            <div className="flex p-4 overflow-x-auto text-[13px]">
              <div className="text-zinc-600 text-right pr-4 select-none">
                {codeCopied.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="text-zinc-200">
                <code>
                  {codeCopied.split("\n").map((line, i) => (
                    <div key={i}>
                      {line.split(/(\s|=|<|>|\(|\)|{|}|"|')/).map((part, j) => {
                        if (TAG_HTML.includes(part))
                          return (
                            <span key={j} className="text-red-500">
                              {part}
                            </span>
                          );
                        if (ATRIBUTE_HTML.includes(part))
                          return (
                            <span key={j} className="text-yellow-300">
                              {part}
                            </span>
                          );

                        if (["="].includes(part))
                          return (
                            <span key={j} className="text-orange-500">
                              {part}
                            </span>
                          );
                        if (["()", "{}"].includes(part))
                          return (
                            <span key={j} className="text-blue-500">
                              {part}
                            </span>
                          );
                        if (["(", ")", "{", "}", '"', "'"].includes(part))
                          return (
                            <span key={j} className="text-green-500">
                              {part}
                            </span>
                          );
                        if (TAILWIND_CSS.includes(part))
                          return (
                            <span key={j} className="text-green-500">
                              {part}
                            </span>
                          );

                        return <span key={j}>{part}</span>;
                      })}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

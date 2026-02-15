import React from "react";

export default function TextAreaInput() {
  /* ======================== INPUT ======================== */
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  return (
    <div>
      <label className="text-sm font-semibold">Text Area</label>
      <textarea
        className="w-full mt-1 p-2 border bg-white border-slate-300 outline-none rounded-lg text-sm"
        rows={4}
        placeholder="Short description about yourself"
        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
      ></textarea>
    </div>
  );
}

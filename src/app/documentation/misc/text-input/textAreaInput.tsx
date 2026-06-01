"use client";

export const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};
export default function TextAreaInput() {
  return (
    <div className="group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 ml-0.5 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        Description Area
      </label>
      <textarea
        className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none overflow-hidden"
        rows={3}
        placeholder="Short description about yourself..."
        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
      ></textarea>
    </div>
  );
}

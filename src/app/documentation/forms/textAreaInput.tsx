export default function TextAreaInput() {
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1">
        About Me
      </label>
      <textarea
        className="w-full bg-white px-4 py-3 border border-slate-200 outline-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-h-30"
        placeholder="Tell us about yourself..."
        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
      ></textarea>
    </div>
  );
}

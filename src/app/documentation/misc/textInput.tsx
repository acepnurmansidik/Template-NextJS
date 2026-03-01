export default function TextInput() {
  return (
    <div className="group flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-slate-700 ml-1">
        Text Input
      </label>
      <input
        type="text"
        className="w-full bg-white px-4 py-2.5 border border-slate-200 outline-none rounded-xl text-sm text-slate-900 placeholder:text-slate-400 placeholder:italic transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        placeholder="Type something here..."
      />
    </div>
  );
}

export default function TextInput() {
  return (
    <div>
      <label className="text-sm font-semibold">Text Input</label>
      <input
        type="text"
        className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic"
        placeholder="Input here..."
      />
    </div>
  );
}

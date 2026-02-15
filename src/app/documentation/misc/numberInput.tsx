export default function NumberInput() {
  return (
    <div>
      <label className="text-sm font-semibold">Number Input</label>
      <input
        type="number"
        className="w-full bg-white mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm placeholder:italic [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="Input here..."
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
      />
    </div>
  );
}

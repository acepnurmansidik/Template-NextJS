export default function Loading() {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-5 py-16">
      <div className="relative h-16 w-16">
        {/* Ring dasar */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-zinc-700" />
        {/* Ring berputar */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-500" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
          Loading data
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 animate-pulse">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}

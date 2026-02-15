export function CustomLegend({ payload }: any) {
  return (
    <div className="flex gap-4 mt-2">
      {payload.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-slate-600">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

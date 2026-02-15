// components/custom/CustomTooltip.tsx

export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 min-w-35">
      {/* Label (judul) */}
      {label && <p className="text-xs text-slate-400 mb-1">{label}</p>}

      {/* Render payload dinamis */}
      {payload.map((item: any, idx: number) => {
        const color =
          item.color || item.payload?.fill || item.payload?.stroke || "#6366F1";

        const name = item.name || item.payload?.name || "Value";
        const value = item.value ?? item.payload?.value;

        return (
          <div key={idx} className="flex items-center gap-2 mb-1">
            {/* Bullet */}
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            ></span>

            <span className="text-sm text-slate-700 font-medium">
              {name}: {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

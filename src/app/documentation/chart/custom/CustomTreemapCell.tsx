// components/custom/CustomTreemapCell.tsx

import { COLOR_PALETTE } from "@/utils/utility";

export function CustomTreemapCell(props: any) {
  const { x, y, width, height, name, size, index } = props;

  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];

  const isTiny = width < 60 || height < 40;

  return (
    <g>
      {/* Flat block (NO rounded, NO curve) */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={0.88}
        stroke="#ffffff"
        strokeWidth={1.5}
      />

      {/* Tiny cell mode */}
      {isTiny ? (
        <circle
          cx={x + width / 2}
          cy={y + height / 2}
          r={3.5}
          fill="#fff"
          opacity={0.9}
        />
      ) : (
        <>
          {/* Name */}
          <text
            x={x + 10}
            y={y + 20}
            fontSize={13}
            fontWeight="600"
            fill="#ffffff"
            style={{
              textShadow: "0 1px 1px rgba(0,0,0,0.25)",
            }}
          >
            {name}
          </text>

          {/* Value */}
          <text
            x={x + 10}
            y={y + 38}
            fontSize={12}
            fill="#e2e8f0"
            style={{
              opacity: 0.95,
            }}
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
}

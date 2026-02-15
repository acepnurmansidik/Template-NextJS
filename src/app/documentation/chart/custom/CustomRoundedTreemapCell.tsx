// components/custom/CustomTreemapCell.tsx

import { COLOR_PALETTE } from "@/utils/utility";

export function CustomRoundedTreemapCell(props: any) {
  const { x, y, width, height, name, size, index } = props;

  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];

  // Avoid rendering text if box too small
  const isTiny = width < 60 || height < 40;

  return (
    <g>
      {/* Background box */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill={color}
        fillOpacity={0.9}
        stroke="#ffffff"
        strokeWidth={2}
      />

      {/* If tiny cells, render a dot only */}
      {isTiny ? (
        <circle
          cx={x + width / 2}
          cy={y + height / 2}
          r={4}
          fill="#fff"
          opacity={0.8}
        />
      ) : (
        <>
          {/* Name */}
          <text
            x={x + 12}
            y={y + 22}
            fontSize={13}
            fontWeight="bold"
            fill="#ffffff"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
          >
            {name}
          </text>

          {/* Value */}
          <text
            x={x + 12}
            y={y + 42}
            fontSize={12}
            fill="#f1f5f9"
            style={{ opacity: 0.9 }}
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
}

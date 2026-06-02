import { ReactNode } from "react";

type TooltipProps = {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({
  text,
  children,
  position = "top",
}: TooltipProps) {
  return (
    <div className="relative inline-block group">
      {children}

      <div
        className={`
          absolute z-20 hidden group-hover:block whitespace-nowrap
          px-2 py-1 text-xs rounded-md text-white bg-black
          transition-opacity duration-150
          ${
            position === "top"
              ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
              : position === "bottom"
                ? "top-full left-1/2 -translate-x-1/2 mt-2"
                : position === "left"
                  ? "right-full top-1/2 -translate-y-1/2 mr-2"
                  : "left-full top-1/2 -translate-y-1/2 ml-2"
          }
        `}
      >
        {text}
      </div>
    </div>
  );
}

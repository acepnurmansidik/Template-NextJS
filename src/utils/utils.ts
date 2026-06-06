export const CHART_COLORS = [
  "#3B82F6", // Blue-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#8B5CF6", // Violet-500
  "#EC4899", // Pink-500
  "#06B6D4", // Cyan-500
  "#F97316", // Orange-500
  "#6366F1", // Indigo-500
  "#14B8A6", // Teal-500
  "#84CC16", // Lime-500
  "#D946EF", // Fuchsia-500
  "#64748B", // Slate-500
  "#A855F7", // Purple-500
  "#E11D48", // Rose-500
  "#0EA5E9", // Sky-500
  "#22C55E", // Green-500
  "#EAB308", // Yellow-500
  "#6B7280", // Gray-500
  "#7C3AED", // Violet-600
];

export const TAILWIND_CSS =
  "w-full bg-white dark:bg-zinc-950 transition-all dark:text-zinc-100 duration-200 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none overflow-hidden";
export const TAG_HTML = ["input", "/input", "textarea", "/textarea"];
export const ATRIBUTE_HTML = [
  "type",
  "value",
  "onChange",
  "onWheel",
  "placeholder",
  "className",
  "rows",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "key",
  "isMulti",
  "id",
  "instanceId",
  "classNamePrefix",
  "options",
  "isValidNewOption",
  "formatCreateLabel",
  "sensors",
  "collisionDetection",
  "onDragStart",
  "onDragEnd",
];

export interface ActionDefaultOption {
  value: string;
  label: string;
}

export const actionDefaultOptions: ActionDefaultOption[] = [
  { value: "pdf", label: "pdf" },
  { value: "view", label: "view" },
  { value: "create", label: "create" },
  { value: "update", label: "update" },
  { value: "delete", label: "delete" },
  { value: "export", label: "export" },
  { value: "import", label: "import" },
  { value: "whatsapp", label: "whatsapp" },
];

export const subActionDefaultOptions: ActionDefaultOption[] = [
  { value: "pdf", label: "pdf" },
  { value: "view", label: "view" },
  { value: "create", label: "create" },
  { value: "update", label: "update" },
  { value: "delete", label: "delete" },
  { value: "export", label: "export" },
  { value: "import", label: "import" },
  { value: "whatsapp", label: "whatsapp" },
];

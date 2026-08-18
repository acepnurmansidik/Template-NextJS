"use client";

import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiBox,
  FiClipboard,
  FiCircle,
  FiDollarSign,
  FiFileMinus,
  FiGitBranch,
  FiHome,
  FiInbox,
  FiLayers,
  FiPackage,
  FiRepeat,
  FiShoppingCart,
  FiTag,
  FiTrendingDown,
  FiTrendingUp,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import {
  ActiveBlock,
  DashItem,
  GroupBlock,
  MetricBlock,
  StatusBlock,
  colorHex,
  statusMeta,
} from "@/utils/dashboard";
import { formatCurrencyPure } from "@/utils/formatter";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Ikon modern (Feather) per sub-modul.
const ICONS: Record<string, IconType> = {
  purchase_request: FiClipboard,
  purchase_order: FiShoppingCart,
  good_receipt: FiInbox,
  delivery_order: FiTruck,
  journal_entry: FiBookOpen,
  journal_write_off: FiFileMinus,
  account_receivable: FiTrendingUp,
  account_payable: FiTrendingDown,
  chart_of_account: FiGitBranch,
  product: FiPackage,
  product_category: FiTag,
  uom: FiBox,
  warehouse: FiHome,
  supplier: FiUsers,
  supplier_pricing: FiDollarSign,
  stock_position: FiLayers,
  stock_movement: FiRepeat,
};

type Entry = { label: string; value: number; color: string };

// ---- Shell ----

const CardShell = ({
  item,
  children,
}: {
  item: DashItem;
  children: React.ReactNode;
}) => {
  const c = colorHex(item.accent);
  const Icon = ICONS[item.dataKey] ?? FiCircle;
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_2px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_34px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ backgroundColor: c }}
      />
      <div className="relative p-5">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${c}1f`, color: c }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
              {item.title}
            </p>
            <p className="mt-0.5 inline-block rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400 truncate max-w-[190px]">
              {item.path}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

const AmountFooter = ({ label, value }: { label: string; value: number }) => (
  <div className="mt-4 flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 px-3.5 py-2.5">
    <span className="text-[11px] uppercase tracking-widest text-zinc-400">
      {label}
    </span>
    <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 tabular-nums">
      Rp {formatCurrencyPure(value)}
    </span>
  </div>
);

// ---- Donut (chart) + legenda informatif ----

const DonutBody = ({
  item,
  entries,
  legend = true,
}: {
  item: DashItem;
  entries: Entry[];
  legend?: boolean;
}) => {
  const c = colorHex(item.accent);
  const total = entries.reduce((a, e) => a + e.value, 0);
  const slices = entries.filter((e) => e.value > 0);

  if (total === 0) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-28 w-28 shrink-0 rounded-full border-[10px] border-zinc-100 dark:border-zinc-800" />
        <p className="text-xs text-zinc-400">Belum ada data 🌱</p>
      </div>
    );
  }

  return (
    <div
      className={legend ? "flex items-center gap-4" : "flex items-center justify-center"}
    >
      <div className={`relative shrink-0 ${legend ? "h-28 w-28" : "h-36 w-36"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="96%"
              paddingAngle={slices.length > 1 ? 3 : 0}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {slices.map((e, i) => (
                <Cell key={i} fill={e.color} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ zIndex: 60, outline: "none" }}
              cursor={false}
              contentStyle={{
                background: "rgba(24,24,27,0.96)",
                border: "none",
                borderRadius: 14,
                fontSize: 12,
                padding: "8px 12px",
                boxShadow: "0 14px 38px rgba(0,0,0,0.30)",
              }}
              labelStyle={{
                color: "#fafafa",
                fontWeight: 700,
                marginBottom: 2,
              }}
              itemStyle={{ color: "#e4e4e7" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums" style={{ color: c }}>
            {total}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-400">
            Total
          </span>
        </div>
      </div>

      {legend && (
        <ul className="flex-1 min-w-0 space-y-1.5">
          {entries.map((e, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: e.color }}
              />
              <span className="flex-1 truncate text-zinc-500 dark:text-zinc-400">
                {e.label}
              </span>
              <span className="font-bold tabular-nums text-zinc-800 dark:text-zinc-200">
                {e.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---- Cards per kind ----

const statusEntries = (data: StatusBlock): Entry[] =>
  Object.entries(data.by_status ?? {}).map(([k, v]) => {
    const meta = statusMeta(k);
    return { label: meta.label, value: v, color: colorHex(meta.color) };
  });

const StatusCard = ({ item, data }: { item: DashItem; data: StatusBlock }) => {
  const amount =
    item.amountField && typeof data[item.amountField] === "number"
      ? (data[item.amountField] as number)
      : undefined;
  return (
    <CardShell item={item}>
      <DonutBody item={item} entries={statusEntries(data)} />
      {item.amountField && amount !== undefined && (
        <AmountFooter label={item.amountLabel ?? "Total"} value={amount} />
      )}
    </CardShell>
  );
};

const ActiveCard = ({ item, data }: { item: DashItem; data: ActiveBlock }) => (
  <CardShell item={item}>
    <DonutBody
      item={item}
      entries={[
        { label: "Active", value: data.active ?? 0, color: colorHex("emerald") },
        { label: "Inactive", value: data.inactive ?? 0, color: colorHex("zinc") },
      ]}
    />
  </CardShell>
);

// COA: donut TANPA legenda (banyak kategori) — cukup ring + total di tengah.
const GroupCard = ({ item, data }: { item: DashItem; data: GroupBlock }) => {
  const entries: Entry[] = Object.entries(data.by ?? {}).map(([k, v]) => {
    const meta = statusMeta(k);
    return { label: meta.label, value: v, color: colorHex(meta.color) };
  });
  return (
    <CardShell item={item}>
      <DonutBody item={item} entries={entries} legend={false} />
    </CardShell>
  );
};

const MetricCard = ({ item, data }: { item: DashItem; data: MetricBlock }) => (
  <CardShell item={item}>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400">
          Positions
        </p>
        <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tabular-nums">
          {data.total ?? 0}
        </p>
      </div>
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400">
          Total Qty
        </p>
        <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tabular-nums">
          {formatCurrencyPure(data.total_quantity ?? 0)}
        </p>
      </div>
    </div>
  </CardShell>
);

// Dispatcher berdasarkan kind.
export const DashboardCard = ({
  item,
  data,
}: {
  item: DashItem;
  data: unknown;
}) => {
  if (!data) return null;
  switch (item.kind) {
    case "status":
      return <StatusCard item={item} data={data as StatusBlock} />;
    case "active":
      return <ActiveCard item={item} data={data as ActiveBlock} />;
    case "group":
      return <GroupCard item={item} data={data as GroupBlock} />;
    case "metric":
      return <MetricCard item={item} data={data as MetricBlock} />;
    default:
      return null;
  }
};

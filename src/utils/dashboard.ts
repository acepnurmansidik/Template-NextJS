// ============================================================
// DASHBOARD — konfigurasi & tipe (fitur terpisah, mirip Export/Import).
// Registry modul → item, tiap item DIBERI `path` (key halaman). Komponen
// dashboard hanya dirender bila user punya akses ke path tersebut (localStorage
// via getAccess()). Data di-fetch PER TAB modul (lazy), bukan per komponen.
// ============================================================

// ---- Bentuk data dari backend (agregasi) ----
export interface StatusBlock {
  total: number;
  by_status: Record<string, number>;
  total_amount?: number;
  paid_amount?: number;
  total_remaining?: number;
}
export interface ActiveBlock {
  total: number;
  active: number;
  inactive: number;
}
export interface GroupBlock {
  total: number;
  by: Record<string, number>;
}
export interface MetricBlock {
  total: number;
  total_quantity: number;
}
export interface CashFlow {
  income: number;
  expense: number;
  net: number;
  monthly: { month: string; income: number; expense: number }[];
}
export type ModuleData = Record<string, unknown>;

export type DashKind = "status" | "active" | "group" | "metric";

export interface DashItem {
  path: string; // access key + react key (mis. "/procurement/purchase-requests")
  title: string;
  dataKey: string; // key di response modul
  kind: DashKind;
  accent: string; // token warna (lihat COLORS)
  icon: string; // emoji
  amountField?: keyof StatusBlock; // untuk kind status: tampilkan sum (mis. total_amount)
  amountLabel?: string;
}

export interface DashModule {
  key: "procurement" | "finance" | "inventory";
  label: string;
  icon: string;
  endpoint: string;
  items: DashItem[];
  // Kartu tambahan khusus (mis. cash flow finance) — dirender bila punya akses
  // ke `gatePath`.
  cashFlowGatePath?: string;
}

export const DASHBOARD_MODULES: DashModule[] = [
  {
    key: "procurement",
    label: "Procurement",
    icon: "📦",
    endpoint: "/dashboard/procurement",
    items: [
      { path: "/procurement/purchase-requests", title: "Purchase Request", dataKey: "purchase_request", kind: "status", accent: "indigo", icon: "📝", amountField: "total_amount", amountLabel: "Total nilai" },
      { path: "/procurement/purchase-orders", title: "Purchase Order", dataKey: "purchase_order", kind: "status", accent: "blue", icon: "🧾", amountField: "total_amount", amountLabel: "Total nilai" },
      { path: "/procurement/good-receipts", title: "Good Receipt", dataKey: "good_receipt", kind: "status", accent: "emerald", icon: "📥", amountField: "total_amount", amountLabel: "Total nilai" },
      { path: "/procurement/delivery-orders", title: "Delivery Order", dataKey: "delivery_order", kind: "status", accent: "amber", icon: "🚚" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: "💰",
    endpoint: "/dashboard/finance",
    cashFlowGatePath: "/finance/journal-entries",
    items: [
      { path: "/finance/journal-entries", title: "Journal Entry", dataKey: "journal_entry", kind: "status", accent: "indigo", icon: "📒" },
      { path: "/finance/journal-write-offs", title: "Journal Write-Off", dataKey: "journal_write_off", kind: "status", accent: "rose", icon: "🗑️" },
      { path: "/finance/chart-of-accounts", title: "Chart of Account", dataKey: "chart_of_account", kind: "group", accent: "violet", icon: "🌳" },
      { path: "/finance/account-payables", title: "Account Payable", dataKey: "account_payable", kind: "status", accent: "amber", icon: "📉", amountField: "total_amount", amountLabel: "Total utang" },
      { path: "/finance/account-receivables", title: "Account Receivable", dataKey: "account_receivable", kind: "status", accent: "emerald", icon: "📈", amountField: "total_amount", amountLabel: "Total tagihan" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: "🏬",
    endpoint: "/dashboard/inventory",
    items: [
      { path: "/inventory/stock-movements", title: "Stock Movement", dataKey: "stock_movement", kind: "status", accent: "orange", icon: "🔄" },
      { path: "/inventory/product-categories", title: "Product Category", dataKey: "product_category", kind: "active", accent: "violet", icon: "🏷️" },
      { path: "/inventory/uom", title: "UOM", dataKey: "uom", kind: "active", accent: "cyan", icon: "📏" },
      { path: "/inventory/warehouses", title: "Warehouse", dataKey: "warehouse", kind: "active", accent: "emerald", icon: "🏭" },
      { path: "/inventory/suppliers", title: "Supplier", dataKey: "supplier", kind: "active", accent: "amber", icon: "🤝" },
      { path: "/inventory/supplier-pricing", title: "Supplier Pricing", dataKey: "supplier_pricing", kind: "active", accent: "teal", icon: "💲" },
      { path: "/inventory/stock-positions", title: "Stock Position", dataKey: "stock_position", kind: "metric", accent: "cyan", icon: "📊" },
      { path: "/inventory/products", title: "Product", dataKey: "product", kind: "active", accent: "blue", icon: "📦" },
    ],
  },
];

// Palet warna (hex; dipakai inline agar aman dari purge Tailwind).
export const COLORS: Record<string, string> = {
  zinc: "#a1a1aa",
  slate: "#94a3b8",
  gray: "#9ca3af",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  green: "#22c55e",
  amber: "#f59e0b",
  orange: "#f97316",
  rose: "#f43f5e",
  red: "#ef4444",
};

// Metadata status: label rapi + token warna.
export const STATUS_META: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "zinc" },
  SUBMITTED: { label: "Submitted", color: "blue" },
  APPROVED: { label: "Approved", color: "indigo" },
  PARTIAL_ORDERED: { label: "Partial Ordered", color: "amber" },
  ORDERED: { label: "Ordered", color: "cyan" },
  PARTIAL_RECEIVED: { label: "Partial Received", color: "orange" },
  RECEIVED: { label: "Received", color: "emerald" },
  CLOSED: { label: "Closed", color: "teal" },
  PENDING: { label: "Pending", color: "amber" },
  SHIPPED: { label: "Shipped", color: "emerald" },
  POSTED: { label: "Posted", color: "emerald" },
  OPEN: { label: "Open", color: "blue" },
  PARTIAL: { label: "Partial", color: "orange" },
  PAID: { label: "Paid", color: "emerald" },
  WRITE_OFF: { label: "Write Off", color: "rose" },
  // Stock movement type
  IN: { label: "In", color: "emerald" },
  OUT: { label: "Out", color: "rose" },
  ADJUSTMENT: { label: "Adjustment", color: "amber" },
  TRANSFER: { label: "Transfer", color: "blue" },
  // Chart of Account type
  ASSET: { label: "Asset", color: "blue" },
  LIABILITY: { label: "Liability", color: "rose" },
  EQUITY: { label: "Equity", color: "violet" },
  REVENUE: { label: "Revenue", color: "emerald" },
  EXPENSE: { label: "Expense", color: "orange" },
  CAPITAL: { label: "Capital", color: "indigo" },
  SALES: { label: "Sales", color: "green" },
  COGS: { label: "COGS", color: "amber" },
  OTHER_INCOME_EXPENSE: { label: "Other Income/Expense", color: "cyan" },
  ADM_OPERATION_EXPENSE: { label: "Adm & Operation", color: "purple" },
  DEPRECIATION_AMORTIZATION: { label: "Depreciation", color: "slate" },
  OTHERS: { label: "Others", color: "gray" },
  UNKNOWN: { label: "Unknown", color: "gray" },
};

export const statusMeta = (key: string) =>
  STATUS_META[key] ?? { label: prettyLabel(key), color: "gray" };

export const colorHex = (token: string) => COLORS[token] ?? COLORS.gray;

// "PARTIAL_RECEIVED" -> "Partial Received"
export function prettyLabel(key: string): string {
  return key
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Modul yang punya minimal 1 item yang boleh diakses user, beserta item yang
// boleh diakses saja. `has` = fungsi cek akses sebuah path.
export interface VisibleModule extends DashModule {
  items: DashItem[]; // sudah difilter sesuai akses
  showCashFlow: boolean;
}
export const visibleModules = (
  has: (path: string) => boolean,
): VisibleModule[] =>
  DASHBOARD_MODULES.map((m) => ({
    ...m,
    items: m.items.filter((it) => has(it.path)),
    showCashFlow: !!m.cashFlowGatePath && has(m.cashFlowGatePath),
  })).filter((m) => m.items.length > 0 || m.showCashFlow);

// Tipe mirror endpoint /chart-of-account (backend Codebase-NoSQL).
//
// COA berhierarki TAK TERBATAS dalam satu collection memakai pola
// adjacency-list: tiap akun menyimpan `parent_id` (self-ref) + `level` & `path`
// (materialized path kode leluhur→diri, mis. "1000.1100.1110").

export enum AccountType {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EQUITY = "EQUITY",
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE",
  CAPITAL = "CAPITAL",
  SALES = "SALES",
  COGS = "COGS",
  OTHER_INCOME_EXPENSE = "OTHER_INCOME_EXPENSE",
  ADM_OPERATION_EXPENSE = "ADM_OPERATION_EXPENSE",
  DEPRECIATION_AMORTIZATION = "DEPRECIATION_AMORTIZATION",
  OTHERS = "OTHERS",
}

export enum NormalBalance {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

// Label ramah-UI untuk tiap tipe akun (dipakai dropdown & badge).
export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  [AccountType.ASSET]: "Asset",
  [AccountType.LIABILITY]: "Liability",
  [AccountType.EQUITY]: "Equity",
  [AccountType.REVENUE]: "Revenue",
  [AccountType.EXPENSE]: "Expense",
  [AccountType.CAPITAL]: "Capital",
  [AccountType.SALES]: "Sales",
  [AccountType.COGS]: "COGS",
  [AccountType.OTHER_INCOME_EXPENSE]: "Other Income & Expense",
  [AccountType.ADM_OPERATION_EXPENSE]: "Adm & Operation Expense",
  [AccountType.DEPRECIATION_AMORTIZATION]: "Depreciation & Amortization",
  [AccountType.OTHERS]: "Others",
};

// Peta tipe → saldo normal (samakan persis dengan backend controller).
export const NORMAL_BALANCE_BY_TYPE: Record<AccountType, NormalBalance> = {
  [AccountType.ASSET]: NormalBalance.DEBIT,
  [AccountType.LIABILITY]: NormalBalance.CREDIT,
  [AccountType.EQUITY]: NormalBalance.CREDIT,
  [AccountType.REVENUE]: NormalBalance.CREDIT,
  [AccountType.EXPENSE]: NormalBalance.DEBIT,
  [AccountType.CAPITAL]: NormalBalance.CREDIT,
  [AccountType.SALES]: NormalBalance.CREDIT,
  [AccountType.COGS]: NormalBalance.DEBIT,
  [AccountType.OTHER_INCOME_EXPENSE]: NormalBalance.CREDIT,
  [AccountType.ADM_OPERATION_EXPENSE]: NormalBalance.DEBIT,
  [AccountType.DEPRECIATION_AMORTIZATION]: NormalBalance.DEBIT,
  [AccountType.OTHERS]: NormalBalance.DEBIT,
};

// Saldo normal diturunkan dari type (dipakai untuk preview di form sebelum
// server menetapkannya).
export const normalBalanceForType = (type: AccountType): NormalBalance =>
  NORMAL_BALANCE_BY_TYPE[type] ?? NormalBalance.DEBIT;

// Kode akun = materialized path (kode induk menjadi prefix, mis.
// "1000.1100.1110"). `localSegment` mengambil bagian setelah prefix induk
// (potongan terakhir), yaitu segmen yang bisa diedit user pada form.
export const localSegment = (code: string): string =>
  code.includes(".") ? code.slice(code.lastIndexOf(".") + 1) : code;

// Satu akun COA sebagaimana dikembalikan API (flat, sudah terurut by path).
export interface ChartOfAccountApiDaum {
  _id: string;
  code: string;
  name: string;
  type: AccountType;
  normal_balance: NormalBalance;
  is_header: boolean;
  parent_id: string | null;
  level: number;
  path: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Node pohon hasil build dari daftar flat (dipakai komponen Tree).
export interface ChartOfAccountNode extends ChartOfAccountApiDaum {
  children: ChartOfAccountNode[];
}

// Payload create/update.
export interface ChartOfAccountPayload {
  code: string;
  name: string;
  type?: AccountType;
  is_header: boolean;
  parent_id?: string | null;
  description?: string;
}

// Field form (code menyimpan segmen lokal saja; parent_id null = akun root).
export interface FormDataChartOfAccountProps {
  code: string;
  name: string;
  type: AccountType;
  is_header: boolean;
  parent_id: string | null;
  description: string;
}

// Susun daftar flat (terurut by path dari server) menjadi pohon berjenjang.
export const buildTree = (
  items: ChartOfAccountApiDaum[],
): ChartOfAccountNode[] => {
  const byId = new Map<string, ChartOfAccountNode>();
  const roots: ChartOfAccountNode[] = [];

  // Inisialisasi node.
  items.forEach((item) => byId.set(item._id, { ...item, children: [] }));

  // Sambungkan tiap node ke induknya. Bila induk tidak ada di hasil (mis.
  // ter-filter oleh pencarian), node diperlakukan sebagai root agar tetap
  // tampil.
  byId.forEach((node) => {
    const parent = node.parent_id ? byId.get(node.parent_id) : null;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Urutkan tiap level berdasarkan kode akun.
  const sortRec = (nodes: ChartOfAccountNode[]) => {
    nodes.sort((a, b) =>
      a.code.localeCompare(b.code, undefined, { numeric: true }),
    );
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
};

// Daftar akun yang boleh menjadi induk (hanya header, kecuali diri sendiri &
// turunannya saat mode edit — untuk mencegah siklus).
export const selectableParents = (
  items: ChartOfAccountApiDaum[],
  excludeId?: string,
): ChartOfAccountApiDaum[] =>
  items.filter((item) => {
    if (!item.is_header) return false;
    if (!excludeId) return true;
    if (item._id === excludeId) return false;
    // Turunan dikenali dari prefix path.
    const self = items.find((i) => i._id === excludeId);
    if (self && item.path.startsWith(`${self.path}.`)) return false;
    return true;
  });

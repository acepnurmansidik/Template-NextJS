// Tipe & konfigurasi bersama untuk Account Receivable (piutang) & Account
// Payable (utang). Keduanya identik secara struktur — hanya beda endpoint,
// judul, dan label pihak (Customer vs Vendor). Mirror endpoint backend
// /account-receivable & /account-payable.

export enum ArApStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  WRITE_OFF = "WRITE_OFF",
}

export const AR_AP_STATUS_LABEL: Record<ArApStatus, string> = {
  [ArApStatus.DRAFT]: "Draft",
  [ArApStatus.OPEN]: "Open",
  [ArApStatus.PARTIAL]: "Partial",
  [ArApStatus.PAID]: "Paid",
  [ArApStatus.WRITE_OFF]: "Write Off",
};

// Satu baris dokumen (kode/nama akun ter-snapshot dari COA).
export interface ArApLineApiDaum {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string;
  amount: number;
}

export interface ArApApiDaum {
  _id: string;
  entry_no: string;
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status: ArApStatus;
  lines: ArApLineApiDaum[];
  total_amount: number;
  paid_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Baris pada form (account_id boleh kosong saat baris baru).
export interface ArApLineForm {
  account_id: string;
  description: string;
  amount: number;
}

// Payload create/update.
export interface ArApPayload {
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status?: ArApStatus;
  paid_amount?: number;
  lines: {
    account_id: string;
    description?: string;
    amount: number;
  }[];
}

export interface BodyArApResponseApiDaum {
  success: boolean;
  message: string;
  code?: number;
  data: ArApApiDaum[];
  page_size?: number;
  current_page?: number;
}

export interface SingleArApResponseApiDaum {
  success: boolean;
  message: string;
  code?: number;
  data?: ArApApiDaum;
}

// Format angka ke tampilan mata uang (tanpa simbol) — 1500000 → "1.500.000".
export const formatAmount = (n: number): string =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0,
  );

// Jumlahkan nominal seluruh baris (round 2 desimal).
export const sumAmount = (lines: { amount: number }[]): number => {
  const total = lines.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
  return Math.round(total * 100) / 100;
};

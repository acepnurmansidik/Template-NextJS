// Tipe & konfigurasi untuk Account Receivable (piutang usaha / invoice ke
// customer). Mirror endpoint backend /account-receivable.

export enum AccountReceivableStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  WRITE_OFF = "WRITE_OFF",
}

export const AR_STATUS_LABEL: Record<AccountReceivableStatus, string> = {
  [AccountReceivableStatus.DRAFT]: "Draft",
  [AccountReceivableStatus.OPEN]: "Open",
  [AccountReceivableStatus.PARTIAL]: "Partial",
  [AccountReceivableStatus.PAID]: "Paid",
  [AccountReceivableStatus.WRITE_OFF]: "Write Off",
};

// Satu baris dokumen (kode/nama akun ter-snapshot dari COA).
export interface AccountReceivableLineApiDaum {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string;
  amount: number;
}

export interface AccountReceivableApiDaum {
  _id: string;
  entry_no: string;
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status: AccountReceivableStatus;
  lines: AccountReceivableLineApiDaum[];
  total_amount: number;
  paid_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Baris pada form (account_id boleh kosong saat baris baru).
export interface AccountReceivableLineForm {
  account_id: string;
  description: string;
  amount: number;
}

// Field header form (di luar lines yang punya handler tersendiri).
export interface FormDataAccountReceivableProps {
  date: string;
  due_date: string;
  party_name: string;
  reference: string;
  description: string;
  status: AccountReceivableStatus;
  paid_amount: number;
}

// Payload create/update.
export interface AccountReceivablePayload {
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status?: AccountReceivableStatus;
  paid_amount?: number;
  lines: {
    account_id: string;
    description?: string;
    amount: number;
  }[];
}
